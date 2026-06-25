import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer - The image buffer to upload
 * @param {string} folder - Cloudinary folder (e.g., "smart-home/products")
 * @param {string} filename - Desired filename (without extension)
 * @param {string} contentType - MIME type (e.g., "image/png")
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(buffer, folder, filename, contentType) {
  return new Promise((resolve, reject) => {
    const ext = contentType?.split("/")[1]?.split("+")[0] || "jpg";
    const publicId = `${filename}.${ext}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        format: ext,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by URL or public ID
 * @param {string} imageUrlOrPublicId - Cloudinary URL or public ID
 * @returns {Promise<void>}
 */
export async function deleteFromCloudinary(imageUrlOrPublicId) {
  if (!imageUrlOrPublicId) return;

  let publicId = imageUrlOrPublicId;

  // If it's a Cloudinary URL, extract the public ID
  if (imageUrlOrPublicId.startsWith("http")) {
    try {
      const url = new URL(imageUrlOrPublicId);
      const parts = url.pathname.split("/");
      // Remove /v1234567890/ prefix and file extension
      const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p));
      const startIdx = versionIndex >= 0 ? versionIndex + 1 : 2; // skip empty and folder
      const idParts = parts.slice(startIdx).join("/");
      // Remove file extension
      publicId = idParts.replace(/\.[^.]+$/, "");
    } catch {
      // If URL parsing fails, try to use the raw value
      publicId = imageUrlOrPublicId;
    }
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch {
    // Silently fail - image may not exist or already deleted
  }
}

/**
 * Check if a URL is a Cloudinary URL
 * @param {string} url
 * @returns {boolean}
 */
export function isCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.includes("cloudinary.com") || url.includes("res.cloudinary.com");
}

export default cloudinary;