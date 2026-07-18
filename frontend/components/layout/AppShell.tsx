"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DriverSidebar from "./DriverSidebar";
import DriverTopBar from "./DriverTopBar";
import ClientOnly from "@/components/ClientOnly";

const AUTH_PATHS = ["/login", "/forgot-password", "/reset-password", "/driver/login", "/accountant/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isAuth = pathname === "/" || AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isDriverRoute = (pathname.startsWith("/driver/") || pathname === "/driver") && pathname !== "/driver/login";
  const isAccountantRoute = (pathname.startsWith("/accountant/") || pathname === "/accountant") && pathname !== "/accountant/login";
  const isSuperAdminRoute = pathname.startsWith("/super-admin/") || pathname === "/super-admin";

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const driverToken = localStorage.getItem("driver_token");
    const accountantToken = localStorage.getItem("accountant_token");
    const superAdminToken = localStorage.getItem("super_admin_token");

    // Route Protection Logic
    if (isAuth) return; // Allow access to login pages and selector

    if (isSuperAdminRoute) {
      if (!superAdminToken && pathname !== "/super-admin/login") {
        window.location.href = "/super-admin/login";
      }
    } else if (isDriverRoute) {
      if (!driverToken) {
        window.location.href = "/driver/login";
      }
    } else if (isAccountantRoute) {
      if (!accountantToken) {
        window.location.href = "/accountant/login";
      }
    } else {
      // Fleet Admin routes
      if (!token) {
        window.location.href = "/login";
      }
    }
  }, [pathname, isAuth, isDriverRoute, isAccountantRoute, isSuperAdminRoute]);

  // To prevent flash of incorrect layout before auth check
  if (!mounted) {
    return <div style={{ width: "100vw", height: "100vh", background: "#f1f5f9" }} />;
  }

  if (isAuth) {
    return <>{children}</>;
  }

  if (isAccountantRoute || isSuperAdminRoute) {
    return <div className="min-h-screen bg-[#f8fafc]"><ClientOnly>{children}</ClientOnly></div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {isDriverRoute ? <DriverSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {isDriverRoute ? <DriverTopBar /> : <TopBar />}
        <main className="flex-1 overflow-y-auto bg-[#f1f5f9]">
          <div className="p-6 max-w-[1600px] mx-auto">
            <ClientOnly>{children}</ClientOnly>
          </div>
        </main>
      </div>
    </div>
  );
}
