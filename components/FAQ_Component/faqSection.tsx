/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle, Plus, Minus, Sparkles, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES & DATA
// ============================================================================

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "1",
    question: "How often should I service my AC unit?",
    answer:
      "We recommend servicing your AC at least twice a year to maintain efficiency, prevent sudden breakdowns, and extend its operational lifespan.",
  },
  {
    id: "2",
    question: "What are the signs that my AC needs repair?",
    answer:
      "Common signs include unusual grinding or squeaking noises, weak airflow, warm air coming from vents, or frequent on/off cycling.",
  },
  {
    id: "3",
    question: "Do you service all AC brands and models?",
    answer:
      "Yes, our certified technicians are trained to repair and maintain all major brands and models of residential and commercial AC systems.",
  },
  {
    id: "4",
    question: "Is there any inspection charge?",
    answer:
      "We offer a flat-rate diagnostic fee, which is completely waived if you choose to proceed with the recommended repair services.",
  },
  {
    id: "5",
    question: "Can I book a service online?",
    answer:
      "Absolutely! You can use our instant online booking form above to select a time slot that works best for your schedule.",
  },
  {
    id: "6",
    question: "Will servicing reduce my electricity bill?",
    answer:
      "Yes, a well-maintained AC runs significantly more efficiently, consuming less power and helping lower your monthly energy costs.",
  },
];

// ============================================================================
// MAIN FAQ COMPONENT
// ============================================================================

export default function FaqSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Accordion open item state (Defaults to first item open)
  const [openId, setOpenId] = React.useState<string | null>("1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // --------------------------------------------------------------------------
  // GSAP ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
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

      // Accordion Items Stagger Animation
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
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
      className="relative min-h-[92vh] pt-20 bg-transparent text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary"
    >
      {/* Background Subtle Question Mark Graphic */}
      <div
        aria-hidden="true"
        className="absolute -top-5 left-100 text-[22rem] font-black text-sky-900 select-none pointer-events-none font-serif -rotate-12 z-0"
      >
        ?
      </div>

      <div className="relative z-10 max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* =========================================================================
            HEADER CONTENT
           ========================================================================= */}
        <div ref={headerRef} className="text-center max-w-2xl mb-5 ">
          {/* Tag Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 font-bold text-xs uppercase tracking-widest shadow-sm">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>FAQ</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h2>

          {/* Subheading */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about our emergency repairs, routine
            maintenance, and service guarantees.
          </p>
        </div>

        {/* =========================================================================
            ACCORDION LIST
           ========================================================================= */}
        <div ref={listRef} className="w-full space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-slate-900/90 border-sky-500/50 shadow-lg shadow-sky-500/5"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer select-none outline-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-bold text-base sm:text-lg transition-colors duration-200 ${
                      isOpen ? "text-sky-400" : "text-white"
                    }`}
                  >
                    {item.question}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isOpen
                        ? "bg-sky-400/10 border-sky-400/40 text-sky-400"
                        : "bg-slate-800/80 border-slate-700/80 text-slate-400"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Animated Expandable Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-6 px-5 sm:px-6"
                      : "grid-rows-[0fr] opacity-0 pb-0 px-5 sm:px-6"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2 border-t border-slate-800/60">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative Sparkle Accent */}
        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Have more questions? Our support team is available 24/7.</span>
        </div>
      </div>
    </section>
  );
}
