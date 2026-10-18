/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle, Plus, Minus, Sparkles } from "lucide-react";

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

  const [openId, setOpenId] = React.useState<string | null>("1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // GSAP — use CSS class selectors to avoid React DevTools warnings
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-heading-child",
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
        }
      );

      gsap.fromTo(
        ".faq-item",
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
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-transparent text-foreground overflow-hidden"
      aria-labelledby="faq-section-heading"
    >
      {/* Background glow blobs to match overall aesthetic */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-primary/10 blur-[100px] z-0"
      />

      {/* Decorative background "?" — purely visual, clipped, theme-aware */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-10 -right-8 text-[18rem] font-black leading-none text-primary/5 dark:text-primary/5 font-serif rotate-12 z-0"
      >
        ?
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* HEADER */}
        <div ref={headerRef} className="text-center max-w-2xl mb-10">
          <div className="faq-heading-child inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>

          <h2
            id="faq-section-heading"
            className="faq-heading-child text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
          >
            Frequently Asked Questions
          </h2>

          <p className="faq-heading-child mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            Everything you need to know about our emergency repairs, routine
            maintenance, and service guarantees.
          </p>
        </div>

        {/* ACCORDION LIST */}
        <div ref={listRef} className="w-full space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`faq-item rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-primary/5 border-primary/30 shadow-sm backdrop-blur-sm"
                    : "bg-card/80 backdrop-blur-sm border-border hover:border-primary/20 hover:bg-card"
                }`}
              >
                {/* Question button — align-start keeps icon at TOP of row even when text wraps */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 sm:p-6 flex items-start justify-between gap-4 text-left cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span
                    className={`font-semibold text-sm sm:text-base leading-relaxed transition-colors duration-200 ${
                      isOpen ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* Plus/Minus icon — shrink-0 prevents it from squishing */}
                  <div
                    className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 ${
                      isOpen
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Answer — CSS grid transition for smooth open/close */}
                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-5 px-5 sm:px-6 pt-1 border-t border-border">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground font-medium bg-card/80 backdrop-blur-sm border border-border px-4 py-2.5 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-primary animate-pulse shrink-0" />
          <span>Have more questions? Our support team is available 24/7.</span>
        </div>
      </div>
    </section>
  );
}
