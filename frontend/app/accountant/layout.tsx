import type { Metadata } from "next";
import ClientAccountantLayout from "./ClientAccountantLayout";

export const metadata: Metadata = {
  title: "Accountant Portal | Fleet SaaS",
  description: "Manage expenses and financial reports.",
};

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAccountantLayout>{children}</ClientAccountantLayout>;
}
