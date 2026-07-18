import { redirect } from "next/navigation";

export default function DriverPortalRedirect() {
  redirect("/driver/dashboard");
}
