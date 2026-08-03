"use client";

import * as React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center pt-24 pb-16 px-4 font-sans overflow-hidden">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px] z-0"
      />

      <div className="max-w-md w-full bg-card/90 border border-border/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            Payment Cancelled
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Transaction Not Completed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your payment was cancelled or was not completed. No charges were made to your account.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/service"
            className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Booking Again</span>
          </Link>
          <Link
            href="/dashboard/customer"
            className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs rounded-xl border border-border transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
