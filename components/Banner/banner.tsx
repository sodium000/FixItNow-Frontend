"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Wrench,
  Zap,
  Paintbrush,
  Droplets,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================================
// DATA & TYPES
// ============================================================================

interface CategoryPill {
  name: string;
  icon: React.ElementType;
  pros: string;
}

interface StatItem {
  numericValue: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const CATEGORIES: readonly CategoryPill[] = [
  { name: "Plumbing", icon: Droplets, pros: "1,200+ Pros" },
  { name: "Electrical", icon: Zap, pros: "980+ Pros" },
  { name: "Handyman", icon: Wrench, pros: "2,100+ Pros" },
  { name: "Painting", icon: Paintbrush, pros: "850+ Pros" },
] as const;

// Updated data structure with raw numeric values for GSAP counter interpolation
const STATS: ReadonlyArray<StatItem> = [
  { numericValue: 15000, suffix: "+", label: "Verified Specialists" },
  { numericValue: 250000, suffix: "+", label: "Projects Finished" },
  { numericValue: 4.9, suffix: " / 5.0", label: "Average Rating", decimals: 1 },
];

// ============================================================================
// HERO BANNER COMPONENT
// ============================================================================

export default function HeroBanner() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const searchBarRef = React.useRef<HTMLDivElement>(null);
  const pillsRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Array of refs for each counter element
  const countRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const [serviceQuery, setServiceQuery] = React.useState("");
  const [userLocation, setUserLocation] = React.useState("New York, NY");

  // Entrance Animations + Counter Animation
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Entrance Animations for Hero Elements
      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.1 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          searchBarRef.current,
          { y: 20, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          pillsRef.current?.children || [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          "-=0.2"
        )
        .fromTo(
          cardRef.current,
          { x: 30, opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, duration: 0.7 },
          "-=0.6"
        );

      // 2. Count-Up Animations for Bottom Metrics
      STATS.forEach((stat, index) => {
        const targetEl = countRefs.current[index];
        if (!targetEl) return;

        const counterProxy = { val: 0 };

        tl.to(
          counterProxy,
          {
            val: stat.numericValue,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              const decimals = stat.decimals  || 0;
              const formattedVal = counterProxy.val.toLocaleString("en-US", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              });

              targetEl.innerText = `${formattedVal}${stat.suffix}`;
            },
          },
          "-=0.5" // Overlaps nicely with the card animation
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-transparent flex items-center"
    >
      <div className="mx-auto max-w-11/12 px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: HERO HEADLINE + CONVERSION SEARCH */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Guarantee Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md shadow-sm w-fit mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Over 250,000+ Verified Home Projects Completed</span>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12] mb-6"
            >
              Expert home services,{" "}
              <span className="relative inline-block text-primary">
                delivered to your door.
              </span>
            </h1>

            {/* Subhead */}
            <p
              ref={subtitleRef}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8"
            >
              Connect with background-checked, top-rated local professionals for repairs, maintenance, and home upgrades. Upfront pricing with zero hidden fees.
            </p>

            {/* SEARCH BOX CONTAINER */}
            <div
              ref={searchBarRef}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-card/95 border border-border/80 shadow-2xl shadow-foreground/10 backdrop-blur-xl mb-8"
            >
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row items-center gap-2"
              >
                {/* Search Input */}
                <div className="relative flex-1 w-full flex items-center px-3 py-2 sm:py-0">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    placeholder="What service do you need? (e.g. Plumber, AC Repair)"
                    className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                <div className="hidden sm:block h-6 w-px bg-border" />

                {/* Location Picker */}
                <div className="relative w-full sm:w-auto flex items-center px-3 py-2 sm:py-0">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mr-2" />
                  <input
                    type="text"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="Location"
                    className="w-28 bg-transparent text-xs sm:text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 rounded-xl sm:rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <span>Search Pros</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Popular Categories */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Popular Services Right Now
              </span>
              <div ref={pillsRef} className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={`#${cat.name.toLowerCase()}`}
                      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-card/80 hover:bg-accent hover:border-border text-xs font-medium text-foreground transition-all duration-200 backdrop-blur-sm"
                    >
                      <Icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({cat.pros})
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TRUST CARD & PROFILES */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={cardRef}
              className="relative w-full max-w-md rounded-3xl border border-border bg-card/90 p-6 shadow-2xl shadow-foreground/10 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      FixItNow Guarantee
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Included with every job
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground border border-border/40">
                  100% Free
                </span>
              </div>

              {/* Guarantees List */}
              <div className="py-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Upfront Fixed Quotes
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Know the total cost before work begins. No surprises.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Background Checked Pros
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      100% verified identity & criminal background clearance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      $10,000 Property Protection
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      If anything goes wrong, our property shield covers it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof Footer */}
              <div className="pt-5 border-t border-border flex items-center justify-between bg-accent/40 -mx-6 -mb-6 p-6 rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                      JD
                    </div>
                    <div className="h-8 w-8 rounded-full border-2 border-card bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                      AS
                    </div>
                    <div className="h-8 w-8 rounded-full border-2 border-card bg-secondary text-secondary-foreground flex items-center justify-center text-[10px] font-bold">
                      MK
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      4.9/5 from 42k reviews
                    </span>
                  </div>
                </div>

                <Link
                  href="#reviews"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Read stories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS STRIP WITH LIVE COUNTING ANIMATION */}
        <div className="mt-16 pt-8 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-11/12 mx-auto z-10 relative">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative flex flex-col items-center justify-center text-center p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Top glow indicator bar on hover */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-12" />

              {/* Animated Target Span */}
              <span
                ref={(el) => {
                  countRefs.current[index] = el;
                }}
                className="text-3xl sm:text-4xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors min-h-11 flex items-center justify-center"
              >
                0{stat.suffix}
              </span>

              <span className="text-xs font-semibold text-muted-foreground tracking-wide mt-1.5 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}