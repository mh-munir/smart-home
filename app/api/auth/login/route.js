import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { verifyPassword } from "@/lib/password-utils";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAllowedAdminEmails,
  verifyAdminCredentials,
} from "@/lib/admin-session";

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const nextPath = sanitizeNextPath(String(formData.get("next") || "/admin"));

  console.log("[LOGIN] Form received - email:", email, "password length:", password.length);

  try {
    // Try MongoDB-based authentication first
    console.log("[LOGIN] Attempting authentication for:", email);
    await connectDB();
    const adminUser = await AdminUser.findOne({ email });
    console.log("[LOGIN] Admin user found:", !!adminUser);

    if (adminUser) {
      // Check if account is active
      if (!adminUser.isActive) {
        console.log("[LOGIN] Account is not active");
        return redirectToLogin(request.url, "account_deactivated", nextPath);
      }

      // Check if account is locked
      if (adminUser.isLocked()) {
        console.log("[LOGIN] Account is locked");
        return redirectToLogin(request.url, "account_locked", nextPath);
      }

      // Verify password
      console.log("[LOGIN] Verifying password...");
      let isPasswordValid = false;
      try {
        isPasswordValid = await verifyPassword(password, adminUser.password);
        console.log("[LOGIN] Password valid:", isPasswordValid);
      } catch (pwError) {
        console.error("[LOGIN] Password verification error:", pwError);
        isPasswordValid = false;
      }

      if (!isPasswordValid) {
        console.log("[LOGIN] Invalid credentials for:", email);
        await adminUser.incrementLoginAttempts();
        return redirectToLogin(request.url, "invalid_credentials", nextPath);
      }

      // Reset login attempts
      await adminUser.resetLoginAttempts();
      console.log("[LOGIN] Login attempts reset");

      // Create session token
      const sessionToken = createSessionToken({
        email: adminUser.email,
        name: adminUser.fullName,
      });
      console.log("[LOGIN] Session token created");

      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      console.log("[LOGIN] Cookie set, redirecting to:", nextPath);

      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    // Admin not found in database, try fallback auth
    console.log("[LOGIN] Admin user not found in database for email:", email);
    console.log("[LOGIN] Database auth failed, trying env var fallback");
    console.log("[LOGIN] ADMIN_PASSWORD set:", !!process.env.ADMIN_PASSWORD);
    const envAuthValid = process.env.ADMIN_PASSWORD && verifyAdminCredentials(email, password);
    console.log("[LOGIN] Env var auth valid:", envAuthValid);
    
    if (envAuthValid) {
      const sessionToken = createSessionToken({
        email,
        name: email,
      });

      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    // No valid authentication method worked
    return redirectToLogin(request.url, "invalid_credentials", nextPath);
  } catch (error) {
    console.error("Login error:", error);
    // Fall back to environment variable authentication on error
    if (verifyAdminCredentials(email, password)) {
      const sessionToken = createSessionToken({
        email,
        name: email,
      });

      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    return redirectToLogin(request.url, "invalid_credentials", nextPath);
  }
}

function sanitizeNextPath(nextPath) {
  if (typeof nextPath !== "string") return "/admin";
  if (!nextPath.startsWith("/")) return "/admin";
  if (nextPath.startsWith("//")) return "/admin";
  return nextPath;
}

function redirectToLogin(baseUrl, error, nextPath) {
  const loginUrl = new URL("/admin/login", baseUrl);
  loginUrl.searchParams.set("error", error);
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}
