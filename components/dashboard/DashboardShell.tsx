"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { CURRENT_USER, CURRENT_TECHNICIAN, MOCK_USERS } from "@/lib/mock-data";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  defaultRole?: Role;
}

export function DashboardShell({ children, defaultRole = "CUSTOMER" }: DashboardShellProps) {
  const router = useRouter();
  const [role, setRole] = React.useState<Role>(defaultRole);

  const adminUser = MOCK_USERS.find((u) => u.role === "ADMIN");

  const activeUser =
    role === "ADMIN"
      ? { name: adminUser?.name ?? "Admin User", email: adminUser?.email ?? "admin@fixitnow.com", photoUrl: adminUser?.photoUrl }
      : role === "TECHNICIAN"
      ? { name: CURRENT_TECHNICIAN.user?.name ?? "Tanvir Ahmed", email: CURRENT_TECHNICIAN.user?.email ?? "tanvir@example.com", photoUrl: CURRENT_TECHNICIAN.user?.photoUrl }
      : { name: CURRENT_USER.name, email: CURRENT_USER.email, photoUrl: CURRENT_USER.photoUrl };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === "ADMIN") router.push("/dashboard/admin");
    else if (newRole === "TECHNICIAN") router.push("/dashboard/technician");
    else router.push("/dashboard/customer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background lg:flex-row">
      <DashboardSidebar
        role={role}
        userName={activeUser.name}
        userEmail={activeUser.email}
        userPhotoUrl={activeUser.photoUrl}
        onRoleChange={handleRoleChange}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
