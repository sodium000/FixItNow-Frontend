/* eslint-disable react/no-unescaped-entities */
"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  Zap,
  ShieldCheck,
  Wrench,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES & DATA
// ============================================================================

export interface PlanFeature {
  text: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
  icon: LucideIcon;
}

const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    monthlyPrice: 19,
    yearlyPrice: 15,
    icon: Wrench,
    features: [
      "AC inspection & diagnosis",
      "Filter & coil surface cleaning",
      "Minor electrical issue fixing",
      "Basic airflow performance check",
      "Standard on-site service included",
    ],
    ctaText: "Choose Basic Plan",
  },
  {
    id: "premium",
    name: "Premium Plan",
    monthlyPrice: 59,
    yearlyPrice: 49,
    isPopular: true,
    badge: "Most Popular",
    icon: Sparkles,
    features: [
      "Complete deep AC servicing & wash",
      "Priority 24/7 customer support",
      "Emergency same-day repair service",
      "Full performance & gas optimization",
      "Free minor spare parts replacement",
      "100% Satisfaction Guarantee",
    ],
    ctaText: "Get Started Now",
  },
  {
    id: "standard",
    name: "Standard Plan",
    monthlyPrice: 39,
    yearlyPrice: 31,
    icon: ShieldCheck,
    features: [
      "Deep pressure cleaning service",
      "Refrigerant gas level check & top-up",
      "Full electrical system inspection",
      "Filter replacement & airflow tuning",
      "Efficiency & energy savings report",
    ],
    ctaText: "Choose Standard Plan",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PricingSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly",
  );

  // --------------------------------------------------------------------------
  // GSAP ENTRANCE ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 2. Billing Toggle Entrance
      if (toggleRef.current) {
        gsap.fromTo(
          toggleRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: toggleRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 3. Staggered Cards Entrance
      const validCards = cardRefs.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pb-5 min-h-[92vh] bg-transparent text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary"
    >
      <div className="relative z-10 w-full max-w-full sm:max-w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto my-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wider uppercase border border-primary/20 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>Service Pricing Plans</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Transparent &amp; Affordable Pricing
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Choose the right AC service package for your needs with upfront
            pricing and zero hidden fees.
          </p>
        </div>

        {/* BILLING CYCLE TOGGLE */}
        <div ref={toggleRef} className="flex justify-center items-center mb-16">
          <div className="inline-flex items-center bg-card/80 backdrop-blur-md border border-border/80 p-1.5 rounded-full shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* PRICING CARDS GRID */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {PRICING_PLANS.map((plan, idx) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`relative bg-card/80 backdrop-blur-md rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden group ${
                  plan.isPopular
                    ? "border-primary/80 shadow-2xl shadow-primary/15 ring-2 ring-primary/40 md:-translate-y-3 z-10"
                    : "border-border/80 shadow-lg hover:border-primary/40"
                }`}
              >
                {/* Popular Ribbon Tag */}
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      {plan.badge || "Popular"}
                    </span>
                  </div>
                )}

                {/* Card Header Wave / Gradient Block */}
                <div
                  className={`p-8 pb-10 relative overflow-hidden text-center ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border-b border-border/60 text-foreground"
                  }`}
                >
                  {/* Decorative Background Icon */}
                  <Icon
                    className={`absolute -bottom-4 -right-4 w-32 h-32 opacity-10 pointer-events-none ${
                      plan.isPopular ? "text-white" : "text-primary"
                    }`}
                  />

                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 font-bold text-sm shadow-sm ${
                      plan.isPopular
                        ? "bg-white/20 text-white backdrop-blur-md"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-extrabold mb-2">{plan.name}</h3>

                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold">$</span>
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">
                      {price}
                    </span>
                    <span className="text-xs font-semibold opacity-80">
                      /
                      {billingCycle === "monthly" ? "mo" : "mo (billed yearly)"}
                    </span>
                  </div>

                  <p className="text-[11px] uppercase font-bold tracking-widest opacity-75">
                    Per Active Unit / Service
                  </p>
                </div>

                {/* Card Features List */}
                <div className="p-8 grow flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">
                      What's Included
                    </h4>
                    <ul className="space-y-3.5">
                      {plan.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-3" />
                          </span>
                          <span className="text-muted-foreground leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/subscription">
                    <div className="pt-4">
                      <button
                        className={`w-full py-3.5 px-6 rounded-full font-bold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                          plan.isPopular
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                            : "border-2 border-primary/80 text-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
