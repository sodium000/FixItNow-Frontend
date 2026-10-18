import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock, Eye, UserCheck, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how FixItNow collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    icon: Database,
    content: [
      {
        subtitle: "Account Information",
        text: "When you register on FixItNow, we collect your name, email address, phone number, and password. Technician profiles additionally include your experience, service area, and verification documents.",
      },
      {
        subtitle: "Booking & Transaction Data",
        text: "We collect information about the services you book, including service type, scheduled date, address, and payment details. Payment card data is processed and stored by our payment provider — FixItNow does not store full card numbers.",
      },
      {
        subtitle: "Usage Data",
        text: "We collect information about how you use our platform, including pages visited, search queries, and interactions with service listings. This data helps us improve the platform experience.",
      },
      {
        subtitle: "Device & Log Data",
        text: "We automatically collect your IP address, browser type, operating system, and referring URLs when you access FixItNow. This is standard for all web services and is used for security and analytics purposes.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    icon: Eye,
    content: [
      {
        subtitle: "Service Delivery",
        text: "We use your information to match you with appropriate technicians, process bookings, send confirmation emails and SMS notifications, and facilitate communication between customers and service providers.",
      },
      {
        subtitle: "Platform Improvement",
        text: "Usage data helps us understand how people use FixItNow, identify popular services, and improve search and recommendation features — including our AI-powered service suggestions.",
      },
      {
        subtitle: "Safety & Security",
        text: "We use account and transaction data to detect fraud, verify technician credentials, and maintain platform safety. Suspicious activity may be reviewed by our trust and safety team.",
      },
      {
        subtitle: "Marketing Communications",
        text: "With your consent, we may send promotional emails about new services, platform features, or special offers. You can unsubscribe at any time via the link in any marketing email.",
      },
    ],
  },
  {
    id: "information-sharing",
    title: "3. Information Sharing",
    icon: UserCheck,
    content: [
      {
        subtitle: "Service Providers",
        text: "We share necessary booking information with technicians who accept your service request, including your name, service address, and booking details. Technicians are bound by our Service Provider Agreement.",
      },
      {
        subtitle: "Payment Processors",
        text: "Payment information is shared with our payment processing partners (such as SSLCommerz or bKash) solely for the purpose of completing transactions.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information when required by law, court order, or government authority, or when necessary to protect the rights, property, or safety of FixItNow, our users, or the public.",
      },
      {
        subtitle: "No Sale of Personal Data",
        text: "FixItNow does not sell, rent, or trade your personal information to third parties for their own marketing purposes. Your data is used exclusively for platform operations.",
      },
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    icon: Lock,
    content: [
      {
        subtitle: "Technical Measures",
        text: "We use industry-standard encryption (TLS/SSL) for all data in transit, and store sensitive data in encrypted form at rest. Access to production databases is strictly controlled and logged.",
      },
      {
        subtitle: "Access Controls",
        text: "Employee access to user data is limited to those who need it to perform their job functions. All access is logged and subject to regular audits.",
      },
      {
        subtitle: "Incident Response",
        text: "In the event of a data breach, we will notify affected users within 72 hours of discovery, in compliance with applicable data protection laws.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    icon: ShieldCheck,
    content: [
      {
        subtitle: "Access & Correction",
        text: "You can view and update your personal information at any time through your dashboard Profile page. For data you cannot edit directly, contact our support team.",
      },
      {
        subtitle: "Data Deletion",
        text: "You may request deletion of your account and associated personal data by contacting support@fixitnow.com. Some data may be retained for legal compliance purposes for up to 7 years.",
      },
      {
        subtitle: "Data Portability",
        text: "You may request an export of your personal data in a machine-readable format. We will fulfill portability requests within 30 days.",
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of marketing communications at any time. You can also disable non-essential cookies through your browser settings, though this may affect some platform features.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Legal & Privacy</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Your privacy is important to us. This policy explains what data we collect, how we use it,
            and your rights regarding your personal information.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Last updated: October 18, 2026 · Effective: October 18, 2026
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-bold text-foreground">Contents</h2>
              <nav className="space-y-2">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="block rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  6. Contact & Questions
                </a>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Intro Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-7 text-muted-foreground">
                This Privacy Policy applies to FixItNow (operated by FixItNow Technologies Ltd.), 
                covering our website, mobile applications, and all related services. By using FixItNow, 
                you agree to the collection and use of information in accordance with this policy. 
                We comply with applicable Bangladeshi data protection regulations and industry standards.
              </p>
            </div>

            {/* Policy Sections */}
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                  </div>
                  <div className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-border bg-card p-5"
                      >
                        <h3 className="mb-2 text-sm font-semibold text-foreground">
                          {item.subtitle}
                        </h3>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Cookies & Tracking</h2>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  FixItNow uses cookies and similar tracking technologies to maintain your session, 
                  remember your preferences, and analyze platform usage. Essential cookies are required 
                  for the platform to function. Analytics and marketing cookies can be disabled through 
                  your browser settings or our cookie preference center (available via the footer).
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="scroll-mt-24">
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <ShieldCheck className="mb-4 h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  6. Questions About Privacy?
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  If you have any questions about this Privacy Policy, or would like to exercise 
                  your data rights, please contact our Data Protection Officer:
                </p>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Email:</span>{" "}
                    <a href="mailto:privacy@fixitnow.com" className="text-primary hover:underline">
                      privacy@fixitnow.com
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Address:</span>{" "}
                    FixItNow Technologies Ltd., Gulshan-2, Dhaka 1212, Bangladesh
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Response Time:</span>{" "}
                    We respond to all privacy requests within 30 days.
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
                    href="/terms"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
