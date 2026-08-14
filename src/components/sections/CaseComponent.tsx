"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";
import { useCms } from "@/context/CmsContext";

const quickAmounts = [
  { label: "$60 mil", value: 60000 },
  { label: "$120 mil", value: 120000 },
  { label: "$180 mil", value: 180000 },
  { label: "$280 mil", value: 280000 },
  { label: "$450 mil", value: 450000 },
  { label: "$800 mil", value: 800000 },
];

const termOptions = [
  { label: "12 meses", months: 12 },
  { label: "18 meses", months: 18 },
  { label: "22 meses", months: 22 },
  { label: "28 meses", months: 28 },
];

export function CaseComponent() {
  const { getSection } = useCms();
  const cms = getSection("home_calculator");
  const [debtAmount, setDebtAmount] = useState<number>(180000);
  const [selectedMonths, setSelectedMonths] = useState<number>(22);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [displayedValues, setDisplayedValues] = useState({
    debt: 180000,
    months: 22,
    discountPercent: 59,
    settlementAmount: 73800,
    savingsAmount: 106200,
    monthlyContribution: 3354,
    settlementRatioPercent: 41,
  });

  // Calculate dynamic results where discount rate smoothly scales with debt size
  const calculatedData = useMemo(() => {
    // Discount rate scales realistically from 52% (at 50k) up to 68% (at 1M)
    const normalized = Math.min(1, Math.max(0, (debtAmount - 50000) / 950000));
    const discountRate = 0.52 + (normalized * 0.16); // 52% to 68%
    const settlement = Math.round(debtAmount * (1 - discountRate));
    const savings = debtAmount - settlement;
    const monthly = Math.round(settlement / selectedMonths);
    const percent = Math.round(discountRate * 100);
    const ratio = Math.max(15, Math.min(85, Math.round((settlement / debtAmount) * 100)));

    return {
      debt: debtAmount,
      months: selectedMonths,
      discountPercent: percent,
      settlementAmount: settlement,
      savingsAmount: savings,
      monthlyContribution: monthly,
      settlementRatioPercent: ratio,
    };
  }, [debtAmount, selectedMonths]);

  // Trigger smooth calculation state
  const handleAmountChange = (newAmount: number) => {
    setDebtAmount(newAmount);
    setIsCalculating(true);
    trackEvent("calculator_interaction", {
      amount: newAmount,
      months: selectedMonths,
      discount_percent: calculatedData.discountPercent,
      estimated_settlement: calculatedData.settlementAmount,
      monthly_savings: calculatedData.monthlyContribution,
      action_type: "amount_change",
    });
  };

  const handleTermChange = (months: number) => {
    setSelectedMonths(months);
    setIsCalculating(true);
    trackEvent("calculator_interaction", {
      amount: debtAmount,
      months: months,
      discount_percent: calculatedData.discountPercent,
      estimated_settlement: calculatedData.settlementAmount,
      monthly_savings: calculatedData.monthlyContribution,
      action_type: "term_change",
    });
  };

  useEffect(() => {
    if (isCalculating) {
      const timer = setTimeout(() => {
        setDisplayedValues(calculatedData);
        setIsCalculating(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [isCalculating, calculatedData]);

  // Initial load
  useEffect(() => {
    setDisplayedValues(calculatedData);
  }, [calculatedData]);

  const formatCurrency = (val: number) => `$${val.toLocaleString("es-MX")}`;

  return (
    <section
      id="calculator-section"
      data-cms-section="home_calculator"
      className="py-[64px] lg:py-[96px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden"
    >
      {/* Background glow orbs */}
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[110px] animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />

      <div className="bravo-container relative z-10">
        <div className="bg-white border border-[#E7E3EC] rounded-[24px] lg:rounded-[28px] p-[28px] sm:p-[40px] lg:p-[48px] flex flex-col gap-[32px] shadow-lg reveal-init">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[18px] border-b border-[#F0EDF3] pb-[22px]">
            <div className="flex flex-col gap-1.5">
              <div
                data-cms-field="badge"
                className="inline-flex self-start items-center gap-2 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full transition-all duration-300"
              >
                <span>{cms.badge || "SIMULADOR DE LIQUIDACIÓN DE DEUDA"}</span>
              </div>
              <h2
                data-cms-field="title"
                className="m-0 text-[30px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.025em] text-[#17131F] leading-tight transition-all duration-300"
              >
                {cms.title || "Calcula cómo se vería tu escenario de alivio"}
              </h2>
            </div>

            {/* Profile badge */}
            <div className="flex items-center gap-[10px] bg-[#FBFAFC] border border-[#E7E3EC] rounded-full pl-2 pr-4 py-1.5 self-start md:self-auto shadow-2xs">
              <div className="w-[32px] h-[32px] relative rounded-full overflow-hidden shrink-0 border border-[#AB6CCA]">
                <Image
                  src="/images/brand/vector/bravo-case-avatar.svg"
                  alt="Avatar ilustrativo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[13px] font-bold text-[#17131F]">
                Basado en casos resueltos en México
              </span>
            </div>
          </div>

          {/* ===================================================================
              INTERACTIVE CALCULATOR GRID (2 Generous Columns)
              =================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] lg:gap-[36px] items-stretch">
            {/* ---------------------------------------------------------------
                LEFT COLUMN (6 cols): Controls & Interactive Slider
                --------------------------------------------------------------- */}
            <div className="lg:col-span-6 bg-[#FBFAFC] border border-[#E7E3EC] rounded-[20px] p-[24px] sm:p-[28px] flex flex-col justify-between gap-[24px] shadow-xs reveal-fade-left">
              <div className="flex flex-col gap-[20px]">
                {/* Amount Slider Header */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[14.5px] font-bold text-[#17131F]">
                      ¿Cuánto debes aproximadamente en total?
                    </label>
                    <span className="text-[26px] sm:text-[28px] font-extrabold text-[#5B2C72] font-mono">
                      {formatCurrency(debtAmount)}
                    </span>
                  </div>
                  <span className="text-[12.5px] text-[#5B5266]">
                    Mueve la barra interactiva o selecciona un monto rápido:
                  </span>
                </div>

                {/* Range Slider */}
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min={50000}
                    max={1000000}
                    step={10000}
                    value={debtAmount}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    className="w-full h-[10px] bg-[#EAE5EF] rounded-lg appearance-none cursor-pointer accent-[#5B2C72]"
                  />
                  <div className="flex justify-between text-[11.5px] text-[#8A8095] font-mono font-medium">
                    <span>$50,000</span>
                    <span>$500,000</span>
                    <span>$1,000,000+</span>
                  </div>
                </div>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickAmounts.map((opt) => {
                    const isSelected = debtAmount === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAmountChange(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#5B2C72] text-white shadow-xs scale-[1.02]"
                            : "bg-white border border-[#C9C1D4] text-[#17131F] hover:border-[#5B2C72] hover:bg-[#F5EDF9]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Term Selector */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#EAE5EF]">
                  <label className="text-[14px] font-bold text-[#17131F]">
                    Plazo estimado para tu plan de ahorro:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {termOptions.map((term) => {
                      const isSelected = selectedMonths === term.months;
                      return (
                        <button
                          key={term.months}
                          type="button"
                          onClick={() => handleTermChange(term.months)}
                          className={`py-2 px-2.5 rounded-lg text-[13px] font-bold text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#5ECBDB] text-[#17131F] shadow-xs scale-[1.02]"
                              : "bg-white border border-[#C9C1D4] text-[#5B5266] hover:border-[#5ECBDB]"
                          }`}
                        >
                          {term.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Informative Guidance */}
              <div className="text-[12.5px] leading-relaxed text-[#5B5266] bg-white border border-[#E7E3EC] rounded-[12px] p-3 flex items-center gap-2.5">
                <div className="w-[24px] h-[24px] rounded-full bg-[#5B2C72]/10 text-[#5B2C72] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>
                  El plazo y la aportación mensual se adaptan 100% a tus posibilidades reales de pago durante la asesoría.
                </span>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                RIGHT COLUMN (6 cols): High-Contrast Real-Time Results Card
                --------------------------------------------------------------- */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#2E1739] to-[#1E0F26] text-white rounded-[20px] p-[26px] sm:p-[32px] flex flex-col justify-between gap-[22px] shadow-xl relative overflow-hidden border border-[#4A3A57]/60 reveal-fade-right">
              {/* Ambient Glows inside Dark Results Card */}
              <div
                className="pointer-events-none absolute -bottom-[60px] -right-[60px] w-[280px] h-[280px] rounded-full opacity-35 blur-[70px]"
                style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)" }}
              />

              <div className="flex flex-col gap-[20px] relative z-10">
                {/* Result Card Header with Loading Indicator */}
                <div className="flex justify-between items-center border-b border-[#4A3A57] pb-3.5">
                  <span className="text-[13px] font-mono tracking-widest text-[#5ECBDB] font-bold uppercase">
                    PROYECCIÓN ESTIMADA
                  </span>
                  {isCalculating ? (
                    <div className="flex items-center gap-2 text-[12px] text-[#5ECBDB] font-bold animate-pulse">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-[#5ECBDB]/30 border-t-[#5ECBDB] animate-spin" />
                      Actualizando cálculo…
                    </div>
                  ) : (
                    <span className="text-[12.5px] text-[#157A5A] font-bold bg-[#F1FAF6] px-3 py-0.5 rounded-full border border-[#C6E6D9] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Descuento estimado: ~{displayedValues.discountPercent}%</span>
                    </span>
                  )}
                </div>

                {/* Main 2 Core Projected Figures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Liquidación Estimada */}
                  <div className="bg-[#3D224B]/90 border border-[#5ECBDB]/30 rounded-[16px] p-4 flex flex-col gap-1 backdrop-blur-xs shadow-xs">
                    <span className="text-[12.5px] text-[#C7B8D2] font-medium">
                      Monto estimado a liquidar:
                    </span>
                    <span
                      className={`text-[28px] sm:text-[32px] font-extrabold font-mono text-[#5ECBDB] leading-tight transition-all duration-300 ${
                        isCalculating ? "opacity-40 blur-[1px]" : "opacity-100"
                      }`}
                    >
                      {formatCurrency(displayedValues.settlementAmount)}
                    </span>
                    <span className="text-[11.5px] text-[#C7B8D2]">
                      Con carta finiquito oficial
                    </span>
                  </div>

                  {/* Ahorro Estimado */}
                  <div className="bg-[#3D224B]/90 border border-[#157A5A]/40 rounded-[16px] p-4 flex flex-col gap-1 backdrop-blur-xs shadow-xs">
                    <span className="text-[12.5px] text-[#C7B8D2] font-medium">
                      Ahorro potencial estimado:
                    </span>
                    <span
                      className={`text-[28px] sm:text-[32px] font-extrabold font-mono text-[#4ADE80] leading-tight transition-all duration-300 ${
                        isCalculating ? "opacity-40 blur-[1px]" : "opacity-100"
                      }`}
                    >
                      -{formatCurrency(displayedValues.savingsAmount)}
                    </span>
                    <span className="text-[11.5px] text-[#C7B8D2]">
                      Descuento estimado sobre saldo
                    </span>
                  </div>
                </div>

                {/* Monthly Payment Simulation */}
                <div className="bg-white/10 border border-white/15 rounded-[14px] p-3.5 flex justify-between items-center backdrop-blur-xs">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#EFE7F4] font-semibold">
                      Aportación mensual sugerida:
                    </span>
                    <span className="text-[11.5px] text-[#C7B8D2]">
                      Al fondo de ahorro a tu nombre ({displayedValues.months} meses)
                    </span>
                  </div>
                  <span
                    className={`text-[20px] sm:text-[22px] font-extrabold font-mono text-white transition-all ${
                      isCalculating ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    ~{formatCurrency(displayedValues.monthlyContribution)}/mes
                  </span>
                </div>

                {/* =============================================================
                    DYNAMIC ANIMATED COMPARATIVE PROGRESS METER
                    ============================================================= */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-[#C7B8D2] font-medium">
                      Deuda original: <strong className="text-white">{formatCurrency(displayedValues.debt)}</strong>
                    </span>
                    <span className="text-[#5ECBDB] font-extrabold">
                      Liquidas con: {formatCurrency(displayedValues.settlementAmount)} ({displayedValues.settlementRatioPercent}%)
                    </span>
                  </div>

                  {/* Dual Animated Progress Track */}
                  <div className="relative w-full h-[18px] bg-[#4A3A57]/90 rounded-full overflow-hidden p-[2px] shadow-inner flex items-center">
                    <div
                      className="h-full bg-gradient-to-r from-[#5ECBDB] via-[#4ADE80] to-[#5ECBDB] bg-[length:200%_100%] animate-shimmer-sweep rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                      style={{
                        width: `${displayedValues.settlementRatioPercent}%`,
                      }}
                    >
                      <span className="text-[10px] font-extrabold text-[#17131F] font-mono leading-none">
                        {displayedValues.settlementRatioPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-[#C7B8D2]/80 font-mono">
                    <span>Ahorro estimado del {displayedValues.discountPercent}%</span>
                    <span>Pagas solo {displayedValues.settlementRatioPercent}% del total</span>
                  </div>
                </div>
              </div>

              {/* Action Button inside Result Card */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-[#4A3A57] relative z-10">
                <Link
                  href="/formulario"
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_id: "calculator_cta",
                      placement: "calculator_simulator",
                    })
                  }
                  className="w-full sm:w-auto flex-1 bravo-btn-cyan text-center font-extrabold shadow-md"
                >
                  Solicitar plan con este monto
                </Link>
                <span className="text-[12px] text-[#C7B8D2] text-center sm:text-right">
                  Evaluación 100% gratuita
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Legal Notice */}
          <div className="border-t border-[#F0EDF3] pt-4 text-[12px] text-[#8A8095] leading-relaxed">
            * Los cálculos mostrados son simulaciones ilustrativas basadas en el comportamiento histórico promedio de liquidaciones de deuda con descuento. El porcentaje final obtenido, plazos y montos mensuales dependerán de la evaluación personalizada de tu caso, antigüedad de la mora y las políticas vigentes de cada institución financiera.
          </div>
        </div>
      </div>
    </section>
  );
}
