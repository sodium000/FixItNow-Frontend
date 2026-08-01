"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  Star,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Send,
  CheckCircle2,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES & DATA
// ============================================================================

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "1",
    name: "Michael Johnson",
    role: "Software Engineer",
    location: "Austin, Texas",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote:
      "Cooltek helped me out when I needed it most. The technician arrived quickly, identified the issue, and fixed my AC within an hour.",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    role: "Architect",
    location: "Dallas, Texas",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      "Extremely professional emergency service! The booking process was seamless, and their 24/7 availability saved our home during the heatwave.",
    rating: 5.0,
  },
  {
    id: "3",
    name: "David Miller",
    role: "Store Manager",
    location: "Houston, Texas",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote:
      "Super responsive team. Honest pricing with zero hidden charges. Highly recommended for any AC repairs and scheduled maintenance.",
    rating: 4.8,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TestimonialsBookingSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const leftColRef = React.useRef<HTMLDivElement>(null);
  const rightFormRef = React.useRef<HTMLDivElement>(null);

  // Active Testimonial State
  const [activeIdx, setActiveIdx] = React.useState<number>(0);
  const activeTestimonial = TESTIMONIALS[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  };

  // --------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Left Testimonial Section Entrance
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
            },
          },
        );
      }

      // 2. Form Column Entrance
      if (rightFormRef.current) {
        gsap.fromTo(
          rightFormRef.current,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
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
      className="relative w-full py-16 text-slate-900 font-sans overflow-hidden"
    >
      <div className="max-w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            MAIN COMBINED CARD (TESTIMONIALS + BOOKING FORM)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[36px] overflow-hidden shadow-2xl border border-slate-800/20">
          {/* -----------------------------------------------------------------------
              LEFT SIDE: DARK TESTIMONIALS SECTION (7 Columns)
             ----------------------------------------------------------------------- */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 relative bg-slate-600 text-slate-100 p-8 sm:p-12 flex flex-col justify-between overflow-hidden"
          >
            {/* Dark Background Overlay Image */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <Image
                src="/"
                alt="AC Technician background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
            </div>

            <div className="relative z-10 space-y-6">
              {/* Tag Header */}
              <div className="inline-flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Testimonials</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Words From Our <br className="hidden sm:inline" /> Customers
              </h2>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
                Trusted customers share real experiences with our fast,
                reliable, and professional air conditioning repair services.
              </p>

              {/* Active Testimonial Box */}
              <div className="pt-4 space-y-6">
                {/* User Info & Avatar Selection Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-sky-400 shadow-md">
                      <Image
                        src={activeTestimonial.avatar}
                        alt={activeTestimonial.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {activeTestimonial.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {activeTestimonial.role}, {activeTestimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Avatars Switcher Thumbnails */}
                  <div className="flex items-center -space-x-2">
                    {TESTIMONIALS.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveIdx(i)}
                        className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-transform duration-200 ${
                          i === activeIdx
                            ? "border-sky-400 scale-110 z-10"
                            : "border-slate-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-slate-200 text-sm sm:text-base italic leading-relaxed min-h-[4.5rem]">
                  "{activeTestimonial.quote}"
                </p>

                {/* Rating Stars & Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(activeTestimonial.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-800 text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Rated {activeTestimonial.rating} Out Of 140 Reviews
                    </span>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white hover:border-sky-400 hover:text-sky-400 transition-all flex items-center justify-center active:scale-95"
                      aria-label="Previous Testimonial"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-white hover:border-sky-400 hover:text-sky-400 transition-all flex items-center justify-center active:scale-95"
                      aria-label="Next Testimonial"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              RIGHT SIDE: BLUE SCHEDULE SERVICE BOOKING FORM (5 Columns)
             ----------------------------------------------------------------------- */}
          <div
            ref={rightFormRef}
            className="lg:col-span-5 bg-gray-700 text-white p-8 sm:p-10 flex flex-col justify-between relative"
          >
            {/* Header / Vertical Title Ribbon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/15 px-3 py-1.5 rounded-xl flex items-center justify-center backdrop-blur-xs">
                <span className="font-bold text-xs tracking-widest uppercase text-white">
                  Schedule a Service
                </span>
              </div>
              <div className="h-px bg-white/20 flex-grow" />
            </div>

            {/* Form Fields */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4 relative z-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full bg-white text-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 border border-transparent transition-all placeholder:text-slate-400"
                />

                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full bg-white text-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 border border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full bg-white text-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 border border-transparent transition-all placeholder:text-slate-400"
                />

                {/* New Customer Dropdown */}
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full bg-white text-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 appearance-none border border-transparent transition-all invalid:text-slate-400"
                    required
                  >
                    <option value="" disabled className="text-slate-400">
                      New Customer?
                    </option>
                    <option value="yes" className="bg-white text-slate-900">
                      Yes
                    </option>
                    <option value="no" className="bg-white text-slate-900">
                      No
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Zip Code */}
                <input
                  type="text"
                  placeholder="Zip Code"
                  required
                  className="w-full bg-white text-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 border border-transparent transition-all placeholder:text-slate-400"
                />

                {/* Service Select */}
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full bg-white text-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 appearance-none border border-transparent transition-all invalid:text-slate-400"
                    required
                  >
                    <option value="" disabled className="text-slate-400">
                      Select Service
                    </option>
                    <option value="repair" className="bg-white text-slate-900">
                      AC Repair
                    </option>
                    <option
                      value="installation"
                      className="bg-white text-slate-900"
                    >
                      AC Installation
                    </option>
                    <option
                      value="maintenance"
                      className="bg-white text-slate-900"
                    >
                      Routine Maintenance
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div>
                <textarea
                  rows={4}
                  placeholder="Write Your Message Here"
                  className="w-full bg-white text-slate-900 rounded-3xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400 border border-transparent transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Submit Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-300 hover:bg-gray-100 text-slate-950 font-extrabold rounded-full shadow-lg transition-all duration-200 active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4 text-slate-950" />
                </button>

                <p className="text-xs text-blue-100 leading-tight max-w-[200px] text-center sm:text-left font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 hidden sm:block" />
                  <span>
                    Our customer support team will contact you within 24 hours.
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
