import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  createOAuthState,
} from "@/lib/admin-session";

export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/admin/login?error=missing_google_config", request.url)
    );
  }

  const state = createOAuthState();
  const redirectUri = getGoogleRedirectUri(request.url);
  const authorizationUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth"
  );

  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri.toString());
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("access_type", "online");
  authorizationUrl.searchParams.set("prompt", "select_account");

  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect(authorizationUrl);
}

function getGoogleRedirectUri(requestUrl) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  const baseUrl =
    process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || requestUrl;

  return new URL("/api/auth/google/callback", baseUrl).toString();
}
