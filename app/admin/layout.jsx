import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
