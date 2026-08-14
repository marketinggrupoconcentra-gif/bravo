import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  CreditCardIcon,
  PersonalLoanIcon,
  RetailDebtIcon,
  ReviewCaseIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Tipos de Deuda que Liquidamos en México | Bravo México",
  description: "Conoce qué deudas son elegibles para negociar quitas y descuentos (tarjetas, préstamos de nómina, tiendas departamentales) y cuáles no aplican.",
};

export default function TiposDeDeudaPage() {
  return (
    <>
      <header className="py-[48px] lg:py-[72px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[1080px]">
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-4">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Tipos de Deuda</span>
          </nav>

          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <ReviewCaseIcon size={14} />
              <span>COBERTURA FINANCIERA MÉXICO</span>
            </div>
            <h1 className="m-0 text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
              Tipos de deuda elegibles para el programa Bravo
            </h1>
            <p className="m-0 text-[16px] sm:text-[18px] text-[#5B5266] max-w-[760px] leading-relaxed">
              Analizamos tu portafolio crediticio para determinar qué cuentas pueden liquidarse con quita formal ante instituciones bancarias y comerciales.
            </p>
          </div>
        </div>
      </header>

      <section className="py-[64px] lg:py-[88px] bg-white border-b border-[#E7E3EC]">
        <div className="bravo-container max-w-[1080px] flex flex-col gap-10">
          {/* Eligible Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjetas */}
            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center">
                <CreditCardIcon size={24} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-mono font-bold text-[#157A5A] uppercase">ELEGIBLE · HASTA 65% DESCUENTO</span>
                <h2 className="m-0 text-[20px] font-bold text-[#17131F]">Tarjetas de Crédito</h2>
                <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                  BBVA, Citibanamex, Santander, Banorte, HSBC, Scotiabank, Nu, Stori y Fintechs reguladas.
                </p>
              </div>
              <Link href="/soluciones/tarjetas-de-credito" className="text-[13.5px] font-bold text-[#5B2C72] hover:underline mt-auto">
                Ver solución para tarjetas →
              </Link>
            </div>

            {/* Préstamos Personales */}
            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center">
                <PersonalLoanIcon size={24} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-mono font-bold text-[#157A5A] uppercase">ELEGIBLE · SIN GARANTÍA</span>
                <h2 className="m-0 text-[20px] font-bold text-[#17131F]">Préstamos Personales y Nómina</h2>
                <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                  Créditos bancarios simples, créditos de nómina y préstamos en línea con SOFOMs acreditadas.
                </p>
              </div>
              <Link href="/soluciones/prestamos-personales" className="text-[13.5px] font-bold text-[#157A5A] hover:underline mt-auto">
                Ver solución para préstamos →
              </Link>
            </div>

            {/* Departamentales */}
            <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-6 flex flex-col gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E9F8FA] text-[#1E8A9B] flex items-center justify-center">
                <RetailDebtIcon size={24} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-mono font-bold text-[#157A5A] uppercase">ELEGIBLE · COMERCIO</span>
                <h2 className="m-0 text-[20px] font-bold text-[#17131F]">Tarjetas Departamentales</h2>
                <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                  Liverpool, Palacio de Hierro, Sears, Coppel, Sanborns y tiendas comerciales nacionales.
                </p>
              </div>
              <Link href="/recursos/diferencias-negociar-bancos-vs-tiendas-departamentales" className="text-[13.5px] font-bold text-[#1E8A9B] hover:underline mt-auto">
                Ver comparativa de tiendas →
              </Link>
            </div>
          </div>

          {/* Non-eligible Accounts Warning Box */}
          <div className="bg-[#FAF8FB] border border-[#C9C1D4] rounded-[22px] p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="m-0 text-[18px] font-bold text-[#17131F]">
              ¿Qué deudas NO entran en el programa de liquidación?
            </h3>
            <p className="m-0 text-[14.5px] text-[#5B5266] leading-relaxed">
              Por mandato de la ley mexicana y su naturaleza jurídica, <strong>no negociamos</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13.5px]">
              <div className="bg-white p-3.5 rounded-[12px] border border-[#E7E3EC] text-[#5B5266]">
                <strong className="block text-[#17131F]">Créditos Hipotecarios</strong>
                (Infonavit, Fovissste o bancos con garantía inmobiliaria).
              </div>
              <div className="bg-white p-3.5 rounded-[12px] border border-[#E7E3EC] text-[#5B5266]">
                <strong className="block text-[#17131F]">Créditos Automotrices</strong>
                (Con prenda o reserva de dominio sobre el vehículo).
              </div>
              <div className="bg-white p-3.5 rounded-[12px] border border-[#E7E3EC] text-[#5B5266]">
                <strong className="block text-[#17131F]">Créditos Gubernamentales</strong>
                (SAT, multas fiscales o adeudos de pensiones).
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
