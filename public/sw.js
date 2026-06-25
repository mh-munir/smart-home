const CACHE_NAME = "smarthome-v1";
const STATIC_ASSETS = [
  "/",
  "/products",
  "/blog",
  "/search",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Some assets may fail, that's okay
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

/**
 * Return a basic offline fallback Response when nothing is cached.
 * Previously some code paths could return `undefined`, which causes
 * "Failed to convert value to Response" errors in the browser.
 */
function createOfflineResponse() {
  return new Response("Offline", {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/plain" },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API routes and admin pages
  if (request.url.includes("/api/") || request.url.includes("/admin/")) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Network-first strategy for HTML pages
      if (request.mode === "navigate") {
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return cachedResponse || caches.match("/offline").then((r) => r || createOfflineResponse());
          });
      }

      // For Next.js runtime chunks we prefer network-first to avoid serving stale
      // JS/CSS bundles from an old service worker cache which can cause module
      // mismatches. Other large static assets (uploads) remain cache-first.
      if (request.url.includes("/_next/static/")) {
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || createOfflineResponse());
      }

      if (
        request.url.includes("/uploads/") ||
        request.url.endsWith(".png") ||
        request.url.endsWith(".jpg") ||
        request.url.endsWith(".webp") ||
        request.url.endsWith(".avif") ||
        request.url.endsWith(".css")
      ) {
        return cachedResponse || fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => createOfflineResponse());
      }

      // Network-first for everything else
      return fetch(request).catch(() => cachedResponse || createOfflineResponse());
    })
  );
});