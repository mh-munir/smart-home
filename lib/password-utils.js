/**
 * Password hashing and validation utilities
 */

import bcrypt from "bcryptjs";

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Failed to hash password");
  }
};

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
export const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Failed to verify password");
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  const warnings = [];

  // Minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Maximum length (for security and practical reasons)
  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    warnings.push("Password should contain at least one uppercase letter");
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    warnings.push("Password should contain at least one lowercase letter");
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    warnings.push("Password should contain at least one number");
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    warnings.push("Password should contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    strength: calculatePasswordStrength(password),
  };
};

/**
 * Calculate password strength (0-5)
 * @param {string} password - Password to evaluate
 * @returns {number} - Strength score 0-5
 */
export const calculatePasswordStrength = (password) => {
  let strength = 0;

  // Length score
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (hasUppercase && hasLowercase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecial) strength++;

  return Math.min(strength, 5);
};

/**
 * Generate a random secure password
 * @param {number} length - Password length (default: 16)
 * @returns {string} - Generated password
 */
export const generateSecurePassword = (length = 16) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?";

  const allChars = uppercase + lowercase + numbers + special;
  let password = "";

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export default {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  calculatePasswordStrength,
  generateSecurePassword,
};
