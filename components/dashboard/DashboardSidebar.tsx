"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Wrench,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { getCurrentUser } from "./getUser";
// Adjust path to action file

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV_LINKS: NavLink[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["CUSTOMER", "TECHNICIAN", "ADMIN"],
  },
  {
    label: "My Profile",
    href: "/dashboard/customer",
    icon: User,
    roles: ["CUSTOMER"],
  },
  {
    label: "Technician Panel",
    href: "/dashboard/technician",
    icon: Wrench,
    roles: ["TECHNICIAN"],
  },
  {
    label: "Admin Panel",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ["ADMIN"],
  },
];

interface DashboardSidebarProps {
  role?: Role;
  userName?: string;
  userEmail?: string;
  userPhotoUrl?: string;
  onRoleChange?: (role: Role) => void;
}

export function DashboardSidebar({
  role: initialRole = "CUSTOMER",
  userName: initialName = "User",
  userEmail: initialEmail = "",
  userPhotoUrl: initialPhotoUrl,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const [userInfo, setUserInfo] = useState({
    name: initialName,
    email: initialEmail,
    role: initialRole,
    photoUrl: initialPhotoUrl,
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserInfo({
            name: user.name,
            email: user.email,
            role: user.role as Role,
            photoUrl: user.photoUrl,
          });
        }
      } catch (error) {
        console.error("Failed to load user from token:", error);
      }
    }

    fetchUserData();
  }, []);

  const activeRole = userInfo.role;
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(activeRole),
  );

  return (
    <aside className="flex mt-20 min-h-auto w-full max-w-full shrink-0 flex-col border-b border-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:max-w-[18rem] lg:border-b-0 lg:border-r lg:overflow-y-auto">
      <div className="border-b border-border p-5 lg:border-b lg:border-r-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">
              FixItNow
            </p>
            <p className="text-[10px] text-muted-foreground">Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        {visibleLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              pathname.startsWith(link.href.split("#")[0]));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{link.label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              userInfo.photoUrl ||
              "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80"
            }
            alt={userInfo.name}
            className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {userInfo.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userInfo.email}
            </p>
            <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              {activeRole}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            const toastId = toast.loading("Signing out...");
            try {
              const { logoutUser } =
                await import("@/app/(auth)/login/loginfuntion");
              await logoutUser();
              toast.success("Signed out successfully!", { id: toastId });
              window.location.href = "/login";
            } catch {
              toast.error("Failed to sign out. Please try again.", {
                id: toastId,
              });
            }
          }}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out / Logout
        </button>
      </div>
    </aside>
  );
}
