/**
 * Input validation and sanitization utilities for API routes.
 */

/**
 * Sanitize a string to prevent XSS attacks.
 * Removes HTML tags and trims whitespace.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeString(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .trim();
}

/**
 * Validate and sanitize a URL.
 * Only allows http/https protocols.
 * @param {string} url
 * @returns {{ valid: boolean, url: string, error?: string }}
 */
export function validateUrl(url) {
  if (!url || typeof url !== "string") {
    return { valid: false, url: "", error: "URL is required" };
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, url: "", error: "Only HTTP/HTTPS URLs are allowed" };
    }
    return { valid: true, url: parsed.href };
  } catch {
    return { valid: false, url: "", error: "Invalid URL format" };
  }
}

/**
 * Validate an email address.
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  if (email.length > 254) {
    return { valid: false, error: "Email is too long" };
  }
  return { valid: true };
}

/**
 * Validate a slug string.
 * Only allows lowercase alphanumeric, hyphens, and underscores.
 * @param {string} slug
 * @param {number} maxLength
 * @returns {{ valid: boolean, slug: string, error?: string }}
 */
export function validateSlug(slug, maxLength = 200) {
  if (!slug || typeof slug !== "string") {
    return { valid: false, slug: "", error: "Slug is required" };
  }
  const sanitized = slug.toLowerCase().trim();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(sanitized)) {
    return { valid: false, slug: "", error: "Invalid slug format" };
  }
  if (sanitized.length > maxLength) {
    return { valid: false, slug: "", error: "Slug exceeds " + maxLength + " characters" };
  }
  return { valid: true, slug: sanitized };
}

/**
 * Validate required fields in a request body.
 * @param {object} body - Request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequired(body, requiredFields) {
  if (!body || typeof body !== "object") {
    return { valid: false, missing: requiredFields };
  }
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );
  return { valid: missing.length === 0, missing };
}

/**
 * Sanitize an object by trimming all string values.
 * @param {object} obj
 * @returns {object}
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = value.trim();
    } else if (typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((v) =>
        typeof v === "string" ? v.trim() : v
      );
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Limit string length.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 5000) {
  if (typeof str !== "string") return "";
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}