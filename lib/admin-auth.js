import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/admin-session";

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const admin = await getCurrentAdmin();

  if (admin) {
    return null;
  }

  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
