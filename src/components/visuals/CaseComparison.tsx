"use client";

import React from "react";

interface CaseComparisonProps {
  initialDebt?: number;
  finalAmount?: number;
  durationMonths?: number;
  className?: string;
}

export function CaseComparison({
  initialDebt = 182400,
  finalAmount = 71100,
  durationMonths = 22,
  className = "",
}: CaseComparisonProps) {
  const reductionPercentage = Math.round(((initialDebt - finalAmount) / initialDebt) * 100);
  const formattedInitial = `$${initialDebt.toLocaleString("es-MX")}`;
  const formattedFinal = `$${finalAmount.toLocaleString("es-MX")}`;
  const initialWidthPercent = 100;
  const finalWidthPercent = Math.round((finalAmount / initialDebt) * 100);

  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      {/* Top 3 Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 border-y border-[--color-neutral-border-muted] py-5">
        <div className="md:pr-6 md:border-r border-[--color-neutral-border-muted]">
          <div className="text-[13px] font-semibold text-[--color-neutral-text-muted] uppercase tracking-wider mb-1">
            Deuda inicial estimada
          </div>
          <div className="text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[--color-neutral-ink]">
            {formattedInitial}
          </div>
          <div className="text-[12px] text-[--color-neutral-text-muted] mt-0.5">
            3 instituciones agrupadas
          </div>
        </div>

        <div className="md:px-6 md:border-r border-[--color-neutral-border-muted]">
          <div className="text-[13px] font-semibold text-[--color-neutral-text-muted] uppercase tracking-wider mb-1">
            Duración del plan
          </div>
          <div className="text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[--color-violet-700]">
            {durationMonths} meses
          </div>
          <div className="text-[12px] text-[--color-neutral-text-muted] mt-0.5">
            Ahorro mensual estructurado
          </div>
        </div>

        <div className="md:pl-6">
          <div className="text-[13px] font-semibold text-[--color-neutral-text-muted] uppercase tracking-wider mb-1">
            Liquidado por aprox.
          </div>
          <div className="text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[--color-semantic-success]">
            {formattedFinal}
          </div>
          <div className="text-[12px] font-bold text-[--color-semantic-success] mt-0.5">
            ~{reductionPercentage}% de reducción lograda
          </div>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="bg-[#FBFAFC] border border-[--color-neutral-border-muted] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
        <div className="text-[13px] font-bold text-[--color-neutral-ink] flex justify-between items-center">
          <span>Comparativa gráfica de monto</span>
          <span className="font-mono text-[11px] text-[--color-neutral-text-faint]">EJEMPLO PROPORCIONAL</span>
        </div>

        {/* Initial Debt Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[13px] font-medium text-[--color-neutral-text]">
            <span>Monto total al inicio</span>
            <span className="font-bold text-[--color-neutral-ink]">{formattedInitial}</span>
          </div>
          <div className="h-[20px] bg-[#EAE5EF] rounded-md overflow-hidden flex items-center p-0.5">
            <div
              className="h-full bg-[--color-violet-900] rounded-[4px] transition-all duration-500"
              style={{ width: `${initialWidthPercent}%` }}
            />
          </div>
        </div>

        {/* Liquidated Result Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[13px] font-medium text-[--color-neutral-text]">
            <span>Monto acordado al liquidar</span>
            <span className="font-bold text-[--color-semantic-success]">{formattedFinal}</span>
          </div>
          <div className="h-[20px] bg-[#EAE5EF] rounded-md overflow-hidden flex items-center p-0.5">
            <div
              className="h-full bg-[--color-semantic-success] rounded-[4px] transition-all duration-500"
              style={{ width: `${finalWidthPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
