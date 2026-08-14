"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";
import { getValidatedClaim } from "@/config/claims";
import { useCms } from "@/context/CmsContext";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaId?: string;
  placement?: string;
  formComponent?: ReactNode;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  ctaId = "hero_cta",
  placement = "hero",
  formComponent,
}: HeroProps) {
  const { getSection } = useCms();
  const cms = getSection("home_hero");

  const finalTitle = title || cms.title || "Una alternativa real para resolver tus deudas sin poner en riesgo tu patrimonio";
  const finalSubtitle = subtitle || cms.subtitle || "Analizamos tu caso y diseñamos un plan de ahorro a tu medida para negociar descuentos directos con tus acreedores.";
  const finalCtaText = ctaText || cms.primaryCtaText || "Revisar mi caso";
  const finalCtaHref = ctaHref || cms.primaryCtaUrl || "/formulario";

  const expYears = getValidatedClaim("experience-years", "+15");
  const debtsLiq = getValidatedClaim("debts-liquidated", "+350 mil");
  const countries = getValidatedClaim("countries-operating", "6");
  const credits = getValidatedClaim("credits-placed", "+50 mil");
  const minDebtClaim = getValidatedClaim(
    "minimum-debt",
    "Deudas desde $50,000 MXN · sin consulta al buró en este paso"
  );

  const bgStyleClass =
    cms.backgroundStyle === "dark-purple"
      ? "bg-[#2E1739] text-white"
      : cms.backgroundStyle === "aurora-glow"
      ? "bg-gradient-to-b from-[#FAF8FB] via-[#F5EFF8] to-[#FAF8FB]"
      : cms.backgroundStyle === "pure-white"
      ? "bg-[#FFFFFF]"
      : cms.backgroundStyle === "light-offwhite"
      ? "bg-[#FAF8FB]"
      : "bg-[#FBF8FC]";

  // Dynamic Button Styling
  const btnRadiusClass =
    cms.buttonBorderRadius === "lg"
      ? "rounded-2xl"
      : cms.buttonBorderRadius === "sm"
      ? "rounded-lg"
      : cms.buttonBorderRadius === "none"
      ? "rounded-none"
      : "rounded-full";

  const primaryBtnClass =
    cms.buttonStyle === "cyan-glow"
      ? `bg-[#5ECBDB] hover:bg-[#45B6C6] text-[#17131F] font-extrabold shadow-[0_4px_20px_rgba(94,203,219,0.35)] px-[32px] h-[52px] inline-flex items-center justify-center transition-all ${btnRadiusClass}`
      : cms.buttonStyle === "emerald-success"
      ? `bg-[#157A5A] hover:bg-[#106247] text-white font-extrabold shadow-sm px-[32px] h-[52px] inline-flex items-center justify-center transition-all ${btnRadiusClass}`
      : cms.buttonStyle === "glass-border"
      ? `bg-white/90 hover:bg-white text-[#5B2C72] border-2 border-[#5B2C72] font-extrabold shadow-xs px-[32px] h-[52px] inline-flex items-center justify-center transition-all ${btnRadiusClass}`
      : cms.buttonStyle === "minimal-white"
      ? `bg-white hover:bg-[#F5EDF9] text-[#17131F] border border-[#C9C1D4] font-extrabold shadow-xs px-[32px] h-[52px] inline-flex items-center justify-center transition-all ${btnRadiusClass}`
      : `bravo-btn-primary shadow-sm ${btnRadiusClass}`;

  const secondaryBtnClass = `bravo-btn-secondary bg-white/80 backdrop-blur-xs ${btnRadiusClass}`;

  const showGlows = cms.animationConfig?.glowEnabled !== false;

  return (
    <section
      data-cms-section="home_hero"
      className={`w-full relative overflow-hidden border-b border-[#E7E3EC] transition-colors duration-300 ${bgStyleClass}`}
      id="hero-section"
      style={cms.customColors?.backgroundColor ? { backgroundColor: cms.customColors.backgroundColor } : undefined}
    >
      {/* =====================================================================
          FULL-BLEED HERO BACKGROUND PHOTOGRAPHY (MIRRORED / MODO ESPEJO)
          ===================================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Desktop Viewport - Mirrored */}
        <div className="hidden sm:block absolute inset-0 w-full h-full">
          <Image
            src="/images/brand/human/bravo-hero-human-desktop.webp"
            alt="Persona organizando sus notas y finanzas en casa"
            fill
            priority
            quality={90}
            className="object-cover scale-x-[-1] object-[15%_25%] lg:object-[18%_20%]"
            sizes="100vw"
          />
        </div>

        {/* Mobile Viewport - Mirrored */}
        <div className="sm:hidden absolute inset-0 w-full h-full">
          <Image
            src="/images/brand/human/bravo-hero-human-mobile.webp"
            alt="Persona organizando sus notas y finanzas en casa"
            fill
            priority
            quality={85}
            className="object-cover scale-x-[-1] object-[25%_15%]"
            sizes="100vw"
          />
        </div>

        {/* Balanced Editorial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FBF8FC]/85 via-[#FBF8FC]/70 to-[#FBF8FC]/95 lg:from-[#FBF8FC]/82 lg:via-[#FBF8FC]/65 lg:to-[#FBF8FC]/95" />

        {/* Ambient Top Glows */}
        {showGlows && (
          <>
            <div
              className="absolute -top-[100px] left-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[90px]"
              style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
            />
            <div
              className="absolute -top-[80px] right-0 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[90px]"
              style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)" }}
            />
          </>
        )}

        {/* Bottom Smooth Blend into Section Divider */}
        <div className="absolute inset-x-0 bottom-0 h-[80px] bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/60 to-transparent" />
      </div>

      {/* Main Container Content */}
      <div className="bravo-container py-[48px] md:py-[56px] lg:py-[64px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-[40px] lg:gap-[48px] items-start">
          {/* Left Column: Message + CTA + Metrics */}
          <div className="flex flex-col gap-[22px]">
            {/* Eligibility Badge */}
            <div
              data-cms-field="badge"
              className="inline-flex self-start items-center gap-[9px] bg-[#E9F8FA]/95 border border-[#BEE7ED] text-[#16606B] text-[13px] font-bold h-[36px] px-[16px] rounded-full shadow-2xs backdrop-blur-xs transition-all duration-300"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-[#1E8A9B]" />
              <span>{cms.badge || minDebtClaim}</span>
            </div>

            {/* Headline H1 */}
            <h1
              data-cms-field="title"
              className="text-[38px] sm:text-[48px] lg:text-[62px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#17131F] max-w-[600px] text-balance m-0 transition-all duration-300"
              style={{
                fontFamily: "var(--font-figtree), sans-serif",
                color: cms.customColors?.textColor || undefined,
              }}
            >
              {finalTitle}
            </h1>

            {/* Supporting Copy */}
            <p
              data-cms-field="subtitle"
              className="text-[17px] md:text-[18px] lg:text-[19px] leading-[1.6] text-[#3A3344] max-w-[560px] m-0 transition-all duration-300"
              style={cms.customColors?.textColor ? { color: cms.customColors.textColor, opacity: 0.85 } : undefined}
            >
              {finalSubtitle}
            </p>

            {/* CTA Row with High Contrast */}
            <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center pt-1">
              <Link
                href={finalCtaHref}
                id="hero-primary-cta"
                data-cms-field="primaryCta"
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_id: ctaId,
                    placement: placement,
                  })
                }
                className={`${primaryBtnClass} transition-all duration-300`}
                style={cms.customColors?.primaryColor ? { backgroundColor: cms.customColors.primaryColor } : undefined}
              >
                {finalCtaText}
              </Link>
              <Link
                href={cms.secondaryCtaUrl || "/como-funciona"}
                data-cms-field="secondaryCta"
                className={`${secondaryBtnClass} transition-all duration-300`}
              >
                {cms.secondaryCtaText || "Conocer cómo funciona"}
              </Link>
            </div>

            {/* =================================================================
                METRICS CARD (4 Columns with Clean Dividers & No Line Wrapping)
                ================================================================= */}
            <div className="relative mt-[10px] pt-[8px]">
              <div className="bg-white/95 backdrop-blur-md border border-[#E7E3EC] rounded-[16px] shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE5EF]">
                  {/* Col 1 */}
                  <div className="p-[14px] sm:p-[16px] flex flex-col justify-center">
                    <div className="text-[24px] sm:text-[26px] xl:text-[30px] font-extrabold tracking-[-0.025em] text-[#5B2C72] whitespace-nowrap leading-none">
                      {expYears}
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] text-[#5B5266] leading-tight mt-1.5 font-medium">
                      años de experiencia
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="p-[14px] sm:p-[16px] flex flex-col justify-center">
                    <div className="text-[24px] sm:text-[26px] xl:text-[30px] font-extrabold tracking-[-0.025em] text-[#5B2C72] whitespace-nowrap leading-none">
                      {debtsLiq}
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] text-[#5B5266] leading-tight mt-1.5 font-medium">
                      deudas liquidadas
                    </div>
                  </div>

                  {/* Col 3 */}
                  <div className="p-[14px] sm:p-[16px] flex flex-col justify-center">
                    <div className="text-[24px] sm:text-[26px] xl:text-[30px] font-extrabold tracking-[-0.025em] text-[#5B2C72] whitespace-nowrap leading-none">
                      {countries}
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] text-[#5B5266] leading-tight mt-1.5 font-medium">
                      países de operación
                    </div>
                  </div>

                  {/* Col 4 */}
                  <div className="p-[14px] sm:p-[16px] flex flex-col justify-center">
                    <div className="text-[24px] sm:text-[26px] xl:text-[30px] font-extrabold tracking-[-0.025em] text-[#5B2C72] whitespace-nowrap leading-none">
                      {credits}
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] text-[#5B5266] leading-tight mt-1.5 font-medium">
                      créditos colocados
                    </div>
                  </div>
                </div>
              </div>

              {/* High Contrast Legible Footnote */}
              <div className="font-mono text-[11.5px] text-[#5B5266] tracking-[0.01em] pt-2 px-1">
                Cifras institucionales sujetas a actualización
              </div>
            </div>
          </div>

          {/* Right Column: Prequalification Form Card */}
          {formComponent && (
            <div className="w-full lg:sticky lg:top-[96px] z-20">
              {formComponent}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
