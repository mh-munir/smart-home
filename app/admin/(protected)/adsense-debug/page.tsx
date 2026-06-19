"use client";

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown;
  }
}

export default function AdSenseDebugPage() {
  const [testResults, setTestResults] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: Record<string, unknown> = {};

      // 1. Check environment variables
      results.publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'NOT SET';
      results.customerId = process.env.NEXT_PUBLIC_ADSENSE_CUSTOMER_ID || 'NOT SET';

      // 2. Check if adsbygoogle is available
      results.adsByGoogleLoaded = typeof window !== 'undefined' && typeof window.adsbygoogle !== 'undefined';

      // 3. Check browser info
      results.userAgent = navigator.userAgent;
      results.hostname = window.location.hostname;
      results.protocol = window.location.protocol;

      // 4. Check for ad blockers
      const testAdScript = document.createElement('script');
      testAdScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      testAdScript.async = true;
      
      let adBlockerDetected = false;
      testAdScript.onerror = () => {
        adBlockerDetected = true;
      };
      
      // Don't actually add it, just test
      results.adBlockerDetected = adBlockerDetected;

      // 5. Network test
      try {
        const response = await fetch(
          'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          { method: 'HEAD', mode: 'no-cors' }
        );
        results.networkTest = 'Script is reachable';
        results.networkStatus = response.status;
      } catch (error) {
        results.networkTest = error instanceof Error ? error.message : String(error);
      }

      // 6. CSP check
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      results.cspFound = !!cspMeta;
      results.cspContent = cspMeta?.getAttribute('content') || 'Not found';

      setTestResults(results);
    };

    runDiagnostics();
  }, []);

  return (
    <div className="p-5 font-mono text-sm">
      <h1 className="text-xl font-semibold mb-4">🔍 AdSense Debug Diagnostics</h1>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-2">📋 Environment Variables</h2>
        <pre className="bg-gray-100 p-2.5 rounded">
          {JSON.stringify(
            {
              publisherId: testResults.publisherId,
              customerId: testResults.customerId,
            },
            null,
            2
          )}
        </pre>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-2">🌐 Browser & Network</h2>
        <pre className="bg-gray-100 p-2.5 rounded">
          {JSON.stringify(
            {
              hostname: testResults.hostname,
              protocol: testResults.protocol,
              adsByGoogleLoaded: testResults.adsByGoogleLoaded,
              networkTest: testResults.networkTest,
              networkStatus: testResults.networkStatus,
            },
            null,
            2
          )}
        </pre>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-2">🚫 Ad Blocker Detection</h2>
        <div
          className={`p-2.5 rounded ${testResults.adBlockerDetected ? 'bg-red-100' : 'bg-green-100'}`}
        >
          {testResults.adBlockerDetected ? '❌ Ad blocker DETECTED' : '✅ No ad blocker detected'}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-2">🔒 Content Security Policy</h2>
        <pre className="bg-gray-100 p-2.5 rounded">
          {JSON.stringify(
            {
              cspFound: testResults.cspFound,
              cspContent: testResults.cspContent,
            },
            null,
            2
          )}
        </pre>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-2">📊 Full Debug Info</h2>
        <pre className="bg-gray-100 p-2.5 rounded">
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-2">💡 Troubleshooting Steps</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Check if publisherId is set correctly (should start with &apos;pub-&apos;)</li>
          <li>Disable ad blockers and refresh</li>
          <li>Check Network tab in DevTools for script loading status</li>
          <li>Verify AdSense account is approved at adsense.google.com</li>
          <li>Check browser console for CSP or CORS errors</li>
          <li>Restart Next.js dev server: <code>npm run dev</code></li>
          <li>Clear .next cache: <code>rm -rf .next</code></li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">📝 Copy This Debug Info</h2>
        <label htmlFor="debugCopy" className="sr-only">Debug Info</label>
        <textarea
          id="debugCopy"
          readOnly
          value={JSON.stringify(
            {
              timestamp: new Date().toISOString(),
              ...testResults,
            },
            null,
            2
          )}
          className="w-full h-48 p-2.5 font-mono text-sm"
        />
      </section>
    </div>
  );
}
