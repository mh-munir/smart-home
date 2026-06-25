/**
 * Reusable URL slug generator.
 *
 * Features:
 *  - lowercase
 *  - trim
 *  - remove special characters (keep alphanumeric, spaces, hyphens)
 *  - replace spaces with hyphens
 *  - prevent duplicate hyphens
 *  - strip leading/trailing hyphens
 *
 * @param {string} text - The input text to slugify.
 * @returns {string} A clean, URL-safe slug.
 */
export function generateSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    // Normalize unicode and strip diacritics (é → e)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Remove anything that isn't alphanumeric, space, or hyphen
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace whitespace sequences with a single hyphen
    .replace(/\s+/g, "-")
    // Collapse consecutive hyphens
    .replace(/-+/g, "-")
    // Strip leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Check slug uniqueness against an array or Mongoose query result.
 *
 * @param {string} slug - The slug to check.
 * @param {string} [currentId] - The _id to exclude (used when editing).
 * @param {Array<{_id: string, slug: string}>} existingSlugs - Existing slug records.
 * @returns {boolean} True if the slug is unique.
 */
export function isSlugUnique(slug, currentId, existingSlugs) {
  return !existingSlugs.some(
    (item) => item.slug === slug && String(item._id) !== String(currentId)
  );
}

/**
 * Make a slug unique by appending a numeric suffix.
 *
 * @param {string} slug - The base slug.
 * @param {Array<{slug: string}>} existingSlugs - Existing slug records.
 * @returns {string} A unique slug (e.g., "my-product-2").
 */
export function ensureUniqueSlug(slug, existingSlugs = []) {
  if (!isSlugUnique(slug, null, existingSlugs)) {
    let counter = 2;
    while (!isSlugUnique(`${slug}-${counter}`, null, existingSlugs)) {
      counter++;
    }
    return `${slug}-${counter}`;
  }
  return slug;
}