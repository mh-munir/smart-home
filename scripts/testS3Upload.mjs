import 'dotenv/config';
import { saveBufferToStorage } from '../lib/storage.js';

(async () => {
  try {
    const key = `test/s3-check-${Date.now()}.txt`;
    const buf = Buffer.from(`s3 connectivity test ${new Date().toISOString()}`);
    console.log('Running S3 upload test. S3_BUCKET present?', !!process.env.S3_BUCKET);
    const res = await saveBufferToStorage(buf, key, 'text/plain');
    console.log('S3 test result:', res);
    process.exit(0);
  } catch (err) {
    console.error('S3 test failed:', err?.message || err);
    process.exit(1);
  }
})();
