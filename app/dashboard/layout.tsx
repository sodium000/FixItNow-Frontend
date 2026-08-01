import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | FixItNow",
  description: "Manage your bookings, profile, and services",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
