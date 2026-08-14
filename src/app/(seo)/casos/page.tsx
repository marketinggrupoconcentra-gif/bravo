import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { CaseComponent } from "@/components/sections/CaseComponent";
import { FinalCta } from "@/components/sections/FinalCta";
import { ReviewCaseIcon, CostClarityIcon, NegotiationIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Casos de Éxito y Liquidación de Deudas | Bravo México",
  description: "Conoce ejemplos reales y simulaciones de cómo personas en México redujeron hasta 65% de sus deudas bancarias y departamentales con Bravo.",
};

export default function CasosPage() {
  return (
    <>
      <header className="py-[48px] lg:py-[72px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[1080px]">
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-4">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Casos de Éxito</span>
          </nav>

          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <NegotiationIcon size={14} />
              <span>RESULTADOS REALES MÉXICO</span>
            </div>
            <h1 className="m-0 text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
              Casos reales de liquidación con descuento formal
            </h1>
            <p className="m-0 text-[16px] sm:text-[18px] text-[#5B5266] max-w-[760px] leading-relaxed">
              Descubre cómo ayudamos a miles de familias mexicanas a liquidar tarjetas de crédito y préstamos con cartas finiquito bancarias.
            </p>
          </div>
        </div>
      </header>

      {/* Interactive Case Simulator */}
      <CaseComponent />

      {/* Real Case Breakdowns Grid */}
      <section className="py-[64px] lg:py-[88px] bg-white border-b border-[#E7E3EC]">
        <div className="bravo-container max-w-[1080px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[26px] sm:text-[32px] font-extrabold text-[#17131F]">
              Historias y convenios representativos
            </h2>
            <p className="m-0 text-[15.5px] text-[#5B5266]">
              Casos resueltos ante bancos e instituciones comerciales con quita legal autorizada:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono font-bold text-[#5B2C72] uppercase">BBVA + SANTANDER</span>
                  <span className="text-[13px] font-extrabold text-[#157A5A] bg-[#F1FAF6] px-2.5 py-1 rounded-full border border-[#C6E6D9]">
                    62% Ahorro
                  </span>
                </div>
                <h3 className="m-0 text-[18px] font-bold text-[#17131F]">3 Tarjetas de Crédito</h3>
                <div className="space-y-1.5 text-[14px]">
                  <div className="flex justify-between text-[#5B5266]">
                    <span>Deuda inicial:</span>
                    <strong className="text-[#17131F] line-through">$184,000 MXN</strong>
                  </div>
                  <div className="flex justify-between text-[#157A5A]">
                    <span className="font-bold">Liquidado por:</span>
                    <strong className="text-[16px] font-extrabold">$69,920 MXN</strong>
                  </div>
                  <div className="text-[12.5px] text-[#8A8095] pt-1">
                    Plazo de ahorro: 18 meses · Carta finiquito emitida.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono font-bold text-[#5B2C72] uppercase">CITIBANAMEX</span>
                  <span className="text-[13px] font-extrabold text-[#157A5A] bg-[#F1FAF6] px-2.5 py-1 rounded-full border border-[#C6E6D9]">
                    58% Ahorro
                  </span>
                </div>
                <h3 className="m-0 text-[18px] font-bold text-[#17131F]">Préstamo Personal</h3>
                <div className="space-y-1.5 text-[14px]">
                  <div className="flex justify-between text-[#5B5266]">
                    <span>Deuda inicial:</span>
                    <strong className="text-[#17131F] line-through">$120,000 MXN</strong>
                  </div>
                  <div className="flex justify-between text-[#157A5A]">
                    <span className="font-bold">Liquidado por:</span>
                    <strong className="text-[16px] font-extrabold">$50,400 MXN</strong>
                  </div>
                  <div className="text-[12.5px] text-[#8A8095] pt-1">
                    Plazo de ahorro: 14 meses · Cuenta cerrada formalmente.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-mono font-bold text-[#5B2C72] uppercase">LIVERPOOL + BANORTE</span>
                  <span className="text-[13px] font-extrabold text-[#157A5A] bg-[#F1FAF6] px-2.5 py-1 rounded-full border border-[#C6E6D9]">
                    65% Ahorro
                  </span>
                </div>
                <h3 className="m-0 text-[18px] font-bold text-[#17131F]">Departamental + Bancaria</h3>
                <div className="space-y-1.5 text-[14px]">
                  <div className="flex justify-between text-[#5B5266]">
                    <span>Deuda inicial:</span>
                    <strong className="text-[#17131F] line-through">$310,000 MXN</strong>
                  </div>
                  <div className="flex justify-between text-[#157A5A]">
                    <span className="font-bold">Liquidado por:</span>
                    <strong className="text-[16px] font-extrabold">$108,500 MXN</strong>
                  </div>
                  <div className="text-[12.5px] text-[#8A8095] pt-1">
                    Plazo de ahorro: 22 meses · Ambas cuentas finiquitadas.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
