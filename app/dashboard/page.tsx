import { redirect } from "next/navigation";
import { getMyProfileAction } from "@/lib/profileAction";

export default async function DashboardPage() {
  const result = await getMyProfileAction();

  if (!result.success || !result.data) {
    // Not logged in → go to login
    redirect("/login?redirect=/dashboard");
  }

  const role = result.data.role;

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "TECHNICIAN") {
    redirect("/dashboard/technician");
  } else {
    redirect("/dashboard/customer");
  }
}
