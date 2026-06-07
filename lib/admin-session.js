import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "smart_home_admin_session";
export const GOOGLE_STATE_COOKIE = "smart_home_google_state";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function createOAuthState() {
  return randomBytes(32).toString("base64url");
}

export function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
}

export function getAllowedAdminEmails() {
  const raw =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    process.env.GOOGLE_ADMIN_EMAIL ||
    "";

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email) {
  if (!email) return false;

  const allowedEmails = getAllowedAdminEmails();
  return allowedEmails.includes(email.toLowerCase());
}

export function verifyAdminCredentials(email, password) {
  const configuredPassword = process.env.ADMIN_PASSWORD || "";

  if (!configuredPassword || !isAllowedAdminEmail(email) || !password) {
    return false;
  }

  return safeEqual(password, configuredPassword);
}

export function createSessionToken(admin) {
  const secret = getAuthSecret();

  if (!secret) {
    throw new Error("Missing AUTH_SECRET or NEXTAUTH_SECRET");
  }

  const payload = {
    email: admin.email,
    name: admin.name || "",
    picture: admin.picture || "",
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
  const secret = getAuthSecret();

  if (!secret || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload, secret);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    if (!payload?.email || !payload?.exp) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (!isAllowedAdminEmail(payload.email)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function signValue(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(value, expected) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}
