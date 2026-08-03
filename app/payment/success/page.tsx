"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Home, Calendar, ShieldCheck, Sparkles } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center pt-24 pb-16 px-4 font-sans overflow-hidden">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px] z-0"
      />

      <div className="max-w-md w-full bg-card/90 border border-border/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Payment Successful
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Booking Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Thank you for your payment. Your booking has been successfully processed and assigned to your technician.
          </p>
        </div>

        <div className="p-4 bg-muted/40 border border-border/60 rounded-2xl text-left text-xs space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Guaranteed Service & Support</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            You can track the status of your booking anytime from your customer dashboard.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/dashboard/customer"
            className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Go to My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs rounded-xl border border-border transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
