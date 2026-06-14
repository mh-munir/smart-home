import path from "path";

function sanitizeKey(k) {
  let out = String(k || "");
  if (out.startsWith("/")) out = out.slice(1);
  return encodeURI(out);
}

async function tryS3Upload(buffer, key, contentType) {
  if (!process.env.S3_BUCKET || !process.env.S3_REGION) return null;

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const s3Config = {
      region: process.env.S3_REGION,
    };

    if (process.env.S3_ENDPOINT) {
      s3Config.endpoint = process.env.S3_ENDPOINT;
      s3Config.forcePathStyle = true;
    }

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      s3Config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    const client = new S3Client(s3Config);

    const cleanKey = sanitizeKey(key);

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
      ACL: "public-read",
    });

    await client.send(cmd);

    // Construct public S3 URL. Support custom endpoint and regional host.
    let url;
    if (process.env.S3_ENDPOINT) {
      // Custom endpoint provided (e.g., DigitalOcean, MinIO)
      url = `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${cleanKey}`;
    } else {
      const bucket = process.env.S3_BUCKET;
      const region = process.env.S3_REGION;
      if (region === "us-east-1") {
        url = `https://${bucket}.s3.amazonaws.com/${cleanKey}`;
      } else {
        url = `https://${bucket}.s3.${region}.amazonaws.com/${cleanKey}`;
      }
    }

    return { url, key: cleanKey };
  } catch (err) {
    console.error("S3 upload failed:", err?.message || err);
    return null;
  }
}

export async function saveBufferToStorage(buffer, key, contentType) {
  // Try S3 first (if configured)
  const s3Result = await tryS3Upload(buffer, key, contentType);
  if (s3Result) return s3Result;

  // Fallback: write to local public directory
  const fs = await import("fs/promises");
  const publicPath = path.join(process.cwd(), "public");
  const cleanKey = sanitizeKey(key);
  const fullPath = path.join(publicPath, cleanKey);
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return { url: `/${cleanKey}`, key: cleanKey };
}

export default { saveBufferToStorage };
