"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Wrench,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  CalendarCheck2, 
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";



interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Services",
    href: "#services",
    description: "Browse verified home care experts",
  },
  {
    label: "Professionals",
    href: "#professionals",
    badge: "Top Rated",
    description: "Background-checked specialists",
  },
  {
    label: "How it Works",
    href: "#how-it-works",
    description: "Transparent, step-by-step booking",
  },
  {
    label: "Pricing",
    href: "#pricing",
    description: "Upfront quotes with no surprises",
  },
  {
    label: "Become a Provider",
    href: "#become-provider",
    badge: "Earn",
    description: "Join our network of skilled pros",
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
}

const DesktopNavItem = React.memo(function DesktopNavItem({
  item,
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
    if (lineRef.current) {
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
    if (lineRef.current) {
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
        className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      >
        <span>{item.label}</span>
        {item.badge && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground border border-border/50">
            {item.badge}
          </span>
        )}
      </Link>
      <span
        ref={lineRef}
        aria-hidden="true"
        className="absolute bottom-0 left-3 right-3 h-0.5 origin-center scale-x-0 rounded-full bg-primary opacity-0 pointer-events-none"
      />
    </li>
  );
});



export default function Navbar() {
  const headerRef = React.useRef<HTMLElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLDivElement>(null);
  const navListRef = React.useRef<HTMLUListElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const mobileSheetRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const isScrolledRef = React.useRef<boolean>(false);

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const navItems = navListRef.current?.querySelectorAll(".nav-item") || [];

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          logoRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4 },
          "-=0.3"
        )
        .fromTo(
          navItems,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.05 },
          "-=0.2"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4 },
          "-=0.2"
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
        }
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

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
            {NAV_ITEMS.map((item, index) => (
              <DesktopNavItem key={item.label} item={item} index={index} />
            ))}
          </ul>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div ref={ctaRef} className="hidden sm:flex items-center gap-3">
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

          <Button
            asChild
            size="sm"
            className="group relative h-9 px-5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-sm transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link href="#book">
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

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
                    Navigation
                  </div>
                  {NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className="mobile-nav-item group flex items-center justify-between rounded-xl p-3 text-base font-medium text-foreground hover:bg-accent transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  ))}

                  {/* Trust Banner inside Drawer */}
                  <div className="mt-6 rounded-2xl bg-secondary/50 border border-border/60 p-4 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">
                        FixItNow Guarantee
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Every booking is covered by up to $10,000 property damage protection.
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
                    <Link href="#book" onClick={() => setIsOpen(false)}>
                      <CalendarCheck2 className="mr-2 h-5 w-5" />
                      Book a Service
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full h-11 rounded-xl border-border text-foreground hover:bg-accent font-medium text-sm justify-center"
                  >
                    <Link href="#sign-in" onClick={() => setIsOpen(false)}>
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Sign In to Account
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}