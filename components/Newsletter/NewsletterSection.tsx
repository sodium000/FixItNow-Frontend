"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Sparkles, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BENEFITS = [
  "Weekly expert home maintenance tips",
  "Exclusive subscriber-only discounts",
  "Early access to new services",
  "Seasonal home care checklists",
];

export default function NewsletterSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Subscribing...");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    toast.success("You're subscribed! Check your inbox for a welcome email. 🎉", {
      id: toastId,
    });
    setIsSubscribed(true);
    setIsSubmitting(false);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div
        ref={sectionRef}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12"
      >
        {/* Background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 left-8 h-48 w-48 rounded-full bg-blue-500/5 blur-[60px]"
        />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left: Content */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Newsletter</span>
            </div>
            <h2
              id="newsletter-heading"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Expert home tips,{" "}
              <span className="text-primary">straight to your inbox</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Join 2,400+ homeowners getting weekly maintenance guides, seasonal checklists,
              and exclusive discounts on FixItNow services.
            </p>

            <ul className="mt-6 space-y-2.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div>
            {isSubscribed ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-card/80 p-10 text-center backdrop-blur-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">You&apos;re subscribed!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Welcome to the FixItNow community. Your first newsletter arrives this Friday.
                </p>
                <a
                  href="/blog"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Browse our blog <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card/80 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
                <p className="mb-2 text-lg font-bold text-foreground">Subscribe for free</p>
                <p className="mb-6 text-sm text-muted-foreground">
                  No spam — ever. Unsubscribe with one click at any time.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email address"
                      className={`h-12 w-full rounded-xl border px-4 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                        error ? "border-destructive" : "border-input"
                      }`}
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p role="alert" className="text-xs text-destructive">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    id="newsletter-subscribe-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Subscribe — It&apos;s Free
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-muted-foreground">
                  By subscribing, you agree to our{" "}
                  <a href="/privacy" className="underline hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
