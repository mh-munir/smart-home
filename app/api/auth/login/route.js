import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

  if (getAllowedAdminEmails().length === 0) {
    return redirectToLogin(request.url, "missing_admin_emails", nextPath);
  }

  if (!process.env.ADMIN_PASSWORD) {
    return redirectToLogin(request.url, "missing_password_config", nextPath);
  }

  if (!verifyAdminCredentials(email, password)) {
    return redirectToLogin(request.url, "invalid_credentials", nextPath);
  }

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

function redirectToLogin(baseUrl, error, nextPath) {
  const loginUrl = new URL("/admin/login", baseUrl);
  loginUrl.searchParams.set("error", error);
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

function sanitizeNextPath(path) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/admin";
  }

  return path;
}
