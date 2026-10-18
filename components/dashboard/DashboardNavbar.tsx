"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Wrench,
  Search,
  HelpCircle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfileAction, type UserProfile } from "@/lib/profileAction";
import { logoutUser } from "@/app/(auth)/login/loginfuntion";
import toast from "react-hot-toast";
import Image from "next/image";
import ThemeToggle from "@/components/theme/ThemeToggle";

export function DashboardNavbar() {
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const { data: userProfile } = useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await getMyProfileAction();
      return res.success ? res.data : null;
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await logoutUser();
      queryClient.clear();
      toast.success("Signed out successfully!", { id: toastId });
      window.location.href = "/login";
    } catch {
      toast.error("Failed to sign out. Please try again.", { id: toastId });
    }
  };

  // Close menus on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const profileHref = userProfile
    ? `/dashboard/${userProfile.role.toLowerCase()}`
    : "/dashboard";

  const MOCK_NOTIFICATIONS = [
    { id: "1", text: "Your booking #BK-1234 has been confirmed.", time: "2 min ago", unread: true },
    { id: "2", text: "Tanvir Ahmed accepted your AC service request.", time: "1 hr ago", unread: true },
    { id: "3", text: "Your review was submitted successfully.", time: "Yesterday", unread: false },
    { id: "4", text: "New service available in your area: Deep Cleaning.", time: "2 days ago", unread: false },
  ];

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-bold text-foreground sm:block">
            FixItNow
          </span>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
      </div>

      {/* Center: Search (desktop) */}
      <div className="hidden max-w-xs flex-1 mx-8 lg:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="dashboard-search"
            type="search"
            placeholder="Search services, bookings..."
            className="h-9 w-full rounded-xl border border-input bg-muted/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div ref={menuRef} className="flex items-center gap-2">
        <ThemeToggle />

        {/* Help link */}
        <Link
          href="/support"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Help & Support"
        >
          <HelpCircle className="h-4 w-4" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            id="dashboard-notifications-btn"
            type="button"
            onClick={() => { setIsNotifOpen((v) => !v); setIsMenuOpen(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xl backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground">Notifications</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {unreadCount} new
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition-colors ${
                        n.unread ? "bg-primary/5 border border-primary/10" : "hover:bg-accent"
                      }`}
                    >
                      {n.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <div className={n.unread ? "" : "ml-4"}>
                        <p className="text-foreground leading-snug">{n.text}</p>
                        <p className="mt-0.5 text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  id="mark-all-read-btn"
                  className="mt-3 w-full rounded-xl border border-border py-2 text-[11px] font-semibold text-muted-foreground hover:bg-accent transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            id="dashboard-profile-btn"
            type="button"
            onClick={() => { setIsMenuOpen((v) => !v); setIsNotifOpen(false); }}
            className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 shadow-sm hover:border-primary/40 transition-all"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            {userProfile?.photoUrl ? (
              <Image
                src={userProfile.photoUrl}
                alt={userProfile.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover border border-primary/20"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center border border-primary/20">
                {initials}
              </div>
            )}
            <span className="hidden text-xs font-bold text-foreground sm:block max-w-24 truncate">
              {userProfile?.name ?? "Account"}
            </span>
            <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xl backdrop-blur-xl space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  {userProfile?.photoUrl ? (
                    <Image
                      src={userProfile.photoUrl}
                      alt={userProfile.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center border border-primary/20 shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-foreground truncate">
                      {userProfile?.name ?? "Guest"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {userProfile?.email ?? ""}
                    </p>
                    {userProfile?.role && (
                      <span className="mt-0.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary border border-primary/20">
                        {userProfile.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-0.5">
                  {[
                    { href: profileHref, icon: User, label: "My Profile" },
                    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard Home" },
                    { href: "/service", icon: Wrench, label: "Browse Services" },
                    { href: "/support", icon: HelpCircle, label: "Help & Support" },
                    { href: "/dashboard/customer#profile", icon: Settings, label: "Account Settings" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-2">
                  <button
                    id="dashboard-logout-btn"
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out / Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
