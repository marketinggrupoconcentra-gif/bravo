import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { CaseComponent } from "@/components/sections/CaseComponent";
import { FinalCta } from "@/components/sections/FinalCta";
import { ReviewCaseIcon, CostClarityIcon, DataProtectionIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Simulador de Liquidación de Deuda con Descuento | Bravo México",
  description: "Calcula en tiempo real cuánto podrías ahorrar al liquidar tus tarjetas y préstamos bancarios en México con un plan de ahorro mensual programado.",
};

export default function SimuladorPage() {
  return (
    <>
      <header className="py-[40px] lg:py-[56px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[1080px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-4">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Simulador de Liquidación</span>
          </nav>

          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <CostClarityIcon size={14} />
              <span>SIMULADOR FINANCIERO MÉXICO</span>
            </div>
            <h1 className="m-0 text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
              Simula tu descuento y plan de ahorro estimado
            </h1>
            <p className="m-0 text-[16px] sm:text-[18px] text-[#5B5266] max-w-[760px] leading-relaxed">
              Mueve los controles para estimar cuánto pagarías con quita bancaria oficial y cuál sería tu aportación mensual recomendada.
            </p>
          </div>
        </div>
      </header>

      {/* Simulator Component */}
      <CaseComponent />

      {/* Pedagogical Breakdown Section */}
      <section className="py-[64px] bg-white border-b border-[#E7E3EC]">
        <div className="bravo-container max-w-[1080px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[26px] sm:text-[32px] font-extrabold text-[#17131F]">
              ¿Cómo calculamos tu escenario de ahorro?
            </h2>
            <p className="m-0 text-[15.5px] text-[#5B5266] leading-relaxed">
              La simulación se basa en miles de casos de liquidación resueltos en México con bancos y tiendas comerciales:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[20px] p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="m-0 text-[17px] font-bold text-[#17131F]">Agrupación del Saldo</h3>
              <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                Sumamos tus deudas de tarjetas y préstamos para calcular el volumen total de negociación frente a las entidades crediticias.
              </p>
            </div>

            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[20px] p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="m-0 text-[17px] font-bold text-[#17131F]">Quita Bancaria Estimada</h3>
              <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                Proyectamos descuentos de entre el 52% y el 68% sobre el saldo adeudado, según la antigüedad de la mora y políticas del acreedor.
              </p>
            </div>

            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[20px] p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9F8FA] text-[#1E8A9B] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="m-0 text-[17px] font-bold text-[#17131F]">Aportación Mensual Fija</h3>
              <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                Dividimos el monto liquidado entre el plazo en meses para que ahorres a tu ritmo sin pagar intereses descontrolados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
