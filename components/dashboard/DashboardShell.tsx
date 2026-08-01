"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { CURRENT_USER } from "@/lib/mock-data";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  defaultRole?: Role;
}

export function DashboardShell({ children, defaultRole = "CUSTOMER" }: DashboardShellProps) {
  const router = useRouter();
  const [role, setRole] = React.useState<Role>(defaultRole);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === "ADMIN") router.push("/dashboard/admin");
    else if (newRole === "TECHNICIAN") router.push("/dashboard/technician");
    else router.push("/dashboard/customer");
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-background">
      <DashboardSidebar
        role={role}
        userName={CURRENT_USER.name}
        userEmail={CURRENT_USER.email}
        onRoleChange={handleRoleChange}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
