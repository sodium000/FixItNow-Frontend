"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  Star,
  CalendarCheck2,
  ShieldCheck,
  TrendingUp,
  Award,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
}

const STATS: StatItem[] = [
  {
    value: 12400,
    suffix: "+",
    label: "Bookings Completed",
    sublabel: "Successful service appointments",
    icon: CalendarCheck2,
    color: "text-primary",
  },
  {
    value: 4900,
    suffix: "+",
    label: "Happy Customers",
    sublabel: "Homeowners who booked with us",
    icon: Users,
    color: "text-primary",
  },
  {
    value: 320,
    suffix: "+",
    label: "Verified Technicians",
    sublabel: "Background-checked professionals",
    icon: ShieldCheck,
    color: "text-primary",
  },
  {
    value: 4.9,
    suffix: "★",
    label: "Average Rating",
    sublabel: "Based on 12,400+ reviews",
    icon: Star,
    color: "text-amber-500 dark:text-amber-400",
  },
  {
    value: 48,
    suffix: "hrs",
    label: "Avg Response Time",
    sublabel: "From booking to service",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    value: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    sublabel: "Would recommend FixItNow",
    icon: Award,
    color: "text-primary",
  },
];

function AnimatedCounter({
  target,
  suffix,
  decimals = 0,
  duration = 2,
}: {
  target: number;
  suffix: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.to(
          { value: 0 },
          {
            value: target,
            duration,
            ease: "power2.out",
            onUpdate: function () {
              if (el) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                el.textContent =
                  (this as any).targets()[0].value.toFixed(decimals) + suffix;
              }
            },
            onComplete: () => {
              if (el) el.textContent = target.toFixed(decimals) + suffix;
            },
          },
        );
      },
    });

    return () => trigger.kill();
  }, [target, suffix, decimals, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function StatsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          ".stats-heading-child",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
            },
          },
        );
      }

      if (gridRef.current) {
        gsap.fromTo(
          ".stats-card",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20"
    >
      {/* Background decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-[80px]"
      />

      <div className="relative mx-auto w-10/12 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className="mb-14 flex flex-col items-center text-center gap-3"
        >
          <div className="stats-heading-child inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">
              Platform Stats
            </span>
          </div>
          <h2
            id="stats-heading"
            className="stats-heading-child text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Numbers that speak for themselves
          </h2>
          <p className="stats-heading-child max-w-2xl text-base text-muted-foreground">
            FixItNow has grown to become Bangladesh&apos;s most trusted
            home-service platform, one successful booking at a time.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const isDecimal = stat.value % 1 !== 0;
            return (
              <div
                key={stat.label}
                className="stats-card group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
              >
                {/* Background glow on hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-500 group-hover:from-primary/5 group-hover:to-transparent"
                />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div
                      className={`text-4xl font-black tracking-tight ${stat.color}`}
                    >
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        decimals={isDecimal ? 1 : 0}
                      />
                    </div>
                    <p className="mt-2 text-sm font-bold text-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {stat.sublabel}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-current/10 ${stat.color}`}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: "currentColor" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 p-8 text-center sm:flex-row sm:text-left">
          <ShieldCheck className="h-10 w-10 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="font-bold text-foreground">
              FixItNow Satisfaction Guarantee
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Every booking is backed by our service guarantee. If you&apos;re
              not satisfied, we&apos;ll make it right — no questions asked.
            </p>
          </div>
          <a
            href="/service"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book a Service
          </a>
        </div>
      </div>
    </section>
  );
}
