"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/add");
  }, [router]);

  return (
    <div className="p-8 min-h-screen">
      <p className="text-gray-600">Redirecting to Add Content…</p>
    </div>
  );
}
