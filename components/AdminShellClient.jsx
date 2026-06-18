"use client";

import dynamic from "next/dynamic";

// Import AdminShell only on the client to avoid server-side rendering
// of client-only hooks which can cause hydration mismatches.
const AdminShell = dynamic(() => import("@/components/AdminShell"), { ssr: false });

export default function AdminShellClient({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
