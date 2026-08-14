import React from "react";
import { PerformanceHeader } from "@/components/layout/PerformanceHeader";
import { Footer } from "@/components/layout/Footer";

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PerformanceHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
