import * as React from "react";
import type { Metadata } from "next";
import PricingSection from "@/components/subscription/paymentSubscripption";
import FooterSection from "@/components/Footer/FooterSection";

export const metadata: Metadata = {
  title: "Subscription & Pricing Plans | FixItNow",
  description:
    "Choose transparent and affordable home service plans with FixItNow. Upfront quotes with zero hidden fees.",
};

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen pt-24 bg-background text-foreground">
      <PricingSection />
      <FooterSection />
    </main>
  );
}
