import AdminShell from "@/components/AdminShell";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
