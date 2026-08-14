import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { RequirementsIcon, GuideIcon, ReviewCaseIcon, CostClarityIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Requisitos para Entrar al Programa Bravo México | Criterios y Documentos",
  description: "Descubre los 3 requisitos básicos para iniciar tu plan de liquidación de deudas con descuento en México.",
};

export default function RequisitosPage() {
  return (
    <>
      <header className="py-[48px] lg:py-[72px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[1080px]">
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-4">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Requisitos</span>
          </nav>

          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#157A5A] uppercase tracking-widest font-extrabold bg-[#F1FAF6] border border-[#C6E6D9] px-3 py-1 rounded-full shadow-2xs">
              <RequirementsIcon size={14} />
              <span>CRITERIOS DE ADMISIÓN MÉXICO</span>
            </div>
            <h1 className="m-0 text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
              Requisitos para liquidar tus deudas con Bravo
            </h1>
            <p className="m-0 text-[16px] sm:text-[18px] text-[#5B5266] max-w-[760px] leading-relaxed">
              Verifica si tu situación califica para estructurar un plan de ahorro y negociación de quita formal.
            </p>
          </div>
        </div>
      </header>

      <section className="py-[64px] lg:py-[88px] bg-white border-b border-[#E7E3EC]">
        <div className="bravo-container max-w-[1080px] flex flex-col gap-10">
          {/* 3 Core Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center font-extrabold text-[20px]">
                $50k+
              </div>
              <h2 className="m-0 text-[19px] font-bold text-[#17131F]">Monto mínimo de deuda</h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Tener una deuda acumulada mayor a $50,000 pesos mexicanos sumando tarjetas, préstamos o tiendas departamentales.
              </p>
            </div>

            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center font-extrabold text-[20px]">
                <ReviewCaseIcon size={24} />
              </div>
              <h2 className="m-0 text-[19px] font-bold text-[#17131F]">Imposibilidad de pago</h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Presentar dificultades reales para liquidar los pagos mínimos mensuales requeridos por tus acreedores.
              </p>
            </div>

            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E9F8FA] text-[#1E8A9B] flex items-center justify-center font-extrabold text-[20px]">
                <CostClarityIcon size={24} />
              </div>
              <h2 className="m-0 text-[19px] font-bold text-[#17131F]">Compromiso de ahorro</h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Contar con ingresos recurrentes para realizar una aportación mensual fija a tu cuenta de ahorro para liquidar.
              </p>
            </div>
          </div>

          {/* Deep Guide Banner */}
          <div className="bg-gradient-to-r from-[#157A5A] to-[#0E5B42] text-white rounded-[24px] p-[28px] sm:p-[36px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[20px] font-extrabold text-white">
                ¿Quieres ver el checklist de documentación detallado?
              </span>
              <span className="text-[14px] text-[#D1F2E5]">
                Consulta la guía completa de documentos (INE, comprobantes, estados de cuenta).
              </span>
            </div>
            <Link
              href="/recursos/requisitos-para-iniciar-plan-de-liquidacion"
              className="inline-flex items-center justify-center bg-white text-[#0E5B42] font-extrabold text-[15px] h-[46px] px-[24px] rounded-full hover:bg-[#F1FAF6] transition-all shadow-sm shrink-0"
            >
              Ver checklist de documentos →
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
