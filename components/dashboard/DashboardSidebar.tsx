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
import Image from "next/image";
// Adjust path to action file

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

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
        console.log("User from token:", user);
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

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            width={50}
            height={50}
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
