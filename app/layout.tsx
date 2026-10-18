import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";
import QueryProvider from "@/lib/QueryProvider";
import { Toaster } from "react-hot-toast";
import ServiceAssistant from "@/components/assistant/ServiceAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FixItNow | Trusted Home Services",
    template: "%s | FixItNow",
  },
  description:
    "Find trusted local home-service professionals, compare services, and book help for repairs and maintenance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="" suppressHydrationWarning>
        <Toaster position="top-right" />
        <QueryProvider>
          <Navbar></Navbar>
          {children}
          <ServiceAssistant />
        </QueryProvider>
      </body>
    </html>
  );
}
