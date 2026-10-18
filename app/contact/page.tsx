"use client";

import * as React from "react";
import type { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  MessageCircle,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@fixitnow.com",
    subvalue: "Replies within 24 hours",
    href: "mailto:support@fixitnow.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1815-152634",
    subvalue: "Mon–Sat, 8AM–8PM",
    href: "tel:+8801815152634",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Gulshan-2, Dhaka 1212",
    subvalue: "Bangladesh",
    href: "#",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Sat, 8AM–8PM",
    subvalue: "Emergency: 24/7 hotline",
    href: "#",
  },
];

const CATEGORIES = [
  "Booking & Scheduling",
  "Service Quality",
  "Payment & Billing",
  "Account & Profile",
  "Technician Inquiry",
  "Partnership & Business",
  "Other",
];

const FAQS = [
  {
    q: "How quickly will I hear back?",
    a: "Email inquiries are answered within 24 hours. Phone support is available Mon–Sat, 8AM–8PM.",
  },
  {
    q: "What's the fastest way to get help?",
    a: "Use our AI assistant (bottom-right corner) for immediate guidance on common questions.",
  },
  {
    q: "Can I change or cancel my booking?",
    a: "Yes — log in to your dashboard and use the Bookings section to manage upcoming appointments.",
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    const toastId = toast.loading("Sending your message...");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Message sent! We'll get back to you within 24 hours.", { id: toastId });
    setIsSubmitted(true);
    reset();
  };

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
            <HeadphonesIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Get in Touch</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            We're here to{" "}
            <span className="text-primary">help</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Have a question about a booking, service quality, or your account? 
            Reach out and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">{item.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.subvalue}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Message sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    Thank you for reaching out. Our team will respond within 24 hours.
                  </p>
                  <button
                    id="contact-send-another"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 rounded-xl bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your full name"
                        {...register("name", { required: "Name is required" })}
                        className={`h-11 w-full rounded-xl border px-4 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                          errors.name ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="your@email.com"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email",
                          },
                        })}
                        className={`h-11 w-full rounded-xl border px-4 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                          errors.email ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="text-xs font-semibold text-foreground">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+880 17xx-xxxxxx"
                        {...register("phone", {
                          pattern: {
                            value: /^[+\d\s()-]{7,20}$/,
                            message: "Enter a valid phone number",
                          },
                        })}
                        className={`h-11 w-full rounded-xl border px-4 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                          errors.phone ? "border-destructive" : "border-input"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-category" className="text-xs font-semibold text-foreground">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="contact-category"
                        {...register("category", { required: "Please select a category" })}
                        className={`h-11 w-full rounded-xl border px-4 text-sm bg-background text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                          errors.category ? "border-destructive" : "border-input"
                        }`}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a topic</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-xs text-destructive">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="Brief summary of your question"
                      {...register("subject", {
                        required: "Subject is required",
                        minLength: { value: 5, message: "Subject must be at least 5 characters" },
                      })}
                      className={`h-11 w-full rounded-xl border px-4 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                        errors.subject ? "border-destructive" : "border-input"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Please describe your question or issue in detail..."
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 20, message: "Message must be at least 20 characters" },
                        maxLength: { value: 1000, message: "Message cannot exceed 1000 characters" },
                      })}
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                        errors.message ? "border-destructive" : "border-input"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-2">
            {/* Quick Help */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Quick Answers</h2>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold text-foreground">{faq.q}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Resources */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-bold text-foreground">Support Resources</h2>
              <div className="space-y-3">
                {[
                  { label: "Help & Support Center", href: "/support" },
                  { label: "Browse Services", href: "/service" },
                  { label: "Manage Bookings", href: "/dashboard" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
              <p className="text-xs font-semibold text-destructive">⚠ Emergency?</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                For immediate safety concerns (gas leak, electrical hazard, flooding), 
                leave the area and call emergency services immediately.
              </p>
              <a
                href="tel:999"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                Call 999 (Emergency)
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
