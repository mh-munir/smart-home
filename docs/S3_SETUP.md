S3 Setup

This project supports uploading images to S3-compatible storage (AWS S3, DigitalOcean Spaces, MinIO).

Required environment variables (set in `.env.local` or platform settings):

- `S3_BUCKET` - bucket name
- `S3_REGION` - AWS region (e.g. `us-east-1`) or provider region
- `AWS_ACCESS_KEY_ID` - access key (optional if using instance role)
- `AWS_SECRET_ACCESS_KEY` - secret key
- `S3_ENDPOINT` - (optional) custom endpoint for non-AWS providers (e.g. DigitalOcean)

Notes:
- In production `NODE_ENV=production`, the app requires S3 to be configured; it will NOT fall back to writing files into `public/` to avoid ephemeral storage issues.
- Ensure the bucket allows public reads for uploaded objects, or configure a CDN in front.

Optional flag:
- `S3_FORCE_UPLOAD=true` — when set in your local `.env.local`, the app will require S3 uploads even during development. Useful to validate S3 behavior before deploying. If S3 upload fails while this is set, uploads will error instead of falling back to local `public/` storage.

Quick test (run locally):

```bash
# install deps if needed
npm install
# run the helper test (will fallback to local public if S3 not configured)
node scripts/testS3Upload.mjs
```

Migration from local `public/uploads` to S3:

```bash
# Ensure S3 env vars are set (S3_BUCKET, S3_REGION, credentials)
node scripts/migrateUploadsToS3.mjs
```

The script uploads files under `public/uploads` to S3 and writes `data/uploads-to-s3-map.json` with a mapping from local paths (e.g. `/uploads/blogs/foo.png`) to S3 URLs. It does not modify DB entries — use the mapping to update blog records and settings.

If `S3_BUCKET` is set and credentials are valid, the script will print the S3 URL.

Security:
- Store credentials securely in your host's secret manager (Vercel, Netlify, etc.), do not commit them to source control.
- For AWS, you can use IAM roles instead of long-lived keys for improved security.
