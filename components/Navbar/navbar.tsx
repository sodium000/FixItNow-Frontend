"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import {
  Wrench,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  CalendarCheck2,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfileAction, type UserProfile } from "@/lib/profileAction";
import { logoutUser } from "@/app/(auth)/login/loginfuntion";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Home",
    href: "/",
    description: "Browse verified home care experts",
  },
  {
    label: "About Us",
    href: "/about",
    description: "Background-checked specialists",
  },
  {
    label: "Services",
    href: "/service",
    description: "Transparent, step-by-step booking",
  },
  {
    label: "Pricing",
    href: "/subscription",
    description: "Upfront quotes with no surprises",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    badge: "New",
    description: "Manage your profile and bookings",
  },
] as const;

// ============================================================================
// BRAND LOGO COMPONENT
// ============================================================================

const BrandLogo = React.memo(function BrandLogo() {
  const iconRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      rotate: 8,
      scale: 1.05,
      duration: 0.25,
      ease: "back.out(2)",
    });
  };

  const handleMouseLeave = () => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <Link
      href="/"
      className="group flex items-center gap-3 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl py-1 px-1.5 transition-opacity duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="FixItNow - Home Page"
    >
      <div
        ref={iconRef}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors duration-200"
      >
        <Wrench className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold tracking-tight text-foreground leading-none">
            FixItNow
          </span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        <span className="text-[11px] font-medium text-muted-foreground tracking-wide leading-tight">
          Trusted Home Services
        </span>
      </div>
    </Link>
  );
});

interface DesktopNavItemProps {
  item: NavItem;
  index: number;
  isActive: boolean;
}

const DesktopNavItem = React.memo(function DesktopNavItem({
  item,
  isActive,
}: DesktopNavItemProps) {
  const itemRef = React.useRef<HTMLLIElement>(null);
  const lineRef = React.useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        y: -2,
        duration: 0.2,
        ease: "power2.out",
      });
    }
    if (lineRef.current && !isActive) {
      gsap.to(lineRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        y: 0,
        duration: 0.2,
        ease: "power2.inOut",
      });
    }
    if (lineRef.current && !isActive) {
      gsap.to(lineRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  return (
    <li
      ref={itemRef}
      className="nav-item relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg ${
          isActive
            ? "text-primary font-extrabold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>{item.label}</span>
        {item.badge && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground border border-border/50">
            {item.badge}
          </span>
        )}
      </Link>

      {/* Active & Hover Underline Bar */}
      <span
        ref={lineRef}
        aria-hidden="true"
        className={`absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary transition-all duration-300 pointer-events-none ${
          isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />
    </li>
  );
});

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = React.useRef<HTMLElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLDivElement>(null);
  const navListRef = React.useRef<HTMLUListElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const mobileSheetRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState<boolean>(false);
  const isScrolledRef = React.useRef<boolean>(false);

  const queryClient = useQueryClient();

  // Fetch logged-in user profile from /api/auth/me
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

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const navItems = navListRef.current?.querySelectorAll(".nav-item") || [];

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          logoRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4 },
          "-=0.3",
        )
        .fromTo(
          navItems,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.05 },
          "-=0.2",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4 },
          "-=0.2",
        );
    });

    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    gsap.set(pill, {
      width: "96%",
      borderRadius: "9999px",
      backgroundColor: "var(--color-card, rgba(255, 255, 255, 0.75))",
      borderColor: "var(--color-border, rgba(0, 0, 0, 0.08))",
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.03)",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
    });

    const handleScroll = () => {
      const scrolled = window.scrollY > 30;

      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;

        gsap.to(pill, {
          width: scrolled ? "90%" : "96%",
          paddingTop: scrolled ? "0.5rem" : "0.75rem",
          paddingBottom: scrolled ? "0.5rem" : "0.75rem",
          backgroundColor: scrolled
            ? "var(--color-card, rgba(255, 255, 255, 0.88))"
            : "var(--color-card, rgba(255, 255, 255, 0.75))",
          backdropFilter: scrolled ? "blur(16px)" : "blur(8px)",
          boxShadow: scrolled
            ? "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.03)",
          duration: 0.45,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (!mobileSheetRef.current) return;
      const links = mobileSheetRef.current.querySelectorAll(".mobile-nav-item");

      gsap.fromTo(
        links,
        { x: 24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        },
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 pointer-events-none transition-all"
    >
      <div
        ref={pillRef}
        className="pointer-events-auto flex items-center justify-between border transition-all duration-300 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* LOGO */}
        <div ref={logoRef} className="flex items-center">
          <BrandLogo />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center"
        >
          <ul
            ref={navListRef}
            className="flex items-center gap-1 xl:gap-2 list-none m-0 p-0"
          >
            {NAV_ITEMS.map((item, index) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <DesktopNavItem
                  key={item.label}
                  item={item}
                  index={index}
                  isActive={isActive}
                />
              );
            })}
          </ul>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div ref={ctaRef} className="hidden sm:flex items-center gap-3">
          {userProfile ? (
            /* ── LOGGED-IN USER HOVER PROFILE DROPDOWN ── */
            <div
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full border border-border bg-card/90 px-3 py-1.5 shadow-sm hover:border-primary/50 transition-all cursor-pointer"
              >
                {userProfile.photoUrl ? (
                  <img
                    src={userProfile.photoUrl}
                    alt={userProfile.name}
                    className="h-7 w-7 rounded-full object-cover border border-primary/30"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center border border-primary/20">
                    {initials}
                  </div>
                )}
                <span className="text-xs font-bold text-foreground max-w-[110px] truncate">
                  {userProfile.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {/* Hover Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-xl backdrop-blur-xl space-y-3">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      {userProfile.photoUrl ? (
                        <img
                          src={userProfile.photoUrl}
                          alt={userProfile.name}
                          className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center border border-primary/20 shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-foreground truncate">
                          {userProfile.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {userProfile.email}
                        </p>
                        <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary border border-primary/20">
                          {userProfile.role}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-1">
                      <Link
                        href="/dashboard/customer"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out / Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── UNAUTHENTICATED SIGN IN BUTTON ── */
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-foreground hover:text-foreground hover:bg-accent/60 rounded-full px-4 h-9 transition-colors"
            >
              <Link href="/login">
                <User className="mr-1.5 h-4 w-4 text-muted-foreground" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}

          <Button
            asChild
            size="sm"
            className="group relative h-9 px-5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-sm transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link href="/booking">
              <CalendarCheck2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-6" />
              <span>Book a Service</span>
            </Link>
          </Button>
        </div>

        {/* MOBILE MENU TRIGGER & SHEET */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-border bg-background/80 backdrop-blur-sm text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:max-w-md border-l border-border bg-card p-0 flex flex-col justify-between shadow-2xl"
            >
              <div ref={mobileSheetRef} className="flex flex-col h-full">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-base font-bold text-foreground">
                        FixItNow
                      </span>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        Verified Local Experts
                      </p>
                    </div>
                  </div>
                  <SheetClose asChild nativeButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                      aria-label="Close Menu"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile User Profile Section */}
                {userProfile && (
                  <div className="mx-6 mt-4 p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                    {userProfile.photoUrl ? (
                      <img
                        src={userProfile.photoUrl}
                        alt={userProfile.name}
                        className="h-10 w-10 rounded-full object-cover border border-primary/30 shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">
                        {userProfile.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {userProfile.email}
                      </p>
                      <span className="mt-0.5 inline-block text-[9px] font-extrabold uppercase text-primary">
                        {userProfile.role}
                      </span>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
                    Navigation
                  </div>
                  {NAV_ITEMS.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href}
                          className={`mobile-nav-item group flex items-center justify-between rounded-xl p-3 text-base transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isActive
                              ? "bg-primary/10 text-primary font-bold border-l-4 border-primary"
                              : "font-medium text-foreground hover:bg-accent"
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground border border-border/40">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <span className="text-xs text-muted-foreground font-normal mt-0.5">
                                {item.description}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </SheetClose>
                    );
                  })}

                  {userProfile && (
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/customer"
                        className="mobile-nav-item group flex items-center justify-between rounded-xl p-3 text-base font-medium text-foreground hover:bg-accent transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span>My Profile</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </SheetClose>
                  )}

                  {/* Trust Banner inside Drawer */}
                  <div className="mt-4 rounded-2xl bg-secondary/50 border border-border/60 p-4 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">
                        FixItNow Guarantee
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Every booking is covered by up to ৳50,000 property
                        damage protection.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom CTAs */}
                <div className="p-6 border-t border-border bg-card/80 backdrop-blur-md flex flex-col gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-sm justify-center"
                  >
                    <Link href="/booking" onClick={() => setIsOpen(false)}>
                      <CalendarCheck2 className="mr-2 h-5 w-5" />
                      Book a Service
                    </Link>
                  </Button>

                  {userProfile ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full h-11 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 font-medium text-sm justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out / Logout
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full h-11 rounded-xl border-border text-foreground hover:bg-accent font-medium text-sm justify-center"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        Sign In to Account
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
