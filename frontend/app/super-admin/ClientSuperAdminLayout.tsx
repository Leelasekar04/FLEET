"use client";

import SuperAdminSidebar from "@/components/layout/SuperAdminSidebar";
import SuperAdminTopBar from "@/components/layout/SuperAdminTopBar";
import SuperAdminPermissionGuard from "@/components/auth/SuperAdminPermissionGuard";
import { usePathname } from "next/navigation";

export default function ClientSuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/super-admin/login";

  if (isLoginPage) {
    return (
      <SuperAdminPermissionGuard>
        {children}
      </SuperAdminPermissionGuard>
    );
  }

  return (
    <SuperAdminPermissionGuard>
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
        <SuperAdminSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300">
          <SuperAdminTopBar />
          <div className="flex-1 overflow-auto bg-[#f8fafc] p-6 sm:p-8 custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </SuperAdminPermissionGuard>
  );
}
