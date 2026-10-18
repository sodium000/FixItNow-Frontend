import HeroBanner from "@/components/Banner/banner";
import BookingGuidanceSection from "@/components/BookingSection/BookingGuidanceSection";
import EmergencyHeroSection from "@/components/Emergency/Emergency";
import FaqSection from "@/components/FAQ_Component/faqSection";
import RepairProcessSection from "@/components/repairProcess/repairProcess";
import ServicesGrid from "@/components/serviceSection/ServicesGrid";
import PricingSection from "@/components/subscription/paymentSubscripption";
import WhyUsSection from "@/components/WhyusSection/whyussection";
import FooterSection from "@/components/Footer/FooterSection";
import TestimonialsSection from "@/components/Testimonials/TestimonialsSection";
import StatsSection from "@/components/StatsSection/StatsSection";
import NewsletterSection from "@/components/Newsletter/NewsletterSection";
import FeaturedTechniciansSection from "@/components/FeaturedTechnicians/FeaturedTechniciansSection";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FixItNow | Trusted Home Services in Bangladesh",
  description:
    "Find trusted local home-service professionals, compare services, and book help for repairs and maintenance. Plumbing, electrical, AC servicing and more in Dhaka.",
};

export default function Home() {
  return (
    <div className="relative min-h-[92vh] overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/4 -translate-x-1/2 h-125 w-175 rounded-full bg-primary/25 blur-[120px] z-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 h-100 w-100 rounded-full bg-primary/20 blur-[110px] z-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/40 to-transparent z-0"
      />

      <div className="relative z-10">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Services Grid */}
        <ServicesGrid />

        {/* 3. Why Us Section */}
        <WhyUsSection></WhyUsSection>

        {/* 4. Stats / Social Proof */}
        <StatsSection />

        {/* 5. Featured Technicians */}
        <FeaturedTechniciansSection />

        {/* 6. Repair Process */}
        <RepairProcessSection></RepairProcessSection>

        {/* 7. Testimonials */}
        <TestimonialsSection />

        {/* 8. Pricing / Subscription */}
        <PricingSection></PricingSection>

        {/* 9. Emergency Section */}
        <EmergencyHeroSection></EmergencyHeroSection>

        {/* 10. Booking Guidance */}
        <BookingGuidanceSection />

        {/* 11. Newsletter */}
        <NewsletterSection />

        {/* 12. CTA Banner */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-3xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to take care of your home?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
                Browse available services, compare local professionals, and
                choose the help that fits your needs.
              </p>
            </div>
            <Link
              href="/service"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
            >
              Explore services
            </Link>
          </div>
        </section>

        {/* 13. Help Hub */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-3 sm:p-8">
            <div className="sm:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Need a hand?
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">
                Find answers before or after you book.
              </h2>
            </div>
            <Link href="/support" className="rounded-2xl bg-muted/60 p-4 transition hover:bg-muted">
              <span className="font-semibold text-foreground">Help &amp; support</span>
              <span className="mt-1 block text-sm text-muted-foreground">Get guidance about services and bookings.</span>
            </Link>
            <Link href="/contact" className="rounded-2xl bg-muted/60 p-4 transition hover:bg-muted">
              <span className="font-semibold text-foreground">Contact FixItNow</span>
              <span className="mt-1 block text-sm text-muted-foreground">Reach the team with a question.</span>
            </Link>
            <Link href="/blog" className="rounded-2xl bg-muted/60 p-4 transition hover:bg-muted">
              <span className="font-semibold text-foreground">Expert Blog</span>
              <span className="mt-1 block text-sm text-muted-foreground">Read guides, tips, and home maintenance advice.</span>
            </Link>
          </div>
        </section>

        {/* 14. FAQ */}
        <FaqSection></FaqSection>

        {/* Footer */}
        <FooterSection></FooterSection>
      </div>
    </div>
  );
}
