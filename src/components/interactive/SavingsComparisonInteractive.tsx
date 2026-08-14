"use client";

import React from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons/bravo";

/**
 * Educational financial context component.
 *
 * GOVERNANCE NOTE:
 * This component does NOT produce specific monetary figures or percentage savings.
 * No multipliers (2.65x, 2x, etc.) are used — any such figure would require
 * a validated source and Claims Registry approval.
 *
 * The component illustrates the CONCEPT of the minimum-payment trap conceptually,
 * without asserting specific costs or outcomes for any individual user.
 */
export function SavingsComparisonInteractive() {
  return (
    <section className="bg-white py-14 lg:py-20 px-4 lg:px-[40px] border-t border-[#E7E3EC] relative overflow-hidden">
      <div className="bravo-container flex flex-col gap-10">
        {/* Section Header */}
        <div className="text-center max-w-[760px] mx-auto flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EDF9] border border-[#DDCBE6] text-[#5B2C72] text-[12px] font-mono font-extrabold uppercase tracking-wider mx-auto">
            <span>Contexto Financiero Educativo</span>
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight m-0">
            ¿Qué pasa cuando sólo pagas el mínimo de tu tarjeta?
          </h2>
          <p className="text-[15px] sm:text-[16.5px] text-[#5B5266] m-0">
            Los pagos mínimos pueden extender el tiempo de liquidación y aumentar significativamente el costo total del crédito.
            El resultado depende de la tasa, el saldo, la institución, los pagos realizados y las comisiones aplicables.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1040px] mx-auto w-full items-stretch">
          {/* Option A: Pagos Mínimos al Banco */}
          <div className="p-6 sm:p-8 bg-[#FAF8FB] rounded-[28px] border-2 border-[#E7E3EC] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-mono uppercase text-[#B02A24] font-bold bg-[#FEE4E2] px-3 py-1 rounded-full border border-[#FECDCA] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Sólo Pagos Mínimos</span>
                </span>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#17131F] m-0">
                Pagar el mínimo mensual al banco
              </h3>
              <p className="text-[13.5px] text-[#5B5266] m-0">
                La mayor parte de tu pago se destina al cobro de intereses compuestos e IVA, prolongando la deuda durante años sin reducir el capital significativamente.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex justify-between items-start border-b border-[#F0EDF3] pb-2">
                <span className="text-[13px] text-[#5B5266] max-w-[60%]">Tiempo estimado de liquidación:</span>
                <span className="text-[14px] font-bold text-[#17131F] font-mono text-right">
                  Varios años
                </span>
              </div>
              <div className="flex justify-between items-start border-b border-[#F0EDF3] pb-2">
                <span className="text-[13px] text-[#5B5266] max-w-[60%]">Costo total del crédito:</span>
                <span className="text-[14px] font-bold text-[#B02A24] font-mono text-right">
                  Significativamente mayor al saldo original
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[13px] text-[#5B5266] max-w-[60%]">Factores que influyen:</span>
                <span className="text-[13px] text-[#5B5266] font-mono text-right">
                  Tasa, saldo, banco, pagos, comisiones
                </span>
              </div>
            </div>

            <div className="text-[12px] text-[#8A8095] italic">
              Esta sección es informativa y no representa el resultado específico de ningún caso. El costo real depende de las condiciones particulares de cada crédito.
            </div>
          </div>

          {/* Option B: Plan de Liquidación Bravo */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-[#2E1739] to-[#1E0F26] text-white rounded-[28px] border-2 border-[#5ECBDB] shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
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
                Aportas mensualmente a un fondo propio mientras negociamos y acompañamos el proceso con tus acreedores para formalizar un convenio de pago.
              </p>
            </div>

            <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col gap-4 text-white">
              <div className="flex flex-col gap-2 text-[13.5px] text-[#DDCBE6]">
                <div className="flex items-start gap-2">
                  <CheckIcon size={16} className="text-[#5ECBDB] mt-0.5 shrink-0" />
                  <span>Las condiciones de negociación dependen de la institución, el saldo y las características de tu caso.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon size={16} className="text-[#5ECBDB] mt-0.5 shrink-0" />
                  <span>El plan se estructura según tu capacidad de ahorro mensual, sin comprometer tu flujo de efectivo.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon size={16} className="text-[#5ECBDB] mt-0.5 shrink-0" />
                  <span>Cuando la liquidación se formaliza con el acreedor, recibes la documentación correspondiente al convenio.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-center">
                <span className="text-[12px] text-[#AB6CCA] font-mono">
                  Para conocer las condiciones aplicables a tu caso, solicita tu evaluación personalizada.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/formulario"
                className="w-full py-3.5 bg-[#5ECBDB] hover:bg-[#4BB8C7] text-[#17131F] font-extrabold text-[14.5px] rounded-full text-center shadow-md transition-all cursor-pointer block hover:scale-[1.02]"
              >
                Revisar mi caso sin costo →
              </Link>
              <div className="flex flex-col items-center justify-center gap-1.5 text-[11px] text-[#DDCBE6] text-center mt-2">
                <div className="flex items-center gap-1.5">
                  <CheckIcon size={13} className="text-[#5ECBDB]" />
                  <span>Esta evaluación inicial no consulta tu Buró de Crédito</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
