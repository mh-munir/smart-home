import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { verifyPassword } from "@/lib/password-utils";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin-session";

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const nextPath = sanitizeNextPath(String(formData.get("next") || "/admin"));

  // Avoid logging sensitive information such as passwords or secret presence

  try {
    // Try MongoDB-based authentication first
    await connectDB();
    const adminUser = await AdminUser.findOne({ email });
    // adminUser presence checked

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
      let isPasswordValid = false;
      try {
        isPasswordValid = await verifyPassword(password, adminUser.password);
      } catch (pwError) {
        console.error("[LOGIN] Password verification error:", pwError);
        isPasswordValid = false;
      }

      if (!isPasswordValid) {
        console.warn("[LOGIN] Invalid credentials");
        await adminUser.incrementLoginAttempts();
        return redirectToLogin(request.url, "invalid_credentials", nextPath);
      }

      // Reset login attempts
      await adminUser.resetLoginAttempts();

      // Create session token
      const sessionToken = createSessionToken({
        email: adminUser.email,
        name: adminUser.fullName,
      });

      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      // Cookie set; redirecting

      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    // Admin not found in database, try fallback auth via environment variable
    const envAuthValid = process.env.ADMIN_PASSWORD && verifyAdminCredentials(email, password);
    
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
        sameSite: "strict",
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
        sameSite: "strict",
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
