"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  UserCheck,
  Wrench,
  Headphones,
  Settings,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES & DATA
// ============================================================================

interface StepItem {
  id: number;
  stepNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const REPAIR_STEPS: readonly StepItem[] = [
  {
    id: 1,
    stepNumber: "01",
    title: "Book Your Service",
    description:
      "Schedule online or call anytime for fast, easy, convenient service booking.",
    icon: Calendar,
  },
  {
    id: 2,
    stepNumber: "02",
    title: "Technician Visit",
    description:
      "Expert technician arrives quickly to inspect and diagnose your AC issue.",
    icon: UserCheck,
  },
  {
    id: 3,
    stepNumber: "03",
    title: "Repair & Service",
    description:
      "Fast repairs with advanced tools and genuine parts ensure reliable performance.",
    icon: Wrench,
  },
  {
    id: 4,
    stepNumber: "04",
    title: "After-Service Support",
    description:
      "Always available to provide follow-up support and assistance when needed.",
    icon: Headphones,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RepairProcessSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const stepperRef = React.useRef<HTMLDivElement>(null);
  const activeLineRef = React.useRef<HTMLDivElement>(null);
  const stepNodesRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const cardNodesRef = React.useRef<(HTMLDivElement | null)[]>([]);

  // State tracking active step (default to Step 1)
  const [activeStep, setActiveStep] = React.useState<number>(1);

  // --------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER & ENTRANCE ANIMATIONS
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

      // 2. Stepper Entrance & Progress Line Grow
      if (stepperRef.current) {
        gsap.fromTo(
          stepperRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepperRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // 3. Stagger Cards Entrance
      const validCards = cardNodesRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 85%",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --------------------------------------------------------------------------
  // DYNAMIC GSAP ANIMATION WHEN ACTIVE STEP CHANGES
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    // 1. Animate active progress line width depending on step (1 to 4)
    const linePercentage = ((activeStep - 1) / (REPAIR_STEPS.length - 1)) * 100;
    if (activeLineRef.current) {
      gsap.to(activeLineRef.current, {
        width: `${linePercentage}%`,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    // 2. Scale & Pulse active Stepper Node
    stepNodesRef.current.forEach((node, index) => {
      if (!node) return;
      const stepId = index + 1;
      const isActive = stepId === activeStep;

      gsap.to(node, {
        scale: isActive ? 1.25 : 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });
  }, [activeStep]);

  // Handle hover on card -> Highlight step number & tile
  const handleCardHover = (stepId: number, index: number) => {
    setActiveStep(stepId);

    const card = cardNodesRef.current[index];
    if (card) {
      gsap.to(card, {
        y: -6,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleCardLeave = (index: number) => {
    const card = cardNodesRef.current[index];
    if (card) {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-transparent text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary"
    >

      {/* =========================================================================
          SECTION CONTENT
         ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div
          ref={headerRef}
          className="text-center max-w-2xl mx-auto mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wider uppercase border border-primary/20 backdrop-blur-sm">
            <Settings className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Simple 4 Step Repair Process
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We deliver reliable, fast, and professional AC services to keep your
            home cool, efficient, and comfortable all year round.
          </p>
        </div>

        {/* INTERACTIVE STEP INDICATOR BAR */}
        <div
          ref={stepperRef}
          className="relative flex justify-between items-center mb-16 px-4 max-w-2xl mx-auto"
        >
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-border/80 rounded-full z-0" />

          {/* Active Progress Line (Animated via GSAP) */}
          <div
            ref={activeLineRef}
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all shadow-[0_0_12px_rgba(59,130,246,0.5)]"
            style={{ width: "0%" }}
          />

          {/* Step Number Badges */}
          {REPAIR_STEPS.map((step, idx) => {
            const isActive = step.id === activeStep;
            return (
              <div
                key={step.id}
                ref={(el) => {
                  stepNodesRef.current[idx] = el;
                }}
                onClick={() => setActiveStep(step.id)}
                className={`relative z-10 w-10 h-10 rounded-full font-extrabold text-xs flex items-center justify-center cursor-pointer transition-colors duration-300 ring-4 ring-background ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card text-muted-foreground border border-border/80 hover:border-primary/50"
                }`}
              >
                {step.stepNumber}
              </div>
            );
          })}
        </div>

        {/* SERVICE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {REPAIR_STEPS.map((step, idx) => {
            const isActive = step.id === activeStep;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                ref={(el) => {
                  cardNodesRef.current[idx] = el;
                }}
                onMouseEnter={() => handleCardHover(step.id, idx)}
                onMouseLeave={() => handleCardLeave(idx)}
                className={`bg-card/80 backdrop-blur-md rounded-3xl p-6 border transition-all duration-300 flex flex-col items-center justify-between cursor-pointer group ${
                  isActive
                    ? "border-primary/60 shadow-xl shadow-primary/10 ring-1 ring-primary/30"
                    : "border-border/80 shadow-md hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col items-center w-full">
                  {/* Rotated Diamond Icon Container */}
                  <div
                    className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center rotate-45 transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                        : "bg-card border border-border/80 text-primary group-hover:border-primary/40 group-hover:bg-primary/10"
                    }`}
                  >
                    <div className="-rotate-45 flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <h3
                    className={`text-lg font-bold transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-card-foreground group-hover:text-primary"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Active Step Tag displaying Step Number and Title */}
                <div className="mt-6 w-full flex justify-center">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full transition-all tracking-wide ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground/60 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    Step {step.stepNumber} • {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CALL TO ACTION BUTTON */}
        <div className="mt-14 flex justify-center">
          <button className="px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/25 transition-all duration-200 active:scale-95 text-base flex items-center gap-2">
            <span>Book Service Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
