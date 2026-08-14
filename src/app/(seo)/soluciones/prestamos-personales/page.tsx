import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  PersonalLoanIcon,
  ReviewCaseIcon,
  CostClarityIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Liquidación de Préstamos Personales y de Nómina | Bravo México",
  description: "Negociación y liquidación con descuento de créditos de nómina, préstamos personales y financieras en México.",
};

export default function PrestamosPersonalesPage() {
  return (
    <>
      <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[1080px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/soluciones" className="hover:text-[#5B2C72] transition-colors">Soluciones</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Préstamos Personales</span>
          </nav>

          <header className="flex flex-col gap-4 border-b border-[#EAE5EF] pb-8 mb-10">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <PersonalLoanIcon size={14} />
              <span>PROGRAMA PARA PRÉSTAMOS PERSONALES Y NÓMINA</span>
            </div>

            <h1 className="m-0 text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-[-0.035em] text-[#17131F] leading-[1.08]">
              Liquidación de Préstamos Personales y Créditos de Nómina
            </h1>

            <p className="m-0 text-[17px] sm:text-[19px] leading-[1.65] text-[#5B5266]">
              Si tienes préstamos personales con bancos o financieras que absorben tus quincenas, estructuramos un plan de intermediación para negociar la extinción de la deuda mediante quitas formales con carta finiquito.
            </p>
          </header>

          <div className="flex flex-col gap-8 text-[16.5px] sm:text-[17.5px] leading-[1.75] text-[#3A3344]">
            <section className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[24px] sm:p-[32px] flex flex-col gap-4">
              <h2 className="m-0 text-[20px] font-extrabold text-[#17131F]">
                Créditos personales y de nómina elegibles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px]">
                <div className="bg-white p-4 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
                  <strong className="text-[#17131F]">Préstamos Bancarios</strong>
                  <span className="text-[#5B5266]">Créditos de liquidez sin garantía hipotecaria ni prendaria.</span>
                </div>
                <div className="bg-white p-4 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
                  <strong className="text-[#17131F]">Créditos de Nómina</strong>
                  <span className="text-[#5B5266]">Adeudos de nómina cuando cambiaste de cuenta o existe imposibilidad de pago.</span>
                </div>
                <div className="bg-white p-4 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
                  <strong className="text-[#17131F]">Financieras y SOFOMs</strong>
                  <span className="text-[#5B5266]">Préstamos con entidades financieras reguladas como Creditea, Kueski, etc.</span>
                </div>
              </div>
            </section>

            {/* In-Article CTA */}
            <div className="bg-gradient-to-r from-[#5B2C72] to-[#3B1F4A] text-white rounded-[24px] p-[28px] sm:p-[36px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg my-4">
              <div className="flex flex-col gap-1">
                <span className="text-[20px] font-extrabold text-white">
                  ¿Quieres evaluar tu préstamo personal?
                </span>
                <span className="text-[14px] text-[#DDCBE6]">
                  Evaluación 100% gratuita y sin consulta previa al buró.
                </span>
              </div>
              <Link
                href="/formulario"
                className="bravo-btn-cyan whitespace-nowrap shadow-md font-extrabold"
              >
                Revisar mi préstamo
              </Link>
            </div>
          </div>
        </div>
      </article>

      <FinalCta />
    </>
  );
}
