"use client";

import { useState } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [copied, setCopied] = useState(false);

  // Log error in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("[ErrorBoundary]", error);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(error.message + (error.digest ? `\nDigest: ${error.digest}` : ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-red-500">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          We could not load this page.
        </h1>
        <p className="mt-4 text-gray-600">
          The issue has been logged. Try again, or head back to the product
          catalog.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-gray-100 p-3 text-left text-xs text-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Error details (dev only):</span>
              <button type="button" onClick={handleCopy} className="text-teal-600 hover:underline">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
            {error.digest && <p className="mt-1 text-gray-500">Digest: {error.digest}</p>}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Try Again
          </button>
          <Link
            href="/products"
            className="rounded-md border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}
