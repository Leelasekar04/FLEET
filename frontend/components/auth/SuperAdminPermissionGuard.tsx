"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SuperAdminPermissionGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We allow the login page to bypass the guard
    if (pathname === "/super-admin/login") {
      setAuthorized(true);
      return;
    }

    const token = localStorage.getItem("super_admin_token");
    const userStr = localStorage.getItem("super_admin_user");
    
    if (!token || !userStr) {
      router.replace("/super-admin/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role === "SUPER_ADMIN" || user.role === "super_admin") {
        setAuthorized(true);
      } else {
        router.replace("/super-admin/login");
      }
    } catch {
      router.replace("/super-admin/login");
    }
  }, [router, pathname]);

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
