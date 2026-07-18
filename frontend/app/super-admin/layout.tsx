import type { Metadata } from "next";
import ClientSuperAdminLayout from "./ClientSuperAdminLayout";

export const metadata: Metadata = {
  title: "Super Admin Command Center | Fleet SaaS",
  description: "Manage companies, subscriptions, and platform settings.",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSuperAdminLayout>{children}</ClientSuperAdminLayout>;
}
