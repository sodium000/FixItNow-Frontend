"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";

interface DashboardShellProps {
  children: React.ReactNode;
  defaultRole?: Role;
}

export function DashboardShell({ children, defaultRole = "CUSTOMER" }: DashboardShellProps) {
  const router = useRouter();
  const [role, setRole] = React.useState<Role>(defaultRole);

  const activeUser = {
    name: role === "ADMIN" ? "Administrator" : role === "TECHNICIAN" ? "Technician" : "Customer",
    email: "",
    photoUrl: undefined,
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === "ADMIN") router.push("/dashboard/admin");
    else if (newRole === "TECHNICIAN") router.push("/dashboard/technician");
    else router.push("/dashboard/customer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background lg:flex-row">
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        userName={activeUser.name}
        userEmail={activeUser.email}
        userPhotoUrl={activeUser.photoUrl}
        onRoleChange={handleRoleChange}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Dashboard Navbar with profile dropdown */}
        <DashboardNavbar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
