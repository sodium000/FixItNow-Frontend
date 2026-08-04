/* eslint-disable react/no-unescaped-entities */
"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Siren,
  Clock,
  MessageSquare,
  Wrench,
  ShieldCheck,
  Play,
  ArrowRight,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES & DATA
// ============================================================================

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const EMERGENCY_FEATURES: readonly FeatureCard[] = [
  {
    id: "rapid-response",
    title: "Rapid Response Time",
    description: "We arrive fast when you need urgent help.",
    icon: Clock,
  },
  {
    id: "instant-support",
    title: "Instant Support",
    description: "Quick help and clear communication.",
    icon: MessageSquare,
  },
  {
    id: "expert-technicians",
    title: "Expert Technicians",
    description: "Skilled professionals for all AC issues.",
    icon: Wrench,
  },
  {
    id: "247-availability",
    title: "24/7 Availability",
    description: "We arrive fast when you need urgent help.",
    icon: ShieldCheck,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EmergencyHeroSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const leftColRef = React.useRef<HTMLDivElement>(null);
  const featureCardsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const imageVisualRef = React.useRef<HTMLDivElement>(null);

  // State for Video Modal
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);

  // Close modal on 'Escape' key press & prevent scroll when open
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVideoOpen(false);
    };

    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVideoOpen]);

  // --------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Left Content Entrance
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 2. Feature Cards Stagger Animation
      const validCards = featureCardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 85%",
            },
          },
        );
      }

      // 3. Right Visual Showcase Entrance
      if (imageVisualRef.current) {
        gsap.fromTo(
          imageVisualRef.current,
          { opacity: 0, x: 50, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageVisualRef.current,
              start: "top 85%",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-[92vh] pt-20 bg-transparent text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary"
      >
        {/* SECTION WRAPPER */}
        <div className="w-full max-w-full sm:max-w-10/12 relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* =========================================================================
                LEFT COLUMN: HEADER, FEATURES & CTAS (7 Columns)
               ========================================================================= */}
            <div ref={leftColRef} className="lg:col-span-7 space-y-8">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wider uppercase border border-primary/20 backdrop-blur-sm">
                <Siren className="w-4 h-4 text-primary animate-pulse" />
                <span>Emergency Service</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                AC Emergency? <br />
                <span className="text-primary">We're Available 24/7</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                AC breakdowns don't wait, and neither do we. Our expert
                technicians are ready to restore your home’s comfort anytime,
                day or night.
              </p>

              {/* 2x2 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {EMERGENCY_FEATURES.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      ref={(el) => {
                        featureCardsRef.current[idx] = el;
                      }}
                      className="bg-card/80 backdrop-blur-md rounded-2xl p-5 border border-border/80 shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col items-start group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons Row */}
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <Link href="/about">
                  <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/25 transition-all duration-200 active:scale-95 text-base flex items-center gap-2">
                    <span>More About Us</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>

                {/* Watch Our Story Trigger */}
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-full hover:bg-card/80 border border-transparent hover:border-border transition-all group"
                  aria-label="Watch our video story"
                >
                  <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="font-bold text-primary tracking-wide text-sm">
                    Watch Our Story
                  </span>
                </button>
              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN: IMAGE SHOWCASE LAYOUT (5 Columns)
               ========================================================================= */}
            <div
              ref={imageVisualRef}
              className="lg:col-span-5 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-120">
                {/* Primary Main Image Frame */}
                <div className="relative w-full aspect-4/4.5 rounded-[36px] overflow-hidden shadow-2xl border border-border/50 bg-card">
                  <Image
                    src="/service2.webp"
                    alt="Technician repairing an AC unit"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-center"
                    priority
                  />

                  {/* Bottom Overlay Pill Bar */}
                  <div className="absolute bottom-4 left-4 right-4 bg-primary/95 text-primary-foreground backdrop-blur-md py-3 px-5 rounded-2xl flex items-center gap-2.5 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <p className="text-xs font-bold tracking-wide">
                      Instant Response &amp; Reliable Service
                    </p>
                  </div>
                </div>

                {/* Overlapping Badge Component (Experience Ribbon Shape) */}
                <div className="absolute -top-4 right-4 sm:-right-4 z-20 bg-primary text-primary-foreground p-4 pt-5 pb-7 w-24 text-center rounded-2xl shadow-xl border-2 border-background [clip-path:polygon(0_0,100%_0,100%_88%,50%_100%,0_88%)]">
                  <div className="text-2xl font-black tracking-tight leading-none">
                    15+
                  </div>
                  <div className="text-[9px] leading-tight uppercase font-extrabold tracking-wider mt-1 opacity-90">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VIDEO MODAL OVERLAY
         ========================================================================= */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click close when clicking player
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-primary fill-current" />
                <span className="font-bold text-sm text-foreground">
                  Our Service Story
                </span>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container (16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full bg-black">
              {/* Option A: Embedded YouTube / Vimeo iFrame */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Our Story Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Option B: Direct HTML5 Video (Uncomment if using local or MP4 URL) */}

              {/* <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                src="/videos/our-story.mp4"
              >
                Your browser does not support the video tag.
              </video>  */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
