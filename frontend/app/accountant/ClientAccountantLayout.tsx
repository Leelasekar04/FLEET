"use client";

import AccountantSidebar from "@/components/layout/AccountantSidebar";
import AccountantTopBar from "@/components/layout/AccountantTopBar";
import { usePathname } from "next/navigation";

export default function ClientAccountantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/accountant/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <AccountantSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300">
        <AccountantTopBar />
        <div className="flex-1 overflow-auto bg-[#f8fafc] p-6 sm:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
