import React from "react";
import { SeoHeader } from "@/components/layout/SeoHeader";
import { Footer } from "@/components/layout/Footer";

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SeoHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
