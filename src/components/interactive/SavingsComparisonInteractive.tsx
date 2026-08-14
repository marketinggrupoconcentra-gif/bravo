"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons/bravo";
import { logUserAction } from "@/lib/telemetry/logger";

export function SavingsComparisonInteractive() {
  const [debtAmount, setDebtAmount] = useState(150000);

  // Calculations
  const traditionalTotalPay = Math.round(debtAmount * 2.65);
  const traditionalMonths = 108; // 9 years

  const bravoEstimatedDiscountPct = 65;
  const bravoTotalPay = Math.round(debtAmount * (1 - bravoEstimatedDiscountPct / 100));
  const bravoNetSavings = debtAmount - bravoTotalPay;
  const bravoMonths = 18; // 1.5 years

  // Future target freedom date
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + bravoMonths);
  const freedomDateFormatted = targetDate.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDebtAmount(val);
    logUserAction("calculator_interaction", { amount: val, source: "comparison_slider" });
  };

  return (
    <section className="bg-white py-14 lg:py-20 px-4 lg:px-[40px] border-t border-[#E7E3EC] relative overflow-hidden">
      <div className="bravo-container flex flex-col gap-10">
        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EDF9] border border-[#DDCBE6] text-[#5B2C72] text-[12px] font-mono font-extrabold uppercase tracking-wider mx-auto">
            <span>Comparativa Financiera</span>
            <span>·</span>
            <span className="text-[#157A5A]">Ahorro Real</span>
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight m-0">
            ¿Cuánto pagarías con pagos mínimos vs. con el Plan Bravo?
          </h2>
          <p className="text-[15px] sm:text-[16.5px] text-[#5B5266] m-0">
            Compara el costo real de mantener pagos mínimos en tarjetas frente a un plan estructurado de liquidación con descuento negociado.
          </p>
        </div>

        {/* Interactive Slider Controller */}
        <div className="max-w-[640px] mx-auto w-full bg-[#FAF8FB] p-6 rounded-[24px] border border-[#E7E3EC] shadow-2xs flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-[13.5px] font-bold text-[#5B5266]">Monto total de tu deuda actual:</span>
            <span className="text-[24px] font-extrabold text-[#5B2C72] font-mono">
              ${debtAmount.toLocaleString("es-MX")} MXN
            </span>
          </div>

          <input
            type="range"
            min={50000}
            max={500000}
            step={10000}
            value={debtAmount}
            onChange={handleSliderChange}
            className="w-full h-3 bg-[#E7E3EC] rounded-lg appearance-none cursor-pointer accent-[#5B2C72]"
          />

          <div className="flex justify-between text-[11.5px] font-mono text-[#8A8095]">
            <span>$50,000 MXN</span>
            <span>$250,000 MXN</span>
            <span>$500,000+ MXN</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1040px] mx-auto w-full items-stretch">
          {/* Option A: Pagos Mínimos al Banco (Traditional Trap) */}
          <div className="p-6 sm:p-8 bg-[#FAF8FB] rounded-[28px] border-2 border-[#E7E3EC] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-mono uppercase text-[#B02A24] font-bold bg-[#FEE4E2] px-3 py-1 rounded-full border border-[#FECDCA] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Camino Tradicional</span>
                </span>
                <span className="text-[12px] font-mono text-[#8A8095]">Pagos Mínimos</span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#17131F] m-0">
                Pagar el mínimo mensual al banco
              </h3>
              <p className="text-[13.5px] text-[#5B5266] m-0">
                La mayor parte de tu pago se destina al cobro de intereses compuestos e IVA, prolongando la deuda durante años.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex justify-between items-baseline border-b border-[#F0EDF3] pb-2">
                <span className="text-[13px] text-[#5B5266]">Total a desembolsar:</span>
                <span className="text-[22px] font-extrabold text-[#B02A24] font-mono">
                  ${traditionalTotalPay.toLocaleString("es-MX")} MXN
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-[#F0EDF3] pb-2">
                <span className="text-[13px] text-[#5B5266]">Tiempo estimado:</span>
                <span className="text-[14px] font-bold text-[#17131F] font-mono">
                  ~{Math.round(traditionalMonths / 12)} años ({traditionalMonths} meses)
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#5B5266]">Intereses pagados:</span>
                <span className="text-[14px] font-bold text-[#B02A24] font-mono">
                  +${(traditionalTotalPay - debtAmount).toLocaleString("es-MX")} MXN
                </span>
              </div>
            </div>

            <div className="text-[12px] text-[#8A8095] italic">
              *Estimación con CAT promedio bancario de 78% anual sin aportaciones a capital.
            </div>
          </div>

          {/* Option B: Plan de Liquidación Bravo (Solution Path) */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-[#2E1739] to-[#1E0F26] text-white rounded-[28px] border-2 border-[#5ECBDB] shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
            {/* Corner highlight badge */}
            <div className="absolute top-0 right-0 bg-[#5ECBDB] text-[#17131F] text-[11px] font-mono font-extrabold uppercase px-4 py-1 rounded-bl-2xl flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Ahorro Estimado: ~{bravoEstimatedDiscountPct}%</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-mono uppercase text-[#5ECBDB] font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#F5C451]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Plan de Liquidación Bravo</span>
                </span>
              </div>
              <h3 className="text-[20px] font-extrabold text-white m-0">
                Programa de ahorro mensual negociado
              </h3>
              <p className="text-[13.5px] text-[#DDCBE6] m-0">
                Ahorras una cuota mensual adaptada a tu presupuesto mientras negociamos una quita legal directa con tus acreedores.
              </p>
            </div>

            <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col gap-3 text-white">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                <span className="text-[13px] text-[#DDCBE6]">Monto total a liquidar:</span>
                <span className="text-[24px] font-extrabold text-[#5ECBDB] font-mono">
                  ${bravoTotalPay.toLocaleString("es-MX")} MXN
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                <span className="text-[13px] text-[#DDCBE6]">Ahorro neto proyectado:</span>
                <span className="text-[16px] font-extrabold text-[#157A5A] bg-[#F1FAF6] px-2.5 py-0.5 rounded-full font-mono">
                  -${bravoNetSavings.toLocaleString("es-MX")} MXN
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#DDCBE6]">Tiempo promedio:</span>
                <span className="text-[14px] font-bold text-white font-mono">
                  ~{bravoMonths} meses (Libre en {freedomDateFormatted})
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/formulario"
                className="w-full py-3.5 bg-[#5ECBDB] hover:bg-[#4BB8C7] text-[#17131F] font-extrabold text-[14.5px] rounded-full text-center shadow-md transition-all cursor-pointer block hover:scale-[1.02]"
              >
                Solicitar mi propuesta personalizada sin costo →
              </Link>
              <div className="flex flex-col items-center justify-center gap-1.5 text-[11px] text-[#DDCBE6] text-center mt-2">
                <div className="flex items-center gap-1.5">
                  <CheckIcon size={13} className="text-[#5ECBDB]" />
                  <span>Evaluación confidencial y sin impacto inmediato en historial crediticio</span>
                </div>
                <span className="text-[10px] opacity-70 mt-1 max-w-[90%]">
                  *Las cifras mostradas son un ejemplo estimativo. El descuento real y los plazos dependen de las negociaciones individuales con cada acreedor.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
