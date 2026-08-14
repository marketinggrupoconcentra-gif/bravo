import React from "react";
import { SeoHeader } from "@/components/layout/SeoHeader";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/interactive/MobileCtaBar";

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SeoHeader />
      <main className="flex-grow pb-[72px] lg:pb-0">{children}</main>
      <Footer />
      {/* Sticky mobile CTA bar — only visible on mobile, hidden on lg+ */}
      <MobileCtaBar />
    </div>
  );
}
