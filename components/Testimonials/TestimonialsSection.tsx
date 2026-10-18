"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TESTIMONIALS = [
  {
    id: "1",
    name: "Raisul Islam",
    role: "Homeowner, Gulshan",
    avatar: "RI",
    rating: 5,
    text: "I had my AC serviced by Tanvir through FixItNow and was genuinely impressed. He arrived on time, explained everything clearly, and the AC has been running perfectly for 3 months. Booking took under 5 minutes — I won't go anywhere else for home services.",
    service: "AC Servicing",
    date: "September 2026",
  },
  {
    id: "2",
    name: "Nasrin Khatun",
    role: "Apartment Owner, Banani",
    avatar: "NK",
    rating: 5,
    text: "We had a serious plumbing issue that two other plumbers couldn't fix. Farhana from FixItNow diagnosed it immediately and had it fixed within an hour. The pricing was transparent — no hidden charges. Absolutely recommend FixItNow to anyone in Dhaka.",
    service: "Plumbing Repair",
    date: "October 2026",
  },
  {
    id: "3",
    name: "Tanveer Hossain",
    role: "Tenant, Dhanmondi",
    avatar: "TH",
    rating: 5,
    text: "As a tenant I was nervous about handling electrical issues myself. FixItNow connected me with a certified electrician who upgraded our wiring and installed new outlets. The entire experience — from booking to payment — was seamless. Highly professional platform.",
    service: "Electrical Upgrade",
    date: "August 2026",
  },
  {
    id: "4",
    name: "Layla Rahman",
    role: "Business Owner, Uttara",
    avatar: "LR",
    rating: 5,
    text: "I used FixItNow to arrange painting for our office renovation. The technician was skilled, used quality materials, and finished ahead of schedule. The dashboard made tracking progress easy. This platform is changing how Dhaka handles professional services.",
    service: "Interior Painting",
    date: "July 2026",
  },
  {
    id: "5",
    name: "Mahmud Hasan",
    role: "Family Man, Mirpur",
    avatar: "MH",
    rating: 5,
    text: "Moved apartments last month and used FixItNow's moving service. The team was careful with our furniture, wrapped everything properly, and delivered without a single damage. The price was better than any other quote I got. Outstanding service.",
    service: "Moving Service",
    date: "September 2026",
  },
  {
    id: "6",
    name: "Sumi Begum",
    role: "Property Manager, Bashundhara",
    avatar: "SB",
    rating: 4,
    text: "Managing multiple properties means I need reliable service partners. FixItNow has become my go-to platform. The rating system keeps technicians accountable and the booking history in the dashboard makes managing multiple jobs effortless.",
    service: "Multiple Services",
    date: "October 2026",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const visibleCount = 3;
  const totalGroups = Math.ceil(TESTIMONIALS.length / visibleCount);

  const goTo = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const next = (idx + totalGroups) % totalGroups;
    
    if (cardsRef.current) {
      gsap.to(cardsRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setActiveIdx(next);
          setIsAnimating(false);
          if (cardsRef.current) {
            gsap.fromTo(
              cardsRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
          }
        },
      });
    } else {
      setActiveIdx(next);
      setIsAnimating(false);
    }
  };

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentTestimonials = TESTIMONIALS.slice(
    activeIdx * visibleCount,
    activeIdx * visibleCount + visibleCount
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Heading */}
      <div ref={headingRef} className="mb-14 flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
          <span className="text-xs font-semibold text-primary">Customer Stories</span>
        </div>
        <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
          Trusted by thousands of <br className="hidden sm:block" />
          <span className="text-primary">homeowners across Bangladesh</span>
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          Real experiences from real customers. Our platform's reputation is built one 
          successful service at a time.
        </p>
        {/* Overall rating */}
        <div className="mt-2 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm">
          <StarRating rating={5} />
          <span className="text-sm font-bold text-foreground">4.9</span>
          <span className="text-xs text-muted-foreground">from 2,400+ reviews</span>
        </div>
      </div>

      {/* Testimonial Cards */}
      <div ref={cardsRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentTestimonials.map((t) => (
          <article
            key={t.id}
            className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-1"
          >
            {/* Quote Icon */}
            <Quote className="h-6 w-6 text-primary/30" />

            {/* Review Text */}
            <blockquote className="flex-1">
              <p className="text-sm leading-7 text-muted-foreground line-clamp-5">
                &ldquo;{t.text}&rdquo;
              </p>
            </blockquote>

            {/* Rating */}
            <StarRating rating={t.rating} />

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary shrink-0">
                {t.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate">{t.role}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {t.service}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation Dots + Arrows */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          id="testimonials-prev"
          onClick={() => goTo(activeIdx - 1)}
          disabled={isAnimating}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalGroups }).map((_, i) => (
            <button
              key={i}
              id={`testimonial-dot-${i}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIdx ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to testimonial group ${i + 1}`}
            />
          ))}
        </div>

        <button
          id="testimonials-next"
          onClick={() => goTo(activeIdx + 1)}
          disabled={isAnimating}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-40"
          aria-label="Next testimonials"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
