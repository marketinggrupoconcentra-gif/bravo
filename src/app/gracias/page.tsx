import React from "react";
import { SeoHeader } from "@/components/layout/SeoHeader";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { ThankYouTracker } from "./ThankYouTracker";
import { PersonalizedGracias } from "./PersonalizedGracias";

export const metadata: Metadata = {
  robots: {
    index: false,
  },
  title: "Solicitud Recibida | Bravo México",
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1EEF3]">
      <ThankYouTracker />
      <SeoHeader />
      <main className="flex-grow flex items-center justify-center py-12 sm:py-16 px-4">
        <PersonalizedGracias />
      </main>
      <Footer />
    </div>
  );
}
