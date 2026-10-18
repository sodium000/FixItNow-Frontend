import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  CreditCard,
  Star,
  ArrowRight,
  Users,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read FixItNow's Terms of Service. Understand your rights and obligations as a platform user.",
};

const TERMS_SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: FileText,
    content: `By accessing or using FixItNow (the "Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use the Platform. We reserve the right to update these terms at any time, and continued use of the Platform after any change constitutes acceptance of the new terms.

These terms apply to all users of the Platform, including customers who book services, technicians who provide services, and visitors who browse without an account.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility & Registration",
    icon: Users,
    content: `You must be at least 18 years of age to create an account and use FixItNow. By creating an account, you represent that all information you provide is accurate, current, and complete.

You are responsible for maintaining the confidentiality of your account credentials. You may not share your account with others or transfer your account to another person. FixItNow reserves the right to suspend or terminate accounts that are shared, transferred, or used in violation of these terms.

Technicians must complete our verification process before offering services. False credentials or misrepresentation of qualifications will result in immediate account termination.`,
  },
  {
    id: "services",
    title: "3. Platform Services",
    icon: Wrench,
    content: `FixItNow is a marketplace platform that connects customers with independent home-service technicians. FixItNow does not itself provide home services — we provide technology infrastructure to facilitate connections between customers and service providers.

Technicians on FixItNow are independent contractors, not employees of FixItNow. FixItNow does not control the manner or means by which technicians perform their services.

While we verify technician credentials and collect customer reviews, FixItNow cannot guarantee the quality, safety, legality, or any other aspect of the services provided by technicians. Customers should review technician profiles, ratings, and reviews before booking.`,
  },
  {
    id: "bookings-payments",
    title: "4. Bookings & Payments",
    icon: CreditCard,
    content: `When you book a service through FixItNow, you enter into a service agreement directly with the technician. FixItNow processes payments on behalf of technicians as a payment intermediary.

Payment is due at the time of booking confirmation. Prices listed on service pages are estimates; final pricing will be confirmed between you and the technician before work begins.

Cancellations made more than 24 hours before a scheduled service may receive a full refund. Cancellations made within 24 hours may be subject to a cancellation fee. No-shows (customer absent at service time) are generally non-refundable.

Disputes regarding service quality should first be raised directly with the technician. If unresolved, FixItNow's Customer Success team can mediate. FixItNow's liability in any booking dispute is limited to the amount paid for that booking.`,
  },
  {
    id: "reviews",
    title: "5. Reviews & Ratings",
    icon: Star,
    content: `Customers may submit reviews and ratings for completed bookings. Reviews must be honest, accurate, and based on genuine experiences. We prohibit fake, incentivized, or retaliatory reviews.

FixItNow reserves the right to remove reviews that violate our community guidelines, including reviews containing hate speech, personal attacks, or content unrelated to the service experience.

Technicians may not offer incentives for positive reviews or retaliate against customers for negative reviews. Violations may result in account suspension.`,
  },
  {
    id: "prohibited-conduct",
    title: "6. Prohibited Conduct",
    icon: AlertTriangle,
    content: `You agree not to:

• Use the Platform for any unlawful purpose or in violation of any regulations.
• Harass, threaten, or abuse other users, technicians, or FixItNow staff.
• Attempt to circumvent the Platform by arranging direct payment to technicians outside of FixItNow after meeting through the Platform.
• Post false, misleading, or fraudulent information, reviews, or listings.
• Attempt to reverse-engineer, scrape, or disrupt the Platform's systems.
• Create multiple accounts for fraudulent purposes.
• Share your login credentials with others.

Violations of these terms may result in immediate account suspension or termination without refund.`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    icon: Lock,
    content: `All content on FixItNow — including text, images, logos, software, and design — is the property of FixItNow Technologies Ltd. or its licensors, and is protected by copyright, trademark, and other intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from the Platform without our express written permission.

By submitting content to FixItNow (such as reviews, photos, or profile information), you grant FixItNow a non-exclusive, royalty-free license to use, display, and distribute that content on the Platform.`,
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    icon: ShieldCheck,
    content: `To the maximum extent permitted by law, FixItNow and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or services booked through it.

FixItNow's total liability to you for any claim arising from these Terms or your use of the Platform shall not exceed the greater of (a) the total amount you paid to FixItNow in the 12 months preceding the claim, or (b) ৳5,000.

This limitation applies even if FixItNow has been advised of the possibility of such damages.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Legal</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Please read these terms carefully before using FixItNow. By using our platform,
            you agree to the following terms and conditions.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Last updated: October 18, 2026 · Effective: October 18, 2026
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-bold text-foreground">Quick Navigation</h2>
              <nav className="space-y-2">
                {TERMS_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
                <a
                  href="#governing-law"
                  className="block rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  9. Governing Law
                </a>
              </nav>
              <div className="mt-6 border-t border-border pt-4">
                <Link
                  href="/privacy"
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  Privacy Policy
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Intro Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-7 text-muted-foreground">
                These Terms of Service ("Terms") govern your use of the FixItNow platform, operated by 
                FixItNow Technologies Ltd. ("FixItNow," "we," "our," or "us"), headquartered in 
                Dhaka, Bangladesh. These Terms constitute a legally binding agreement between you and FixItNow.
              </p>
            </div>

            {/* Terms Sections */}
            {TERMS_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border border-border bg-card p-6"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-foreground">{section.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {section.content.split("\n\n").map((para, idx) => (
                      <p key={idx} className="text-sm leading-7 text-muted-foreground whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-base font-bold text-foreground">9. Governing Law & Disputes</h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                These Terms are governed by and construed in accordance with the laws of Bangladesh, without 
                regard to its conflict of law principles. Any dispute arising from these Terms or your use of 
                FixItNow shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Before initiating legal proceedings, both parties agree to attempt good-faith resolution 
                through FixItNow's dispute resolution process, which can be initiated by contacting 
                legal@fixitnow.com.
              </p>
            </section>

            {/* Contact CTA */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <FileText className="mb-4 h-8 w-8 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Questions About These Terms?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Email:</span>{" "}
                  <a href="mailto:legal@fixitnow.com" className="text-primary hover:underline">
                    legal@fixitnow.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Address:</span>{" "}
                  FixItNow Technologies Ltd., Gulshan-2, Dhaka 1212, Bangladesh
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
