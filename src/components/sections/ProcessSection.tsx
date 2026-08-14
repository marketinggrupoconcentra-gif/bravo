"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DataPurposeIcon,
  DataAccessIcon,
  DataProtectionIcon,
  DataDeletionIcon,
  ReviewCaseIcon,
  CostClarityIcon,
  AdvisorSupportIcon,
  NegotiationIcon,
  NoHistoryDeletionIcon,
  NoPasswordIcon,
  NoFakeGuaranteeIcon,
} from "@/components/icons/bravo";
import { useCms } from "@/context/CmsContext";

export function ProcessSection() {
  const { getSection } = useCms();
  const cms = getSection("home_process");
  return (
    <section
      id="como-funciona"
      data-cms-section="home_process"
      className="py-[64px] lg:py-[96px] bg-[#F1EEF3] border-b border-[#E7E3EC] relative overflow-hidden"
    >
      {/* =====================================================================
          DYNAMIC BACKGROUND WITH SOFT UNDULATING WAVES & AMBIENT MOTION
          ===================================================================== */}
      {/* Ambient Pulsing Glow Orbs */}
      <div
        className="pointer-events-none absolute -top-[120px] -left-[100px] w-[600px] h-[600px] rounded-full opacity-[0.09] blur-[110px] animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[100px] -right-[100px] w-[650px] h-[650px] rounded-full opacity-[0.11] blur-[120px] animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />

      {/* Subtle Dot Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#5B2C72 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)",
        }}
      />

      {/* Wave Layer 1: Soft Undulating Curved Wave (Floating Animation) */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.10] animate-wave-float"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-80 320 C 280 480, 520 180, 880 260 C 1180 330, 1340 160, 1540 220"
          stroke="url(#waveGrad1)"
          strokeWidth="3.5"
          strokeDasharray="8 10"
        />
        <path
          d="M-60 480 C 320 620, 600 360, 960 420 C 1240 470, 1400 320, 1560 380"
          stroke="url(#waveGrad2)"
          strokeWidth="2.5"
        />
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B2C72" />
            <stop offset="50%" stopColor="#AB6CCA" />
            <stop offset="100%" stopColor="#5ECBDB" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5ECBDB" />
            <stop offset="60%" stopColor="#5B2C72" />
            <stop offset="100%" stopColor="#AB6CCA" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wave Layer 2: Secondary Counter-Flow Waves (Slow Ambient Drift) */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.08] animate-wave-float-reverse"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 680 C 360 520, 680 780, 1020 600 C 1280 480, 1420 590, 1580 530"
          stroke="url(#waveGrad3)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="waveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#5B2C72" />
            <stop offset="50%" stopColor="#5ECBDB" />
            <stop offset="100%" stopColor="#AB6CCA" />
          </linearGradient>
        </defs>
      </svg>

      <div className="bravo-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-stretch">
          {/* ===================================================================
              LEFT COLUMN (7 cols): Contained Dark Process Card (#2E1739)
              WITH DYNAMIC AMBIENT MOTION & MESH DRIFT INSIDE PURPLE CARD
              =================================================================== */}
          <div className="lg:col-span-7 bg-[#2E1739] text-[#EFE7F4] rounded-[24px] p-[32px] sm:p-[40px] lg:p-[46px] flex flex-col justify-between shadow-xl relative overflow-hidden border border-[#4A3A57]/60 reveal-fade-left">
            {/* Dynamic Mesh Orb 1 (Cyan flow) */}
            <div
              className="pointer-events-none absolute -bottom-[120px] -right-[120px] w-[380px] h-[380px] rounded-full opacity-35 blur-[80px] animate-mesh-drift"
              style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)" }}
            />

            {/* Dynamic Mesh Orb 2 (Violet / Light Magenta flow) */}
            <div
              className="pointer-events-none absolute -top-[100px] -left-[100px] w-[340px] h-[340px] rounded-full opacity-30 blur-[90px] animate-mesh-drift-reverse"
              style={{ background: "radial-gradient(circle, #AB6CCA 0%, transparent 70%)" }}
            />

            {/* Dynamic Flowing Energy Curve inside Purple Card */}
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full opacity-15 animate-wave-float"
              viewBox="0 0 800 700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M-50 480 C 220 560, 480 220, 850 380"
                stroke="url(#cardEnergyGrad)"
                strokeWidth="3.5"
                strokeDasharray="6 8"
              />
              <defs>
                <linearGradient id="cardEnergyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5ECBDB" />
                  <stop offset="60%" stopColor="#AB6CCA" />
                  <stop offset="100%" stopColor="#5ECBDB" />
                </linearGradient>
              </defs>
            </svg>

            <div className="flex flex-col gap-[26px] relative z-10">
              {/* Header */}
              <div className="flex flex-col gap-2">
                <div
                  data-cms-field="badge"
                  className="inline-flex self-start items-center gap-2 bg-[#5ECBDB]/20 border border-[#5ECBDB]/40 text-[#5ECBDB] text-[12px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-2xs backdrop-blur-xs transition-all duration-300"
                >
                  {cms.badge || "PASO A PASO"}
                </div>
                <h2
                  data-cms-field="title"
                  className="m-0 text-[32px] sm:text-[36px] lg:text-[40px] font-extrabold tracking-[-0.025em] text-white leading-tight transition-all duration-300"
                >
                  {cms.title || "Cómo funciona el programa"}
                </h2>
                <p
                  data-cms-field="subtitle"
                  className="text-[15.5px] text-[#C7B8D2] m-0 max-w-[540px] leading-relaxed transition-all duration-300"
                >
                  {cms.subtitle || "Un proceso estructurado, seguro y con acompañamiento personalizado de inicio a fin."}
                </p>
              </div>

              {/* Continuous Vertical Timeline: Steps 1 to 4 */}
              <div className="flex flex-col gap-0 relative">
                {/* Step 1 */}
                <div className="flex gap-[18px] pb-[22px] relative">
                  <div className="flex flex-col items-center">
                    <span className="w-[34px] h-[34px] rounded-full bg-[#5ECBDB] text-[#17131F] font-extrabold flex items-center justify-center shrink-0 text-[14px] shadow-xs">
                      1
                    </span>
                    <span className="w-[2px] h-full bg-[#4A3A57] mt-1.5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[18px] font-bold text-white leading-snug">
                      Compartes tu información inicial
                    </div>
                    <div className="text-[14.5px] leading-[1.55] text-[#C7B8D2] mt-0.5">
                      Monto aproximado, tipo de deuda e institución. Toma dos minutos, sin documentos ni consulta previa al buró.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-[18px] pb-[22px] relative">
                  <div className="flex flex-col items-center">
                    <span className="w-[34px] h-[34px] rounded-full bg-[#5ECBDB] text-[#17131F] font-extrabold flex items-center justify-center shrink-0 text-[14px] shadow-xs">
                      2
                    </span>
                    <span className="w-[2px] h-full bg-[#4A3A57] mt-1.5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[18px] font-bold text-white leading-snug">
                      Un asesor revisa tu caso
                    </div>
                    <div className="text-[14.5px] leading-[1.55] text-[#C7B8D2] mt-0.5">
                      Te contacta, escucha tu contexto completo y te explica qué alternativas aplican y qué implica cada una antes de decidir.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-[18px] pb-[22px] relative">
                  <div className="flex flex-col items-center">
                    <span className="w-[34px] h-[34px] rounded-full bg-[#5ECBDB] text-[#17131F] font-extrabold flex items-center justify-center shrink-0 text-[14px] shadow-xs">
                      3
                    </span>
                    <span className="w-[2px] h-full bg-[#4A3A57] mt-1.5" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[18px] font-bold text-white leading-snug">
                      La consulta ocurre después, contigo enterado
                    </div>
                    <div className="text-[14.5px] leading-[1.55] text-[#C7B8D2] mt-0.5">
                      Si decides avanzar, el asesor solicita los documentos y tu autorización expresa. Nada de esto pasa en el formulario público.
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-[18px] relative">
                  <div className="flex flex-col items-center">
                    <span className="w-[34px] h-[34px] rounded-full bg-[#5ECBDB] text-[#17131F] font-extrabold flex items-center justify-center shrink-0 text-[14px] shadow-xs">
                      4
                    </span>
                  </div>
                  <div className="pt-0.5">
                    <div className="text-[18px] font-bold text-white leading-snug">
                      Continúan el proceso juntos
                    </div>
                    <div className="text-[14.5px] leading-[1.55] text-[#C7B8D2] mt-0.5">
                      Recibes tu plan por escrito, con costos claros y plazos definidos, antes de firmar nada.
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational Highlight Box */}
              <div className="bg-[#3B1F4A]/90 border border-[#5ECBDB]/35 rounded-[16px] p-[16px] sm:p-[18px] flex items-start gap-3.5 backdrop-blur-xs mt-1 shadow-xs">
                <div className="w-[32px] h-[32px] rounded-full bg-[#5ECBDB]/20 text-[#5ECBDB] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-[13.5px] leading-[1.55] text-[#EFE7F4]">
                  <strong className="text-white font-bold block mb-0.5">
                    El orden es fundamental:
                  </strong>
                  Primero definimos un plan de ahorro mensual a tu medida. Cuando cuentas con el fondo suficiente, nos ponemos en contacto con la institución para iniciar el proceso de negociación.
                </div>
              </div>
            </div>

            {/* Bottom Card CTA */}
            <div className="border-t border-[#4A3A57] pt-[20px] mt-[24px] flex flex-col sm:flex-row gap-[16px] items-start sm:items-center justify-between relative z-10">
              <Link
                href="/formulario"
                className="bravo-btn-cyan shadow-sm"
              >
                Revisar mi caso
              </Link>
              <div className="text-[13px] text-[#C7B8D2] font-medium">
                Un asesor revisará tu caso y se pondrá en contacto contigo.
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN (5 cols): Photo Card + Transparency Stack
              =================================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-[20px] justify-between reveal-fade-right">
            {/* 1. Household Planning Photo Card */}
            <div className="relative rounded-[20px] overflow-hidden h-[210px] sm:h-[225px] border border-[#E7E3EC] shadow-sm group">
              <Image
                src="/images/brand/human/bravo-household-planning.webp"
                alt="Pareja revisando y organizando sus finanzas en casa con tranquilidad"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-[50%_35%] group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17131F]/85 via-[#17131F]/30 to-transparent flex items-end p-[18px]">
                <p className="text-white text-[13.5px] font-bold leading-snug m-0 drop-shadow-sm">
                  Acompañamiento humano y transparente para recuperar la tranquilidad de tu hogar.
                </p>
              </div>
            </div>

            {/* 2. What we do / What we don't promise */}
            <div className="bg-white border border-[#E7E3EC] rounded-[20px] p-[22px] sm:p-[26px] flex flex-col gap-[14px] shadow-sm">
              <h3 className="m-0 text-[19px] sm:text-[21px] font-extrabold tracking-[-0.02em] text-[#17131F]">
                Qué sí y qué no podemos prometer
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                {/* YES Box */}
                <div className="bg-[#F1FAF6] border border-[#C6E6D9] rounded-[12px] p-[14px] flex flex-col gap-[8px]">
                  <div className="text-[13px] font-extrabold text-[#0F5D45] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#157A5A] text-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Lo que sí hacemos
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <ReviewCaseIcon size={14} className="text-[#0F5D45] shrink-0 mt-0.5" />
                      <span>Revisión sin costo de tu situación.</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <CostClarityIcon size={14} className="text-[#0F5D45] shrink-0 mt-0.5" />
                      <span>Explicación clara de costos y plazos.</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <AdvisorSupportIcon size={14} className="text-[#0F5D45] shrink-0 mt-0.5" />
                      <span>Asesor identificado en el proceso.</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <NegotiationIcon size={14} className="text-[#0F5D45] shrink-0 mt-0.5" />
                      <span>Negociación y acompañamiento en el proceso.</span>
                    </div>
                  </div>
                </div>

                {/* NO Box */}
                <div className="bg-[#FFF9F8] border border-[#F0C9C6] rounded-[12px] p-[14px] flex flex-col gap-[8px]">
                  <div className="text-[13px] font-extrabold text-[#8C201B] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#B02A24] text-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    Lo que no prometemos
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <NoHistoryDeletionIcon size={14} className="text-[#8C201B] shrink-0 mt-0.5" />
                      <span>No prometemos % fijo sin evaluar caso.</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <NoFakeGuaranteeIcon size={14} className="text-[#8C201B] shrink-0 mt-0.5" />
                      <span>No borramos historial de crédito.</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12.5px] leading-[1.4] text-[#17131F]">
                      <NoPasswordIcon size={14} className="text-[#8C201B] shrink-0 mt-0.5" />
                      <span>No pedimos claves bancarias.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Privacy & Data Protection */}
            <div className="bg-white border border-[#E7E3EC] rounded-[20px] p-[22px] sm:p-[26px] flex flex-col gap-[14px] shadow-sm">
              <h3 className="m-0 text-[19px] sm:text-[21px] font-extrabold tracking-[-0.02em] text-[#17131F]">
                Tus datos y privacidad
              </h3>

              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[12px] items-start">
                  <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72]">
                    <DataPurposeIcon size={15} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#17131F]">
                      Para qué los usamos
                    </div>
                    <div className="text-[13px] leading-[1.4] text-[#3A3344]">
                      Solo para que un asesor revise tu caso y te contacte.
                    </div>
                  </div>
                </div>

                <div className="flex gap-[12px] items-start">
                  <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72]">
                    <DataAccessIcon size={15} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#17131F]">
                      Quién puede acceder
                    </div>
                    <div className="text-[13px] leading-[1.4] text-[#3A3344]">
                      El asesor asignado y el área de análisis. No se venden.
                    </div>
                  </div>
                </div>

                <div className="flex gap-[12px] items-start">
                  <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72]">
                    <DataProtectionIcon size={15} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#17131F]">
                      Cómo se protegen
                    </div>
                    <div className="text-[13px] leading-[1.4] text-[#3A3344]">
                      Tratamiento confidencial conforme a la ley mexicana.
                    </div>
                  </div>
                </div>

                <div className="flex gap-[12px] items-start">
                  <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72]">
                    <DataDeletionIcon size={15} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#17131F]">
                      Cómo ejercer tus derechos
                    </div>
                    <div className="text-[13px] leading-[1.4] text-[#3A3344]">
                      Ejerciendo tus derechos ARCO en cualquier momento.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
