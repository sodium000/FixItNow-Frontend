"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Wrench,
  CalendarCheck2,
  HelpCircle,
  BarChart3,
  Users,
  Briefcase,
  ListChecks,
  LogOut,
  ChevronRight,
  Star,
  DollarSign,
  Bell,
  Bookmark,
  Settings,
  FileText,
  BookOpen,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { getMyProfileAction } from "@/lib/profileAction";
import Image from "next/image";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminTab?: string;
  badge?: string;
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
  const [activeAdminTab, setActiveAdminTab] = useState("overview");
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const result = await getMyProfileAction();
        if (result.success && result.data) {
          const user = result.data;
          setUserInfo({
            name: user.name,
            email: user.email,
            role: user.role as Role,
            photoUrl: user.photoUrl ?? undefined,
          });
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    const syncAdminTab = () => {
      setActiveHash(window.location.hash);
      const tab = window.location.hash.replace("#admin-", "");
      if (["overview", "analytics", "users", "technicians", "services", "bookings"].includes(tab)) {
        setActiveAdminTab(tab);
      }
    };
    syncAdminTab();
    window.addEventListener("hashchange", syncAdminTab);
    return () => window.removeEventListener("hashchange", syncAdminTab);
  }, []);

  const activeRole = userInfo.role;

  const roleLinks: Record<Role, NavLink[]> = {
    CUSTOMER: [
      { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      { label: "My Bookings", href: "/dashboard/customer#bookings", icon: CalendarCheck2 },
      { label: "Browse Services", href: "/service", icon: Wrench },
      { label: "Saved Services", href: "/dashboard/customer#saved", icon: Bookmark },
      { label: "Reviews & Ratings", href: "/review", icon: Star },
      { label: "Notifications", href: "/dashboard/customer#notifications", icon: Bell },
      { label: "Profile Settings", href: "/dashboard/customer#profile", icon: Settings },
      { label: "Help & Support", href: "/support", icon: HelpCircle },
    ],
    TECHNICIAN: [
      { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
      { label: "Assigned Jobs", href: "/dashboard/technician#assigned-jobs", icon: ListChecks },
      { label: "My Schedule", href: "/dashboard/technician#schedule", icon: Clock },
      { label: "Earnings", href: "/dashboard/technician#earnings", icon: DollarSign },
      { label: "My Reviews", href: "/dashboard/technician#reviews", icon: Star },
      { label: "Service Directory", href: "/service", icon: Wrench },
      { label: "Analytics", href: "/dashboard/technician#analytics", icon: TrendingUp },
      { label: "Help & Support", href: "/support", icon: HelpCircle },
    ],
    ADMIN: [
      { label: "Overview", href: "/dashboard/admin#admin-overview", icon: LayoutDashboard, adminTab: "overview" },
      { label: "Platform Insights", href: "/dashboard/admin#admin-analytics", icon: BarChart3, adminTab: "analytics" },
      { label: "Users", href: "/dashboard/admin#admin-users", icon: Users, adminTab: "users" },
      { label: "Technicians", href: "/dashboard/admin#admin-technicians", icon: Briefcase, adminTab: "technicians" },
      { label: "Services", href: "/dashboard/admin#admin-services", icon: Wrench, adminTab: "services" },
      { label: "Bookings", href: "/dashboard/admin#admin-bookings", icon: CalendarCheck2, adminTab: "bookings" },
      { label: "Reports", href: "/dashboard/admin#admin-reports", icon: FileText },
      { label: "Blog & Content", href: "/blog", icon: BookOpen },
      { label: "Settings", href: "/dashboard/admin#admin-settings", icon: Settings },
    ],
  };

  const initials = userInfo.name?.slice(0, 1).toUpperCase() || "U";

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

      {/* Role Badge */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {activeRole} PORTAL
          </span>
        </div>
      </div>

      <nav aria-label={`${activeRole.toLowerCase()} dashboard`} className="flex-1 p-3">
        <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {roleLinks[activeRole].map((item) => {
            const Icon = item.icon;
            const [itemPath, itemAnchor] = item.href.split("#");
            const isActive = item.adminTab
              ? pathname === "/dashboard/admin" &&
                activeAdminTab === item.adminTab
              : itemPath === pathname &&
                (itemAnchor
                  ? activeHash === `#${itemAnchor}`
                  : !activeHash);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(event) => {
                    if (!item.adminTab) return;
                    event.preventDefault();
                    setActiveAdminTab(item.adminTab);
                    document
                      .getElementById(`dashboard-tab-${item.adminTab}`)
                      ?.click();
                    window.location.hash = `admin-${item.adminTab}`;
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Links */}
      <div className="border-t border-border px-3 py-3">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Quick Access
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Blog", href: "/blog", icon: BookOpen },
            { label: "Support", href: "/support", icon: HelpCircle },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          {userInfo.photoUrl ? (
            <Image
              width={40}
              height={40}
              src={userInfo.photoUrl}
              alt={userInfo.name}
              className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </div>
          )}
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
