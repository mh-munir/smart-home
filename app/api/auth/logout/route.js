import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", { maxAge: 0, path: "/" });

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
