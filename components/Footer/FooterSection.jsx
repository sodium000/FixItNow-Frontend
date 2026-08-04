/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Send,
  Phone,
  MapPin,
  Sparkles,
  SendHorizontal,
  Flame,
  CheckCircle2,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function FooterSection() {
  const containerRef = React.useRef(null);
  const ctaCardRef = React.useRef(null);
  const techImgRef = React.useRef(null);
  const footerContentRef = React.useRef(null);

  // --------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER & FLOATING ANIMATIONS
  // --------------------------------------------------------------------------
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. CTA Card Entrance
      if (ctaCardRef.current) {
        gsap.fromTo(
          ctaCardRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaCardRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 2. Floating Technician Graphic Animation
      if (techImgRef.current) {
        gsap.to(techImgRef.current, {
          y: -10,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "easeInOut",
        });
      }

      // 3. Footer Links & Sections Entrance
      if (footerContentRef.current) {
        gsap.fromTo(
          footerContentRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerContentRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full font-sans bg-slate-950">
      {/* =========================================================================
          TOP CTA SUBSCRIPTION BANNER (OVERLAPPING FOOTER)
         ========================================================================= */}
      <section className="relative max-w-7xl mx-auto mt-1 px-4 pt-2 sm:px-6 lg:px-8 z-20 -mb-24 sm:-mb-28">
        <div
          ref={ctaCardRef}
          className="relative bg-linear-to-r from-gray-500 via-gray-600 to-gray-800 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 text-white shadow-2xl border border-blue-400/30 overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-300 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Stay Comfortable Always</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Stay Cool with Fast, Reliable AC Service Today
              </h2>

              <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                No more discomfort in the heat. Get quick, professional AC
                repairs and enjoy a comfortable space without delays or stress.
              </p>

              {/* Form */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="pt-2 max-w-md mx-auto lg:mx-0"
              >
                <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-lg">
                  <div className="pl-4 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm py-2 px-3 outline-none border-none focus:ring-0"
                  />
                  <button
                    type="submit"
                    className="bg-gray-500 hover:bg-gray-400 text-slate-950 font-extrabold px-6 py-3 rounded-full text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shrink-0 shadow-md"
                  >
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Graphic/Illustration Container */}
            <div
              ref={techImgRef}
              className="lg:col-span-5 flex justify-center lg:justify-end relative"
            >
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-blue-500/30 border-4 border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl overflow-hidden">
                <Image
                  src="/footer.avif"
                  alt="Technician Expert"
                  fill
                  sizes="(max-width: 640px) 14rem, 16rem"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-blue-900/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN FOOTER SECTION
         ========================================================================= */}
      <footer className="relative bg-slate-950 text-slate-300 pt-36 sm:pt-40 pb-12 border-t border-slate-800/60">
        <div
          ref={footerContentRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand Column (4 Columns) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
                  <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
                </div>
                <span className="text-2xl font-extrabold italic tracking-tight text-white">
                  Fix It Now
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                We deliver fast, reliable, and affordable AC repair and maintenance
                services for year-round comfort across residential and commercial spaces.
              </p>

              {/* Social Icons (generic) */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-sky-400 flex items-center justify-center transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-sky-400 flex items-center justify-center transition-all duration-200"
                  aria-label="Message"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-400 hover:text-sky-400 flex items-center justify-center transition-all duration-200"
                  aria-label="Share"
                >
                  <SendHorizontal className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links (2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Why Choose Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services (3 Columns) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide">
                Our Services
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Emergency AC Repair
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    AC Installation & Setup
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Preventative Maintenance
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Duct Cleaning & Inspection
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Commercial HVAC Care
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information (3 Columns) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide">
                Contact Information
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300">uixmonks@gmail.com</span>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300">+880 1815-152634</span>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 leading-relaxed">
                    123 Cooling Street, New York, NY 10001
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} CoolFix. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-sky-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-800">|</span>
              <Link href="#" className="hover:text-sky-400 transition-colors">
                Terms of Service
              </Link>
              <span className="text-slate-800">|</span>
              <Link href="#" className="hover:text-sky-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}