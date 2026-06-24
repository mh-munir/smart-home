/**
 * Monitoring configuration helpers for Sentry and LogRocket.
 *
 * This file provides:
 * - Environment variable placeholders for integration
 * - Helper functions for initializing monitoring tools
 * - Type definitions for monitoring clients
 *
 * To enable Sentry:
 *   1. Set SENTRY_DSN in .env.local
 *   2. Sentry is already configured via sentry.server.config.ts / sentry.edge.config.ts
 *      and instrumentation.ts / instrumentation-client.ts
 *
 * To enable LogRocket:
 *   1. Set NEXT_PUBLIC_LOGROCKET_APP_ID in .env.local
 *   2. LogRocket is already imported in DeferredScripts.tsx (conditionally)
 */

// ---------- Types ----------

export interface MonitorConfig {
  sentryDsn?: string;
  logrocketAppId?: string;
  environment: string;
  release?: string;
}

// ---------- Helpers ----------

/**
 * Returns the current monitoring configuration from env vars.
 * Safe to call on both server and client.
 */
export function getMonitorConfig(): MonitorConfig {
  return {
    sentryDsn:
      process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
    logrocketAppId:
      process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || undefined,
    environment:
      process.env.NODE_ENV || "development",
    release:
      process.env.SENTRY_COMMIT_SHA || process.env.NEXT_PUBLIC_COMMIT_SHA || undefined,
  };
}

/**
 * Report a custom error to all configured monitoring services.
 * Safe to call anywhere — it no-ops if the service is not configured.
 */
export async function reportError(
  error: Error,
  context?: Record<string, unknown>
): Promise<void> {
  const config = getMonitorConfig();

  // Development: always log to console
  if (config.environment !== "production") {
    console.error("[Monitor]", error, context);
    return;
  }

  // Sentry
  if (config.sentryDsn) {
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, { extra: context });
    } catch {
      // Sentry not available — ignore
    }
  }

  // LogRocket
  if (config.logrocketAppId && typeof window !== "undefined") {
    try {
      const LogRocket = (await import("logrocket")).default;
      LogRocket.captureException(error);
    } catch {
      // LogRocket not available — ignore
    }
  }
}

/**
 * Identify a user in all monitoring services.
 * Call this after login / authentication.
 */
export async function identifyUser(
  userId: string,
  traits?: Record<string, string>
): Promise<void> {
  const config = getMonitorConfig();

  if (config.logrocketAppId && typeof window !== "undefined") {
    try {
      const LogRocket = (await import("logrocket")).default;
      LogRocket.identify(userId, traits);
    } catch {
      // ignore
    }
  }

  if (config.sentryDsn) {
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.setUser({ id: userId, ...traits });
    } catch {
      // ignore
    }
  }
}