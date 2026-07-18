import { redirect } from "next/navigation";

export default function SuperAdminIndex() {
  // Automatically redirect /super-admin to the dashboard
  redirect("/super-admin/dashboard");
}
