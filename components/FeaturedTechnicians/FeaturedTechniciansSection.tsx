"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Settings,
  AlertCircle,
  RefreshCw,
  Hammer,
  Sparkles,
} from "lucide-react";
import {
  getTopTechniciansAction,
  type PublicTechnician,
} from "@/app/technician/topTechniciansAction";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// HELPERS
// ============================================================================

/** Map common service category names → icon */
function getSpecialtyIcon(specialty: string): React.ElementType {
  const lower = specialty.toLowerCase();
  if (lower.includes("electrical") || lower.includes("electric")) return Zap;
  if (lower.includes("plumb") || lower.includes("water")) return Droplets;
  if (lower.includes("ac") || lower.includes("hvac") || lower.includes("cool"))
    return Wind;
  if (lower.includes("paint")) return Paintbrush;
  if (
    lower.includes("carpent") ||
    lower.includes("furnit") ||
    lower.includes("wood")
  )
    return Hammer;
  if (lower.includes("clean")) return Sparkles;
  if (lower.includes("cctv") || lower.includes("secur")) return ShieldCheck;
  if (
    lower.includes("hand") ||
    lower.includes("repair") ||
    lower.includes("appliance")
  )
    return Wrench;
  return Settings;
}

function getSpecialtyColor(specialty: string): string {
  const lower = specialty.toLowerCase();
  if (lower.includes("electrical") || lower.includes("electric"))
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  if (lower.includes("plumb") || lower.includes("water"))
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
  if (lower.includes("ac") || lower.includes("hvac") || lower.includes("cool"))
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  if (lower.includes("paint"))
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
  if (
    lower.includes("carpent") ||
    lower.includes("furnit") ||
    lower.includes("wood")
  )
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (lower.includes("clean"))
    return "bg-teal-500/10 text-teal-600 dark:text-teal-400";
  if (lower.includes("cctv") || lower.includes("secur"))
    return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
  return "bg-primary/10 text-primary";
}

/** Derive best-guess specialty from technician services or fallback heuristics */
function getSpecialty(tech: PublicTechnician): string {
  const fromServices = tech.services?.[0]?.category?.name;
  if (fromServices) return fromServices;

  const email = (tech.user?.email || "").toLowerCase();
  if (email.includes("plumb")) return "Plumbing & Sanitary";
  if (email.includes("electric")) return "Electrical & Lighting";
  if (email.includes("ac") || email.includes("cool")) return "AC & Cooling";
  if (email.includes("paint")) return "Painting & Renovation";
  if (email.includes("carpenter") || email.includes("wood"))
    return "Carpentry & Furniture";
  if (email.includes("clean")) return "Deep Cleaning";
  if (email.includes("cctv") || email.includes("secur"))
    return "Security & CCTV";
  if (email.includes("appliance")) return "Appliance Repair";

  return "Home Maintenance";
}

function getInitials(name: string): string {
  if (!name || name.trim().length === 0) return "PRO";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRating(rating: number | string | undefined): string {
  if (rating === undefined || rating === null) return "5.0";
  const n = typeof rating === "string" ? parseFloat(rating) : rating;
  return isNaN(n) || n === 0 ? "5.0" : n.toFixed(1);
}

// ============================================================================
// SKELETON CARD
// ============================================================================

function SkeletonCard() {
  return (
    <div className="featured-tech-card flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-3 w-28 rounded bg-muted" />
      <div className="h-10 rounded-xl bg-muted" />
    </div>
  );
}

// ============================================================================
// TECHNICIAN CARD
// ============================================================================

function TechnicianCard({ tech }: { tech: PublicTechnician }) {
  const [imgError, setImgError] = React.useState(false);
  const specialty = getSpecialty(tech);
  const Icon = getSpecialtyIcon(specialty);
  const color = getSpecialtyColor(specialty);
  const name = tech.user?.name || tech.name || "Technician";
  const location = tech.city || tech.address || null;
  const rating = formatRating(tech.avgRating);
  const hourlyRate =
    typeof tech.hourlyRate === "string"
      ? parseFloat(tech.hourlyRate)
      : tech.hourlyRate ?? 0;
  const photoUrl = tech.user?.photoUrl;

  return (
    <div className="featured-tech-card group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
      {/* Availability badge */}
      <div
        className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
          tech.isAvailable
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            tech.isAvailable
              ? "bg-emerald-500 animate-pulse"
              : "bg-muted-foreground"
          }`}
        />
        {tech.isAvailable ? "Available" : "Busy"}
      </div>

      {/* Avatar + Name + Specialty */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {photoUrl && !imgError ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border bg-muted/30">
              <Image
                src={photoUrl}
                alt={name}
                fill
                sizes="64px"
                unoptimized
                onError={() => setImgError(true)}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-lg font-black text-primary">
              {getInitials(name)}
            </div>
          )}
          {tech.isVerified && (
            <div
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm"
              title="Verified Professional"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground truncate" title={name}>
            {name}
          </p>
          <div
            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span className="truncate">{specialty}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-xl bg-muted/50 py-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-foreground">{rating}</span>
          </div>
          <span className="mt-0.5 text-[10px] text-muted-foreground">
            {tech.totalReviews || 0} review{tech.totalReviews !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-muted/50 py-3">
          <span className="text-sm font-bold text-foreground">
            {tech.experienceYrs > 0 ? `${tech.experienceYrs} yrs` : "Skilled"}
          </span>
          <span className="mt-0.5 text-[10px] text-muted-foreground">
            experience
          </span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-muted/50 py-3">
          <span className="text-sm font-bold text-foreground">
            ৳{Math.round(hourlyRate)}
          </span>
          <span className="mt-0.5 text-[10px] text-muted-foreground">
            per hour
          </span>
        </div>
      </div>

      {/* Location */}
      {location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{location}</span>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/service"
        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:gap-2.5"
      >
        <Briefcase className="h-3.5 w-3.5" />
        View Services
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ============================================================================
// MAIN SECTION
// ============================================================================

export default function FeaturedTechniciansSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["topTechnicians"],
    queryFn: async () => {
      const result = await getTopTechniciansAction(4);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });

  const technicians = data ?? [];

  // GSAP entrance animations — use CSS class selectors instead of
  // Array.from(children) to avoid React DevTools child-mutation warnings.
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          ".featured-tech-heading-child",
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
          }
        );
      }
      if (gridRef.current) {
        gsap.fromTo(
          ".featured-tech-card",
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
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="technicians-heading"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Heading */}
      <div ref={headingRef} className="mb-12 flex flex-col items-center text-center gap-3" aria-hidden="false">
        <div className="featured-tech-heading-child inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Our Pros</span>
        </div>
        <h2 id="technicians-heading" className="featured-tech-heading-child text-3xl font-bold tracking-tight sm:text-4xl">
          Meet our top-rated{" "}
          <span className="text-primary">professionals</span>
        </h2>
        <p className="featured-tech-heading-child max-w-2xl text-base text-muted-foreground">
          Every technician on FixItNow is background-checked, skill-verified,
          and rated by real customers. You&apos;re in expert hands.
        </p>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Loading skeletons */}
        {isLoading &&
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-16 text-center gap-4">
            <AlertCircle className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Unable to load technicians
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Could not reach the backend. Please try again.
              </p>
            </div>
            <button
              id="reload-technicians-btn"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && technicians.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-16 text-center gap-3">
            <Wrench className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No verified technicians found yet.{" "}
              <Link href="/registration" className="text-primary hover:underline">
                Join as a technician
              </Link>
            </p>
          </div>
        )}

        {/* Real data */}
        {!isLoading &&
          technicians.map((tech) => (
            <TechnicianCard key={tech.id} tech={tech} />
          ))}
      </div>

      {/* Browse All CTA */}
      {!isLoading && technicians.length > 0 && (
        <div className="mt-10 text-center">
          <Link
            href="/service"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <Wrench className="h-4 w-4 text-primary" />
            Browse all services
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      )}
    </section>
  );
}
