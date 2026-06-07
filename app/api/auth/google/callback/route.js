import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  GOOGLE_STATE_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAllowedAdminEmails,
  isAllowedAdminEmail,
} from "@/lib/admin-session";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GOOGLE_STATE_COOKIE)?.value;

  cookieStore.set(GOOGLE_STATE_COOKIE, "", { maxAge: 0, path: "/" });

  if (error) {
    return redirectToLogin(request.url, "google_denied");
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToLogin(request.url, "invalid_state");
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return redirectToLogin(request.url, "missing_google_config");
  }

  if (getAllowedAdminEmails().length === 0) {
    return redirectToLogin(request.url, "missing_admin_emails");
  }

  const redirectUri = getGoogleRedirectUri(request.url);
  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri.toString(),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return redirectToLogin(request.url, "token_exchange_failed");
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    return redirectToLogin(request.url, "token_exchange_failed");
  }

  const userResponse = await fetch(USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!userResponse.ok) {
    return redirectToLogin(request.url, "profile_fetch_failed");
  }

  const user = await userResponse.json();
  if (!user.email_verified || !isAllowedAdminEmail(user.email)) {
    return redirectToLogin(request.url, "unauthorized_email");
  }

  const sessionToken = createSessionToken({
    email: user.email,
    name: user.name,
    picture: user.picture,
  });

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect(new URL("/admin", request.url));
}

function redirectToLogin(baseUrl, error) {
  const loginUrl = new URL("/admin/login", baseUrl);
  loginUrl.searchParams.set("error", error);

  return NextResponse.redirect(loginUrl);
}

function getGoogleRedirectUri(requestUrl) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  const baseUrl =
    process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || requestUrl;

  return new URL("/api/auth/google/callback", baseUrl).toString();
}
