"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Clock,
  Wrench,
  Award,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// FEATURE STATS & HIGHLIGHTS DATA
// ============================================================================

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const FEATURES: readonly Feature[] = [
  {
    id: "1",
    title: "24/7 Emergency Service",
    description:
      "Rapid response technicians available around the clock when your system breaks down.",
    icon: Clock,
  },
  {
    id: "2",
    title: "Certified HVAC Experts",
    description:
      "Licensed, background-checked professionals trained to handle all major AC brands.",
    icon: ShieldCheck,
  },
  {
    id: "3",
    title: "Upfront & Honest Pricing",
    description:
      "Flat-rate diagnostic fees with zero hidden costs or surprise charges on your bill.",
    icon: Award,
  },
  {
    id: "4",
    title: "100% Satisfaction Guarantee",
    description:
      "We stand behind our work with comprehensive warranties on all parts and labor.",
    icon: Wrench,
  },
];

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "15k+", label: "Cool Spaces Fixed" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Emergency Support" },
];

// ============================================================================
// MAIN ABOUT SECTION COMPONENT
// ============================================================================

export default function AboutSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const leftColRef = React.useRef<HTMLDivElement>(null);
  const rightColRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);

  // --------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Left Image Stack Animation
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          },
        );
      }

      // 2. Right Text Content Entrance
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          },
        );
      }

      // 3. Stats Banner Stagger
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 90%",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-[92vh] pt-20 bg-transparent text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/4 -translate-x-1/2 h-125 w-175 rounded-full bg-primary/25 blur-[120px] z-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 h-100 w-100 rounded-full bg-primary/20 blur-[110px] z-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/40 to-transparent z-0"
      />

      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* =========================================================================
            TOP GRID: IMAGES (LEFT) + CONTENT (RIGHT)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN: OVERLAPPING IMAGE STACK */}
          <div ref={leftColRef} className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative h-95 sm:h-115 w-full rounded-[32px] overflow-hidden border-2 border-slate-800 shadow-2xl">
                <Image
                  src=""
                  alt="Certified AC Technician at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-65">
                <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center shrink-0 text-slate-950">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    Top Rated Service
                  </h4>
                  <p className="text-xs text-slate-400">
                    Guaranteed quality repairs & maintenance
                  </p>
                </div>
              </div>

              {/* Small Secondary Floating Badge */}
              <div className="absolute -top-4 -left-2 sm:left-4 bg-gray-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-blue-400/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>100% Certified Techs</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TEXT CONTENT & FEATURES */}
          <div ref={rightColRef} className="lg:col-span-6 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center mt-10 gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 font-bold text-xs uppercase tracking-widest shadow-sm">
              <Users className="w-4 h-4 text-sky-400" />
              <span>About CoolFix</span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Your Trusted Partner for <br />
              <span className="text-gray-600">Reliable Cooling Solutions</span>
            </h2>

            {/* Description */}
            <p className="text-slate-400 text-base leading-relaxed">
              At CoolFix, we understand how essential a fully functioning AC is
              for your comfort and productivity. Over the past decade, we’ve
              built our reputation on fast arrival times, transparent flat-rate
              pricing, and high-quality repairs done right the first time.
            </p>

            {/* Key Feature List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-400/10 border border-sky-400/30 text-sky-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Call to Action Button */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href="#booking"
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-full text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-400/10"
              >
                <span>Schedule a Repair</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>No Hidden Diagnostic Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
