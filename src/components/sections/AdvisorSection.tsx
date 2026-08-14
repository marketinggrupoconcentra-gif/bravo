"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";
import {
  AdvisorSupportIcon,
  ReviewCaseIcon,
  NegotiationIcon,
} from "@/components/icons/bravo";
import { useCms } from "@/context/CmsContext";

export function AdvisorSection() {
  const { getSection } = useCms();
  const cms = getSection("home_advisor");

  const bgStyleClass =
    cms.backgroundStyle === "dark-purple"
      ? "bg-[#2E1739] text-white"
      : cms.backgroundStyle === "pure-white"
      ? "bg-[#FFFFFF]"
      : cms.backgroundStyle === "light-offwhite"
      ? "bg-[#FAF8FB]"
      : "bg-gradient-to-b from-[#FAF8FB] via-[#F5EFF8] to-[#FAF8FB]";

  return (
    <section
      id="advisor-section"
      data-cms-section="home_advisor"
      className={`py-[76px] lg:py-[112px] border-b border-[#E7E3EC] relative overflow-hidden transition-colors duration-300 ${bgStyleClass}`}
    >
      {/* =====================================================================
          DYNAMIC CRAFTED MOTION BACKGROUND: SECURITY, TRANQUILITY & CARE
          ===================================================================== */}
      {/* 1. Multi-Spectrum Luminous Aurora Glow Orbs */}
      <div
        className="pointer-events-none absolute -top-[140px] -left-[120px] w-[620px] h-[620px] rounded-full opacity-[0.09] blur-[120px] animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-[30%] -right-[100px] w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[130px] animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, #157A5A 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[120px] left-[25%] w-[680px] h-[680px] rounded-full opacity-[0.10] blur-[130px] animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)",
          animationDelay: "6s",
        }}
      />

      {/* 2. Precision Micro-Dot Matrix Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#5B2C72 1.2px, transparent 1.2px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 45%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 45%, transparent 85%)",
        }}
      />

      {/* 3. Layer 1: Floating Harmonic Protection Waves (Primary Wave Flow) */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.13] animate-wave-float"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-60 220 C 300 120, 580 440, 940 310 C 1220 200, 1380 340, 1540 260"
          stroke="url(#advisorWaveGrad1)"
          strokeWidth="3"
        />
        <path
          d="M-80 380 C 260 520, 620 240, 980 390 C 1260 480, 1420 310, 1560 360"
          stroke="url(#advisorWaveGrad2)"
          strokeWidth="2.5"
          strokeDasharray="8 10"
        />
        <defs>
          <linearGradient id="advisorWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B2C72" />
            <stop offset="40%" stopColor="#157A5A" />
            <stop offset="100%" stopColor="#5ECBDB" />
          </linearGradient>
          <linearGradient id="advisorWaveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5ECBDB" />
            <stop offset="60%" stopColor="#5B2C72" />
            <stop offset="100%" stopColor="#157A5A" />
          </linearGradient>
        </defs>
      </svg>

      {/* 4. Layer 2: Slow Ambient Counter-Current Waves (Deep Peace & Balance) */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.09] animate-wave-float-reverse"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 720 C 340 580, 720 840, 1080 660 C 1320 540, 1460 640, 1580 580"
          stroke="url(#advisorWaveGrad3)"
          strokeWidth="2.2"
        />
        <defs>
          <linearGradient id="advisorWaveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#157A5A" />
            <stop offset="50%" stopColor="#5B2C72" />
            <stop offset="100%" stopColor="#5ECBDB" />
          </linearGradient>
        </defs>
      </svg>

      {/* 5. Layer 3: Concentric Harmonic Trust Circles (Water Ripple / Safety Aura) */}
      <div className="pointer-events-none absolute -bottom-[200px] -right-[150px] w-[500px] h-[500px] opacity-[0.06] animate-pulse">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="200" cy="200" r="180" stroke="#5B2C72" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="140" stroke="#157A5A" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="100" stroke="#5ECBDB" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="60" stroke="#5B2C72" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="bravo-container relative z-10">
        {/* Open Organic Split Layout (No rigid enclosing box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[36px] lg:gap-[56px] xl:gap-[72px] items-center">
          {/* ===================================================================
              LEFT COLUMN (5 cols): Photo with Floating Glass Trust Badge
              =================================================================== */}
          <div className="lg:col-span-5 relative group reveal-fade-left">
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] lg:aspect-[4/5] w-full min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] border border-[#E7E3EC] shadow-xl">
              <Image
                src="/images/brand/human/bravo-advisor-human.webp"
                alt="Asesora de Bravo conversando con clientes para resolver su situación financiera"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                style={{ objectPosition: "50% 35%" }}
              />

              {/* Floating Glassmorphic Trust Badge */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/92 backdrop-blur-md border border-white/80 rounded-[20px] p-4 shadow-lg flex items-center gap-3.5">
                <div className="w-[44px] h-[44px] rounded-full bg-[#5B2C72] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14.5px] font-extrabold text-[#17131F] leading-tight">
                    Acompañamiento humano
                  </span>
                  <span className="text-[12.5px] text-[#5B5266]">
                    Sin algoritmos impersonales que decidan por ti.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN (7 cols): Editorial Content & 3 Glass Cards
              =================================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-[24px] reveal-fade-right">
            <div
              data-cms-field="badge"
              className="inline-flex self-start items-center gap-[8px] bg-[#5B2C72]/10 border border-[#5B2C72]/20 text-[#5B2C72] text-[12.5px] font-mono font-bold uppercase tracking-wider px-[14px] py-[6px] rounded-full shadow-2xs backdrop-blur-xs transition-all duration-300"
            >
              <span>{cms.badge || "Asesoría personalizada y cercana"}</span>
            </div>

            <h2
              data-cms-field="title"
              className="m-0 text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.035em] leading-[1.06] text-[#17131F] transition-all duration-300"
            >
              {cms.title || "Tu situación tiene su propio contexto."}
            </h2>

            <p
              data-cms-field="subtitle"
              className="m-0 text-[16.5px] sm:text-[18px] leading-[1.65] text-[#3A3344] max-w-[620px] transition-all duration-300"
            >
              {cms.subtitle || "Por eso una persona revisa tu caso antes de explicarte qué alternativas aplican y qué implica cada una. Nuestros asesores conocen la dinámica con los acreedores y su objetivo es acompañarte para estructurar una salida viable y recuperar tu tranquilidad."}
            </p>

            {/* 3 Floating Glass Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] pt-1">
              <div className="bg-white/85 backdrop-blur-md border border-[#E7E3EC] rounded-[18px] p-[18px] flex flex-col gap-2 shadow-xs hover:border-[#5B2C72] hover:shadow-md hover:-translate-y-0.5 transition-all reveal-init stagger-1">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72]">
                  <AdvisorSupportIcon size={18} />
                </div>
                <div className="text-[15px] font-bold text-[#17131F]">Atención 1 a 1</div>
                <span className="text-[13px] text-[#5B5266] leading-snug">
                  Un asesor asignado te guía durante todo tu proceso.
                </span>
              </div>

              <div className="bg-white/85 backdrop-blur-md border border-[#E7E3EC] rounded-[18px] p-[18px] flex flex-col gap-2 shadow-xs hover:border-[#157A5A] hover:shadow-md hover:-translate-y-0.5 transition-all reveal-init stagger-2">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F1FAF6] border border-[#C6E6D9] flex items-center justify-center shrink-0 text-[#157A5A]">
                  <ReviewCaseIcon size={18} />
                </div>
                <div className="text-[15px] font-bold text-[#17131F]">Diagnóstico claro</div>
                <span className="text-[13px] text-[#5B5266] leading-snug">
                  Evaluación inicial sin costo ni consulta previa al buró.
                </span>
              </div>

              <div className="bg-white/85 backdrop-blur-md border border-[#E7E3EC] rounded-[18px] p-[18px] flex flex-col gap-2 shadow-xs hover:border-[#1E8A9B] hover:shadow-md hover:-translate-y-0.5 transition-all reveal-init stagger-3">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#E9F8FA] border border-[#BEE7ED] flex items-center justify-center shrink-0 text-[#1E8A9B]">
                  <NegotiationIcon size={18} />
                </div>
                <div className="text-[15px] font-bold text-[#17131F]">Negociación y acompañamiento</div>
                <span className="text-[13px] text-[#5B5266] leading-snug">
                  Negociación directa con la institución financiera para explorar las condiciones del convenio.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={cms.primaryCtaUrl || "/formulario"}
                data-cms-field="primaryCta"
                onClick={() =>
                  trackEvent("cta_click", {
                    cta_id: "advisor_cta",
                    placement: "advisor_section",
                  })
                }
                className="bravo-btn-primary shadow-md transition-all duration-300"
              >
                {cms.primaryCtaText || "Hablar con un asesor"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
