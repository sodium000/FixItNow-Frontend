"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";

// ============================================================================
// TYPES & DATA
// ============================================================================

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  badge?: string;
  price?: string;
}

const PRIMARY_SERVICES: readonly ServiceItem[] = [
  {
    id: "installation",
    title: "Professional AC Installation",
    description:
      "Precision setup for split, multi-split, window, and central HVAC systems. Handled by licensed technicians to ensure maximum energy efficiency and longevity.",
    icon: "install_desktop",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU5MMbMWuF0pPVplBLXYEy2J07PbIxyeGkrluJyc_AkWXqZMW7Mj31Z8zUvtCMxHAHVd9dalOPCxVqmKEIT7Z8j3QLy_tgNkqooRk5mEJit7eMz0XdS6z1blZruL0wL5dsFSVmLDdNGMxIvd1aYbrI-SUvs54QBitS5aHrs0xwo3GdJT4O42dX_pE07tgAhzX5WxsnDlK8uhFGgPrptH92-E-4gqOslEYRUV83tjr_iVaOeK7jkQwbGA",
    badge: "Most Requested",
    price: "Starts at $89",
  },
  {
    id: "maintenance",
    title: "Routine AC Servicing",
    description:
      "Regular deep cleaning and tune-ups prevent costly breakdowns, lower monthly electric bills, and keep air quality fresh.",
    icon: "cleaning_services",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAV4T2WaRiXWzR6u8ClYkz7WsCQWtpE36RcMM2uP3kVg_grYU942DqE8bLDVi5s-Cg56KxSPwfzNHmdjYYDmFzGXdNHuU7Pk01NEmMYxLfJW7wVZGQC4Fqpxgyfw25BvFkyovsTtLJYzdb9sw2Iiy2h5PPatn2MK3sAIT6FdlLdrVMxl4byy0hSoNQdKZFQDpjDiU5kU_8R-TntnY5PQY_B_63Mf64rGeMfnWaJ7eCEFn4Dby_qqesa9Q",
    badge: "Preventative Care",
  },
];

const SECONDARY_SERVICES: readonly ServiceItem[] = [
  {
    id: "repair",
    title: "Emergency AC Repair",
    description:
      "Same-day diagnosis and quick fix for cooling failures, water leakage, strange noises, and electrical faults.",
    icon: "handyman",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_3syKpCD9Cauh0WuhwHLuD2JfP5ofkwUUotX3B6G4IDi0cXVoI0iQP6ZsZyJoqttFoAQIC5YnYFIU4nnBzIZq-PzAK7Zhbwxom__v8PC--dIo5KjvzSpJ6M0jkqB3yd30eD5pS77WX6tHBzbfYrv-xD-o44ZbtkEWVwMxkWlIkWcKYK8pl8jHSrLO5Hpj6eV64mUsb4FHDw3ceuHDrxZroi5uPXkmQezwr8Prs0bosLEJuVjd_B4tPg",
  },
  {
    id: "gas-refill",
    title: "Refrigerant & Gas Charging",
    description:
      "Certified leak detection and eco-friendly gas top-ups (R32, R410A) to restore icy cold air production safely.",
    icon: "mode_fan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXVL9dbRrBrKO7c_KiX79jK_niYSZu3ts-TjmoeoyDoo3f-4uURTBNtaIOlDFqN3WYPBk18js2_BoCZ5mJqM1eFhhUGrtUGVrZeco5SgJ_gbvrdh0wu2K72JMIHk8U2ulmnBhujZCQIsrOePLHWHhbaeZ8Rgrxy_p99Mp-KApTMbNhTf_wZp452u4xxqOE7FYqyiBuhKb7MHA-C3DCttKKECXT5NyTWMWb90KXvD2sM8lMe_oy-yoB4Q",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ServicesGrid() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const heroRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  // GSAP Entrance Animations
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heroRef.current) {
        tl.fromTo(
          heroRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        );
      }

      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        tl.fromTo(
          validCards,
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12 },
          "-=0.3",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-transparent text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary"
    >
      {/* =========================================================================
          MAIN CANVAS CONTENT
         ========================================================================= */}
      <main className="relative z-10 pt-20 pb-32 max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO BANNER SECTION */}
        <section
          ref={heroRef}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide uppercase border border-primary/20 backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">build</span>
            <span>Trusted HVAC Experts</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Professional Air Conditioning Solutions
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We deliver reliable, fast, and certified AC services to keep your
            home cool, energy-efficient, and comfortable all year round.
          </p>
        </section>

        {/* SERVICES BENTO GRID */}
        <section id="services" className="space-y-6">
          {/* PRIMARY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Card 1: Installation */}
            <div
              ref={(el) => {
                cardsRef.current[0] = el;
              }}
              className="lg:col-span-7 bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-border"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-3 rounded-2xl bg-primary/10 text-primary font-bold border border-primary/20"></span>
                  {PRIMARY_SERVICES[0].badge && (
                    <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/60">
                      {PRIMARY_SERVICES[0].badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {PRIMARY_SERVICES[0].title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mt-2 leading-relaxed">
                    {PRIMARY_SERVICES[0].description}
                  </p>
                </div>
              </div>

            <div className="relative rounded-2xl overflow-hidden h-90 w-full mt-6 border border-border/50 bg-muted/30">
                  <Image
                  src={PRIMARY_SERVICES[0].image}
                  alt={PRIMARY_SERVICES[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
            </div>

            {/* Card 2: Maintenance Call-To-Action */}
            <div
              ref={(el) => {
                cardsRef.current[1] = el;
              }}
              className="lg:col-span-5 bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:border-border"
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-3 rounded-2xl bg-primary/10 text-primary font-bold backdrop-blur-sm border border-primary/20">
                    <span className="material-symbols-outlined text-2xl"></span>
                  </span>
                  {PRIMARY_SERVICES[1].badge && (
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {PRIMARY_SERVICES[1].badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {PRIMARY_SERVICES[1].title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mt-2 leading-relaxed">
                    {PRIMARY_SERVICES[1].description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-6 mt-6">
                <div className="relative rounded-2xl overflow-hidden h-90 w-full border border-border/50">
                  <Image
                    src={PRIMARY_SERVICES[1].image}
                    alt={PRIMARY_SERVICES[1].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECONDARY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECONDARY_SERVICES.map((service, idx) => (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[2 + idx] = el;
                }}
                className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-border"
              >
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-2xl bg-primary/10 text-primary font-bold border border-primary/20">
                    <span className="material-symbols-outlined text-2xl">
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden h-90 w-full mt-6 border border-border/50 bg-muted/30">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
