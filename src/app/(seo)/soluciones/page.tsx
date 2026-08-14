import React from "react";
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  CreditCardIcon,
  PersonalLoanIcon,
  RetailDebtIcon,
  CarDebtIcon,
  OtherDebtIcon,
  CheckIcon,
  NegotiationIcon,
  ReviewCaseIcon,
  CostClarityIcon,
  AdvisorSupportIcon,
} from "@/components/icons/bravo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluciones de Deuda | Bravo México",
  description:
    "Conoce los tipos de deudas bancarias y departamentales que podemos negociar para ti en México. Programa de ahorro y liquidación de deudas.",
};

const debtTypes = [
  {
    icon: CreditCardIcon,
    label: "Tarjetas de Crédito",
    desc: "BBVA, Banamex, Santander, Banorte, HSBC, Amex, Nu México y más.",
    color: "#5B2C72",
    bg: "#F5EDF9",
    tag: "El más común",
  },
  {
    icon: PersonalLoanIcon,
    label: "Préstamos Personales",
    desc: "Créditos de nómina y préstamos sin garantía hipotecaria.",
    color: "#1E8A9B",
    bg: "#EBF8FA",
    tag: null,
  },
  {
    icon: RetailDebtIcon,
    label: "Tarjetas Departamentales",
    desc: "Liverpool, Palacio de Hierro, Sears, Coppel, Suburbia y más.",
    color: "#157A5A",
    bg: "#EDFAF4",
    tag: null,
  },
  {
    icon: CarDebtIcon,
    label: "Crédito Automotriz",
    desc: "Financiamiento de vehículos en mora con bancos o arrendadoras.",
    color: "#B45309",
    bg: "#FEF3C7",
    tag: null,
  },
  {
    icon: OtherDebtIcon,
    label: "Otras Deudas",
    desc: "Cajas populares, financieras locales, microcréditos y fondos.",
    color: "#6B21A8",
    bg: "#F3E8FF",
    tag: null,
  },
];

const process = [
  {
    step: "01",
    icon: ReviewCaseIcon,
    title: "Revisamos tu caso",
    desc: "En 24 horas analizamos tus deudas, instituciones y montos para darte un panorama honesto.",
  },
  {
    step: "02",
    icon: CostClarityIcon,
    title: "Diseñamos tu plan",
    desc: "Creamos un programa de ahorro mensual realista, adaptado a tu capacidad de pago actual.",
  },
  {
    step: "03",
    icon: NegotiationIcon,
    title: "Negociamos por ti",
    desc: "Nuestros especialistas contactan a cada acreedor y obtienen descuentos formales documentados.",
  },
  {
    step: "04",
    icon: AdvisorSupportIcon,
    title: "Liquidas con certeza",
    desc: "Pagas el acuerdo negociado y recibes carta liberatoria oficial de cada institución.",
  },
];

const benefits = [
  "Sin poner en riesgo tu patrimonio",
  "Asesor dedicado durante todo el proceso",
  "Descuentos reales documentados",
  "Sin honorarios anticipados",
  "Disponible en todo México",
  "Proceso 100% confidencial",
];

const institutions = [
  "BBVA", "Banamex", "Santander", "Banorte", "HSBC", "Scotiabank",
  "Amex", "Nu México", "Banbajío", "Liverpool", "Palacio de Hierro",
  "Sears", "Coppel", "Suburbia", "Bradescard", "Walmart", "Sam's Club",
];

export default function SolucionesPage() {
  return (
    <>
      <Hero
        title="Soluciones a tu medida para liquidar deudas"
        subtitle="Analizamos tu situación con cada institución acreedora para diseñar un plan viable de ahorro y descuento formal."
        ctaText="Revisar mi caso"
        ctaHref="/formulario"
        ctaId="soluciones_hero"
        placement="soluciones_hero"
      />

      {/* ── TIPOS DE DEUDA — full-width alternating strip ── */}
      <section className="bg-[#F1EEF3] py-[72px] lg:py-[104px]">
        <div className="bravo-container flex flex-col gap-[56px]">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-[620px]">
              <span className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-widest uppercase text-[#5B2C72] bg-[#F5EDF9] border border-[#DDCBE6] px-3.5 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B2C72] inline-block" />
                Tipos de deuda
              </span>
              <h2 className="m-0 text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-[1.08]">
                Deudas que <span className="text-[#5B2C72]">sí podemos</span><br className="hidden lg:block" /> negociar
              </h2>
              <p className="m-0 text-[16px] sm:text-[17px] text-[#5B5266] leading-relaxed">
                Trabajamos con las principales instituciones financieras y comerciales del país.
              </p>
            </div>
            <Link
              href="/formulario"
              className="bravo-btn-primary shrink-0 w-fit"
              id="soluciones_debt_cta"
            >
              Revisar mi caso →
            </Link>
          </div>

          {/* Debt type cards — 5-col on XL, 3+2 on LG, 2 on MD, 1 on SM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {debtTypes.map((dt) => {
              const Icon = dt.icon;
              return (
                <div
                  key={dt.label}
                  className="group relative bg-white border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-4 shadow-xs hover:shadow-lg hover:border-[#C5A8D8] hover:-translate-y-1 transition-all duration-300 reveal-init"
                >
                  {dt.tag && (
                    <span className="absolute top-4 right-4 text-[10.5px] font-extrabold tracking-wide uppercase text-[#5B2C72] bg-[#F5EDF9] border border-[#DDCBE6] px-2.5 py-0.5 rounded-full">
                      {dt.tag}
                    </span>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: dt.bg, color: dt.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="m-0 text-[17px] font-bold text-[#17131F] leading-snug">
                      {dt.label}
                    </h3>
                    <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">{dt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INSTITUCIONES — full-width ticker strip ── */}
      <div className="w-full bg-[#2E1739] py-[20px] overflow-hidden border-y border-[#4A2A5A]">
        <div className="bravo-container">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#AB6CCA] shrink-0">
              Negociamos con:
            </span>
            <div className="flex items-center gap-2.5 flex-wrap">
              {institutions.map((name) => (
                <span
                  key={name}
                  className="text-[13px] font-semibold text-[#E8D8F5] bg-white/8 border border-white/12 px-3 py-1 rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PROCESO — full-width dark section ── */}
      <section className="w-full bg-[#17131F] py-[80px] lg:py-[112px]">
        <div className="bravo-container flex flex-col gap-[56px]">
          <div className="text-center flex flex-col gap-3 max-w-[680px] mx-auto reveal-init">
            <h2 className="m-0 text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold tracking-[-0.03em] text-white leading-[1.1]">
              Cómo funciona el proceso
            </h2>
            <p className="m-0 text-[16px] text-[#B8A3C9] leading-relaxed">
              Un camino claro y documentado desde el análisis hasta la carta liberatoria.
            </p>
          </div>

          {/* 4-col steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {process.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.step}
                  className={`relative bg-white/5 border border-white/10 rounded-[22px] p-7 flex flex-col gap-5 hover:bg-white/8 hover:border-[#5B2C72]/60 transition-all duration-300 reveal-init stagger-${i + 1}`}
                >
                  {/* Step number */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#5ECBDB]">
                      Paso {p.step}
                    </span>
                    {i < process.length - 1 && (
                      <svg className="w-4 h-4 text-white/20 hidden xl:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#5B2C72]/30 border border-[#5B2C72]/50 flex items-center justify-center text-[#AB6CCA]">
                    <Icon size={22} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-[18px] font-bold text-white">{p.title}</h3>
                    <p className="m-0 text-[14px] text-[#B8A3C9] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS — full-width light section ── */}
      <section className="bg-white py-[72px] lg:py-[96px]">
        <div className="bravo-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: heading */}
            <div className="flex flex-col gap-5 reveal-fade-left">
              <span className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-widest uppercase text-[#157A5A] bg-[#EDFAF4] border border-[#A7E8C8] px-3.5 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#157A5A] inline-block" />
                Por qué Bravo
              </span>
              <h2 className="m-0 text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-[1.1]">
                Un proceso diseñado para tu <span className="text-[#5B2C72]">tranquilidad</span>
              </h2>
              <p className="m-0 text-[16px] text-[#5B5266] leading-relaxed">
                Más de 15 años negociando deudas en México con transparencia y resultados documentados.
              </p>
              <Link href="/formulario" className="bravo-btn-primary w-fit mt-2" id="soluciones_benefits_cta">
                Revisar mi caso →
              </Link>
            </div>

            {/* Right: benefits checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 reveal-fade-right">
              {benefits.map((b, i) => (
                <div
                  key={b}
                  className={`flex items-start gap-3 p-4 bg-[#FAFAFA] border border-[#E7E3EC] rounded-[14px] reveal-init stagger-${(i % 3) + 1}`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#EDFAF4] border border-[#A7E8C8] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckIcon size={14} className="text-[#157A5A]" />
                  </div>
                  <span className="text-[15px] font-semibold text-[#17131F] leading-snug">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
