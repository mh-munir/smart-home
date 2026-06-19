#!/usr/bin/env node

(async () => {
  const url = 'http://localhost:3000/api/guides';
  const maxAttempts = 20;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url);
      console.log('HTTP', res.status);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          console.log('Received', json.length, 'guides. Sample:');
          console.log(JSON.stringify(json.slice(0, 3), null, 2));
        } else {
          console.log('Response not an array:', typeof json);
          console.log(JSON.stringify(json, null, 2));
        }
      } catch (err) {
        console.log('Non-JSON response:', text.slice(0, 1000));
      }
      process.exit(0);
    } catch (err) {
      console.error('Attempt', attempt, 'failed:', err?.message || err);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  console.error('Failed to reach', url);
  process.exit(2);
})();
