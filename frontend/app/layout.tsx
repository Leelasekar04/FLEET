import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FleetManager Pro — Enterprise Fleet & Batta Management",
  description: "WhatsApp-first fleet expense tracking SaaS for enterprise truck fleets. Real-time batta management, AI receipt OCR, GPS tracking, and full accounting.",
  keywords: ["fleet management", "batta", "truck expenses", "driver tracking", "WhatsApp", "SaaS"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
