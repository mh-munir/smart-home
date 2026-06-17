import { getCurrentAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}