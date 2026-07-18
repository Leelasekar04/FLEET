"use client";
import { useEffect, useState } from "react";

/**
 * ClientOnly — Prevents hydration mismatches by rendering children
 * only after the component has mounted on the client.
 *
 * Wrap any page or component that causes hydration errors:
 *   <ClientOnly><YourComponent /></ClientOnly>
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
