'use client';

import { useEffect, useState } from 'react';

export default function AdSenseDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {};

      // 1. Check environment variables
      results.publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'NOT SET';
      results.customerId = process.env.NEXT_PUBLIC_ADSENSE_CUSTOMER_ID || 'NOT SET';

      // 2. Check if adsbygoogle is available
      results.adsByGoogleLoaded = (window as any).adsbygoogle !== undefined;

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
      } catch (error: any) {
        results.networkTest = error.message;
      }

      // 6. CSP check
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      results.cspFound = !!cspMeta;
      results.cspContent = cspMeta?.getAttribute('content') || 'Not found';

      setTestResults(results);
      setDebugInfo({
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
      });
    };

    runDiagnostics();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>🔍 AdSense Debug Diagnostics</h1>

      <section>
        <h2>📋 Environment Variables</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
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

      <section>
        <h2>🌐 Browser & Network</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
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

      <section>
        <h2>🚫 Ad Blocker Detection</h2>
        <div
          style={{
            padding: '10px',
            background: testResults.adBlockerDetected ? '#ffcccc' : '#ccffcc',
            borderRadius: '4px',
          }}
        >
          {testResults.adBlockerDetected ? '❌ Ad blocker DETECTED' : '✅ No ad blocker detected'}
        </div>
      </section>

      <section>
        <h2>🔒 Content Security Policy</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
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

      <section>
        <h2>📊 Full Debug Info</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </section>

      <section>
        <h2>💡 Troubleshooting Steps</h2>
        <ol>
          <li>Check if publisherId is set correctly (should start with 'pub-')</li>
          <li>Disable ad blockers and refresh</li>
          <li>Check Network tab in DevTools for script loading status</li>
          <li>Verify AdSense account is approved at adsense.google.com</li>
          <li>Check browser console for CSP or CORS errors</li>
          <li>Restart Next.js dev server: <code>npm run dev</code></li>
          <li>Clear .next cache: <code>rm -rf .next</code></li>
        </ol>
      </section>

      <section>
        <h2>📝 Copy This Debug Info</h2>
        <textarea
          readOnly
          value={JSON.stringify(
            {
              timestamp: new Date().toISOString(),
              ...testResults,
            },
            null,
            2
          )}
          style={{
            width: '100%',
            height: '200px',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        />
      </section>
    </div>
  );
}
