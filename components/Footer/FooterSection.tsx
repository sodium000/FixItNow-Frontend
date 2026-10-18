"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Wrench,
  ShieldCheck,
  CalendarCheck2,
  ArrowRight,
  Clock,
  CreditCard,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Send,
  Star,
  Headphones,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// DATA & CONSTANTS
// ============================================================================

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "100% Verified Experts",
    desc: "Background-checked & skill-certified technicians",
  },
  {
    icon: Clock,
    title: "On-Time Dispatch",
    desc: "Same-day service & punctual arrival guaranteed",
  },
  {
    icon: CreditCard,
    title: "Upfront Fair Pricing",
    desc: "Clear itemized quotes with zero hidden charges",
  },
  {
    icon: Award,
    title: "Service Satisfaction",
    desc: "Guaranteed quality and hassle-free resolution",
  },
];

const SERVICE_LINKS = [
  { label: "Electrical & Lighting", href: "/service" },
  { label: "Plumbing & Sanitary", href: "/service" },
  { label: "AC & Cooling Systems", href: "/service" },
  { label: "Carpentry & Furniture", href: "/service" },
  { label: "Home Deep Cleaning", href: "/service" },
  { label: "Security & CCTV Setup", href: "/service" },
  { label: "Appliance Repairs", href: "/service" },
];

const COMPANY_LINKS = [
  { label: "About FixItNow", href: "/about" },
  { label: "All Home Services", href: "/service" },
  { label: "Pricing & Memberships", href: "/subscription" },
  { label: "Home Maintenance Blog", href: "/blog" },
  { label: "Help & Support Center", href: "/support" },
  { label: "Contact Us", href: "/contact" },
];

const PORTAL_LINKS = [
  { label: "Customer Dashboard", href: "/dashboard/customer" },
  { label: "Technician Portal", href: "/dashboard/technician" },
  { label: "Admin Workspace", href: "/dashboard/admin" },
  { label: "Register as a Technician", href: "/registration" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FooterSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const ctaCardRef = React.useRef<HTMLDivElement>(null);
  const floatImgRef = React.useRef<HTMLDivElement>(null);
  const footerContentRef = React.useRef<HTMLDivElement>(null);

  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setNewsletterEmail("");
      toast.success("Thank you for subscribing to FixItNow updates!");
    }, 600);
  };

  // GSAP Animations
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. CTA Card Entrance
      if (ctaCardRef.current) {
        gsap.fromTo(
          ctaCardRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaCardRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 2. Floating Technician Animation
      if (floatImgRef.current) {
        gsap.to(floatImgRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "easeInOut",
        });
      }

      // 3. Footer Links Stagger
      if (footerContentRef.current) {
        gsap.fromTo(
          ".footer-column-item",
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerContentRef.current,
              start: "top 90%",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full font-sans overflow-hidden bg-background border-t border-border/50"
    >
      {/* =========================================================================
          TOP CTA FLOATING BANNER
         ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 pt-8 sm:pt-12 -mb-28 sm:-mb-32">
        <div
          ref={ctaCardRef}
          className="relative rounded-3xl sm:rounded-[36px] p-8 sm:p-12 lg:p-14 overflow-hidden border border-primary/20 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 text-white"
        >
          {/* Subtle Glows & Grid Pattern */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
                <span className="text-white">Smart Home Services in Minutes</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Need trusted repairs? <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-400 to-teal-300">
                  Book verified experts today.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                FixItNow connects you with background-checked electricians,
                plumbers, AC specialists, and home mechanics across Bangladesh.
                Upfront pricing with zero hidden fees.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/service"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  <span>Book a Service</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/registration"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                >
                  <Wrench className="h-4 w-4 text-primary" />
                  <span>Join as a Technician</span>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Background Checked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Transparent Rates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Quick Response</span>
                </div>
              </div>
            </div>

            {/* Right Graphic / Floating Avatar Card */}
            <div
              ref={floatImgRef}
              className="lg:col-span-5 flex justify-center lg:justify-end relative"
            >
              <div className="relative">
                {/* Glowing Aura Ring */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-tr from-primary/30 to-sky-400/20 p-2 shadow-2xl backdrop-blur-md border border-white/20 overflow-hidden group">
                  <Image
                    src="/footer.avif"
                    alt="Verified FixItNow Technician"
                    fill
                    sizes="(max-width: 640px) 14rem, 16rem"
                    className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Overlay badge */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-900/90 border border-white/15 p-2.5 backdrop-blur-md flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-white truncate">
                        Certified Professionals
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                        <Star className="h-3 w-3 fill-amber-300" />
                        <span>4.9 / 5.0 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN FOOTER WRAPPER
         ========================================================================= */}
      <footer className="relative bg-slate-950 text-slate-300 pt-44 sm:pt-48 pb-12 border-t border-slate-800/80">
        <div
          ref={footerContentRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14"
        >
          {/* =====================================================================
              VALUE PROPOSITIONS ROW
             ===================================================================== */}
          <div className="footer-column-item grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-slate-800/80">
            {VALUE_PROPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-slate-900"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =====================================================================
              MAIN 4-COLUMN FOOTER NAVIGATION & NEWSLETTER
             ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Col 1: Brand & Contact (4 Cols) */}
            <div className="footer-column-item lg:col-span-4 space-y-5">
              <Link
                href="/"
                className="inline-flex items-center gap-3 group outline-none"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-extrabold tracking-tight text-white leading-none">
                      FixItNow
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">
                    Trusted Home & Office Services
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Bangladesh&apos;s modern on-demand service marketplace connecting
                households with verified electricians, plumbers, AC experts, and
                craftsmen.
              </p>

              {/* Contact Information */}
              <div className="space-y-2.5 pt-1 text-sm text-slate-300">
                <a
                  href="tel:+8801815152634"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="font-medium">+880 1815-152634</span>
                </a>

                <a
                  href="mailto:support@fixitnow.com"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="font-medium">support@fixitnow.com</span>
                </a>

                <div className="flex items-center gap-3 text-slate-400">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>Dhaka, Chittagong, Sylhet & Across BD</span>
                </div>
              </div>
            </div>

            {/* Col 2: Services (3 Cols) */}
            <div className="footer-column-item lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Our Services
              </h3>
              <ul className="space-y-2.5 text-sm">
                {SERVICE_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-slate-600 transition-all group-hover:w-2 group-hover:bg-primary" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Company & Support (2 Cols) */}
            <div className="footer-column-item lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Company
              </h3>
              <ul className="space-y-2.5 text-sm">
                {COMPANY_LINKS.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-slate-600 transition-all group-hover:w-2 group-hover:bg-primary" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Portals & Newsletter (3 Cols) */}
            <div className="footer-column-item lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Stay Updated
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribe for exclusive repair discounts, seasonal maintenance
                checklists, and home tips.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 px-4 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                </button>
              </form>

              {/* Quick Portal Shortcuts */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Platform Portals
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {PORTAL_LINKS.slice(0, 4).map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              BOTTOM BAR: COPYRIGHT & SYSTEM STATUS
             ===================================================================== */}
          <div className="footer-column-item pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} FixItNow Technologies Ltd. All
                rights reserved.
              </p>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-primary transition-colors">
                Help & FAQs
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
