import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  MessageCircle,
  ShieldCheck,
  Search,
  HelpCircle,
  Wrench,
  CreditCard,
  User,
  Star,
  ChevronDown,
  Phone,
  Mail,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help choosing a service, managing a booking, or preparing for a home-service visit.",
};

const SUPPORT_CATEGORIES = [
  {
    icon: CalendarCheck2,
    title: "Booking & Scheduling",
    description:
      "How to book a service, reschedule, or cancel an appointment. Manage upcoming bookings from your dashboard.",
    links: [
      { label: "How do I book a service?", href: "#booking-faq" },
      { label: "Can I reschedule my booking?", href: "#booking-faq" },
      { label: "How do I cancel?", href: "#booking-faq" },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description:
      "Understanding pricing, payment methods, invoices, and refunds for home service bookings.",
    links: [
      { label: "What payment methods are accepted?", href: "#payment-faq" },
      { label: "How do I get a refund?", href: "#payment-faq" },
      { label: "Are there hidden fees?", href: "#payment-faq" },
    ],
  },
  {
    icon: Wrench,
    title: "Service & Technicians",
    description:
      "Questions about available services, technician credentials, verification, and how to choose the right professional.",
    links: [
      { label: "How are technicians vetted?", href: "#service-faq" },
      { label: "What services are available?", href: "/service" },
      { label: "What if I'm unhappy with service?", href: "#service-faq" },
    ],
  },
  {
    icon: User,
    title: "Account & Profile",
    description:
      "Manage your account settings, update your profile, reset passwords, and control notification preferences.",
    links: [
      { label: "How do I reset my password?", href: "#account-faq" },
      { label: "How do I update my profile?", href: "/dashboard" },
      { label: "How do I delete my account?", href: "#account-faq" },
    ],
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description:
      "How to leave a review, how ratings work, and the FixItNow review moderation policy.",
    links: [
      { label: "How do I leave a review?", href: "#review-faq" },
      { label: "Can I edit a review?", href: "#review-faq" },
      { label: "How does the rating system work?", href: "#review-faq" },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Safety & Trust",
    description:
      "Our safety guarantee, background check process, and what to do in case of an emergency or safety concern.",
    links: [
      { label: "What is the FixItNow guarantee?", href: "#safety-faq" },
      { label: "How do I report a safety issue?", href: "/contact" },
      { label: "Emergency protocol", href: "#safety-faq" },
    ],
  },
];

const FAQS: { id: string; q: string; a: string }[] = [
  {
    id: "booking-faq",
    q: "How do I book a service?",
    a: "Browse the Services page, select the service you need, choose a technician, and click Book. You'll be asked to provide your address, preferred time, and any relevant notes. Confirm your booking — you'll receive a confirmation email immediately.",
  },
  {
    id: "booking-faq-2",
    q: "Can I reschedule or cancel a booking?",
    a: "Yes. Log in to your dashboard and go to My Bookings. Cancellations made more than 24 hours before the scheduled time are fully refunded. Within 24 hours, a cancellation fee may apply.",
  },
  {
    id: "payment-faq",
    q: "What payment methods are accepted?",
    a: "We accept bKash, Nagad, debit/credit cards (Visa, Mastercard), and bank transfers. Payment is processed securely at the time of booking confirmation.",
  },
  {
    id: "service-faq",
    q: "How are technicians vetted?",
    a: "Every technician on FixItNow goes through a multi-step verification process: identity verification, skills assessment, reference checks, and background screening. Verified badges appear on profiles that have passed all checks.",
  },
  {
    id: "service-faq-2",
    q: "What if I'm not satisfied with the service?",
    a: "Contact our support team within 48 hours of the service. We'll investigate and work to resolve the issue — this may include a partial or full refund, or re-service at no charge.",
  },
  {
    id: "account-faq",
    q: "How do I reset my password?",
    a: "On the login page, click 'Forget password?' and enter your email. You'll receive a password reset link within 5 minutes. Check your spam folder if it doesn't arrive.",
  },
  {
    id: "review-faq",
    q: "How do I leave a review?",
    a: "After a booking is marked Complete, you'll find a 'Leave Review' button in your dashboard under My Bookings. You can rate from 1–5 stars and add a written comment.",
  },
  {
    id: "safety-faq",
    q: "What is the FixItNow guarantee?",
    a: "Every booking is backed by our service guarantee. If the work is unsatisfactory and the technician doesn't fix it, we'll arrange a re-service or issue a refund — no questions asked. Property damage claims up to ৳50,000 are also covered.",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background pt-32 pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(120,119,198,0.08),transparent)]"
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Help Centre</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How can we help you?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Find answers about services, bookings, payments, and your account. 
            Can&apos;t find what you need? Our team is here to help.
          </p>

          {/* Search Box */}
          <div className="mt-8 relative mx-auto max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="support-search"
              type="search"
              placeholder="Search help articles..."
              className="h-12 w-full rounded-2xl border border-input bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Support Categories Grid */}
        <section aria-labelledby="categories-heading" className="mb-16">
          <h2 id="categories-heading" className="sr-only">Support Categories</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{cat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {cat.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* FAQ Section */}
          <section className="lg:col-span-2" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="mb-8 text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details
                  key={faq.id}
                  id={faq.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-foreground hover:bg-accent transition-colors list-none">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-border px-5 pb-5 pt-4">
                    <p className="text-sm leading-7 text-muted-foreground">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact Options */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-bold text-foreground">Still need help?</h2>
              <div className="space-y-3">
                <a
                  href="mailto:support@fixitnow.com"
                  className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Email Support</p>
                    <p className="text-[11px] text-muted-foreground">Replies within 24 hours</p>
                  </div>
                </a>
                <a
                  href="tel:+8801815152634"
                  className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Phone Support</p>
                    <p className="text-[11px] text-muted-foreground">Mon–Sat, 8AM–8PM</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">AI Assistant</p>
                    <p className="text-[11px] text-muted-foreground">Available 24/7 in the chat bubble</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-destructive">Emergency Notice</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    For immediate safety concerns — gas leaks, electrical hazards, or flooding — 
                    leave the area immediately and call emergency services (999).
                  </p>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-bold text-foreground">Useful Resources</h3>
              <div className="space-y-2">
                {[
                  { label: "Browse Services", href: "/service", icon: Wrench },
                  { label: "Book a Service", href: "/service", icon: CalendarCheck2 },
                  { label: "Expert Blog & Tips", href: "/blog", icon: BookOpen },
                  { label: "Contact FixItNow", href: "/contact", icon: Mail },
                  { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
                  { label: "Terms of Service", href: "/terms", icon: ArrowRight },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
