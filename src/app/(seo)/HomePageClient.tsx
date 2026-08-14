"use client";

import React from "react";
import { Hero } from "@/components/sections/Hero";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { AdvisorSection } from "@/components/sections/AdvisorSection";
import { CaseComponent } from "@/components/sections/CaseComponent";
import { SeoModule } from "@/components/sections/SeoModule";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";
import { SavingsComparisonInteractive } from "@/components/interactive/SavingsComparisonInteractive";
import { SmartExitIntentModal } from "@/components/interactive/SmartExitIntentModal";
import type { ResolvedClaimsMap } from "@/lib/claims/types";

interface HomePageClientProps {
  /** Pre-resolved claims from Neon DB (server-side). null = not approved. */
  claims: ResolvedClaimsMap;
}

export default function HomePageClient({ claims }: HomePageClientProps) {
  return (
    <>
      {/* 01 · Hero with Prequalification Form */}
      <Hero
        title="Revisemos tu situación y conoce tus opciones reales"
        subtitle="Programa de liquidación sin créditos nuevos ni avales."
        ctaText="Revisar mi caso"
        ctaHref="#precalificar"
        resolvedClaims={claims}
        formComponent={
          <div id="precalificar">
            <MultiStepForm />
          </div>
        }
      />

      {/* 02 · Process Section */}
      <ProcessSection />

      {/* 03 · Interactive Savings Comparison */}
      <SavingsComparisonInteractive />

      {/* 04 · Advisor Section */}
      <AdvisorSection />

      {/* 05 · Case Section (inquiry tool) */}
      <CaseComponent />

      {/* 06 · SEO / Educational Module */}
      <SeoModule />

      {/* 07 · FAQ Section */}
      <Faq />

      {/* 08 · Final Decision CTA Section */}
      <FinalCta />

      {/* 09 · Smart Sticky CTA on Mobile */}
      <StickyMobileCta />

      {/* 10 · Smart Exit Intent Recovery Modal */}
      <SmartExitIntentModal />
    </>
  );
}
