"use client";

import { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Sentry.captureException(error);
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  const handleCopy = () => {
    navigator.clipboard.writeText(error.message + (error.digest ? `\nDigest: ${error.digest}` : ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-950 px-4 py-16 text-white">
          <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
              Critical error
            </p>
            <h1 className="mt-4 text-4xl font-bold">
              SmartHome Affiliate needs a refresh.
            </h1>
            <p className="mt-4 text-gray-300">
              The app shell hit an unexpected problem. We captured the error for
              review.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 w-full rounded-md bg-gray-800 p-3 text-left text-xs text-gray-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Error details (dev only):</span>
                  <button type="button" onClick={handleCopy} className="text-teal-300 hover:underline">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
              </div>
            )}

            <button
              type="button"
              onClick={() => unstable_retry()}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-teal-500 px-6 py-3 font-semibold text-white transition hover:bg-teal-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Reload Page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
