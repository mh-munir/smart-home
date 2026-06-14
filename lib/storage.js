import path from "path";

async function tryS3Upload(buffer, key, contentType) {
  if (!process.env.S3_BUCKET || !process.env.S3_REGION) return null;

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
      region: process.env.S3_REGION,
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
    });

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
      ACL: "public-read",
    });

    await client.send(cmd);

    // Construct public S3 URL
    const bucket = process.env.S3_BUCKET;
    const region = process.env.S3_REGION;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return { url, key };
  } catch (err) {
    console.error("S3 upload failed:", err);
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
  const fullPath = path.join(publicPath, key);
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return { url: `/${key}`, key };
}

export default { saveBufferToStorage };
