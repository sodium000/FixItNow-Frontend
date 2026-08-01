"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Zap, Wrench, Banknote, type LucideIcon } from "lucide-react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES & DATA
// ============================================================================

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const TRUST_FEATURES: readonly FeatureItem[] = [
  {
    id: "experts",
    title: "Certified Experts",
    description:
      "Skilled technicians with verified background checks & HVAC certifications.",
    icon: ShieldCheck,
  },
  {
    id: "quick-response",
    title: "Quick Response",
    description:
      "Fast doorstep service delivered within a few hours of booking.",
    icon: Zap,
  },
  {
    id: "tools",
    title: "Advanced Tools",
    description:
      "Modern diagnostic equipment ensures accurate and lasting repairs.",
    icon: Wrench,
  },
  {
    id: "pricing",
    title: "Affordable Pricing",
    description:
      "Transparent, upfront pricing with guaranteed zero hidden charges.",
    icon: Banknote,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WhyUsSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const heroShowcaseRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const bottomBarRef = React.useRef<HTMLDivElement>(null);

  // --------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER ENTRANCE ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 40, opacity: 0 },
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

      // 2. Left Hero Showcase Card Slide-In
      if (heroShowcaseRef.current) {
        gsap.fromTo(
          heroShowcaseRef.current,
          { x: -50, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heroShowcaseRef.current,
              start: "top 80%",
            },
          },
        );
      }

      // 3. Right Bento Benefit Cards Stagger
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 85%",
            },
          },
        );
      }

      // 4. Bottom CTA Bar Fade In
      if (bottomBarRef.current) {
        gsap.fromTo(
          bottomBarRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bottomBarRef.current,
              start: "top 90%",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --------------------------------------------------------------------------
  // GSAP 3D TILT EFFECT FOR BENTO CARDS
  // --------------------------------------------------------------------------
  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotateX: -y * 0.08,
      rotateY: x * 0.08,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleCardMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  // --------------------------------------------------------------------------
  // GSAP IMAGE PARALLAX HOVER
  // --------------------------------------------------------------------------
  const handleHeroMouseEnter = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.08,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  };

  const handleHeroMouseLeave = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] pt-10 pb-16 lg:pt-10 lg:pb-24 overflow-hidden bg-transparent flex items-center"
    >
      {/* =========================================================================
          SECTION CONTENT
         ========================================================================= */}
      <div className="relative z-10 max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div
          ref={headerRef}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">handyman</span>
            <span>Why Choose Us</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Why Homeowners Trust Us
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We don’t just repair ACs—we ensure comfort, reliability, and
            long-term performance for your home or office.
          </p>
        </div>

        {/* HERO SHOWCASE & BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT FEATURED IMAGE HERO SHOWCASE */}
          <div
            ref={heroShowcaseRef}
            onMouseEnter={handleHeroMouseEnter}
            onMouseLeave={handleHeroMouseLeave}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-border/80 bg-card/80 backdrop-blur-md shadow-xl cursor-pointer group"
          >
            <div className="relative h-95 sm:h-120 w-full overflow-hidden">
              <Image
                ref={imageRef}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAv2H0-xI9Yaqkhxk0hBiiNtCi239aDNnhs0TbUL3yvQBq90j2akvFrjruUu84kJm_U5-niyKj5ZIlhsWhL7k-ohb9grUzKj4LKASQ6nPao4OoRmtPByN7FJ1XxB0W4_Qojt04GpufoKKoCcvgplSOy2MyxEa7cEKNKq3EAULR-_RV96L8MAAx3uGe1WVkC7gZm4dPRCoetJmOby8otNQiRmDazBgpWd1DOaK6zUpbGl9H_io6WUjJ"
                alt="HVAC Technician working on an outdoor AC unit"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
            </div>

            {/* Bottom floating tag */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
               
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    100% Guaranteed
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Quality repairs & authentic parts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT BENTO BENEFIT CARDS */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRUST_FEATURES.map((feature, idx) => (
              <div
                key={feature.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={() => handleCardMouseLeave(idx)}
                className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border/80 shadow-md hover:shadow-xl hover:border-primary/40 transition-shadow duration-300 flex flex-col justify-between group cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <span className="material-symbols-outlined text-2xl">
                      <feature.icon className="w-6 h-6" />
                    </span>

                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
