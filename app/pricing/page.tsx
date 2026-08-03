import * as React from "react";
import type { Metadata } from "next";
import PricingSection from "@/components/subscription/paymentSubscripption";
import FooterSection from "@/components/Footer/FooterSection";

export const metadata: Metadata = {
  title: "Pricing Plans | FixItNow",
  description:
    "Explore transparent home repair & service subscription plans with FixItNow.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-24 bg-background text-foreground">
      <PricingSection />
      <FooterSection />
    </main>
  );
}
