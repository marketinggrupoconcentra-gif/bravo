import React from "react";
import { Hero } from "@/components/sections/Hero";
import { FinalCta } from "@/components/sections/FinalCta";
import { CreditCardIcon, PersonalLoanIcon, RetailDebtIcon } from "@/components/icons/bravo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluciones de Deuda | Bravo México",
  description: "Conoce los tipos de deudas bancarias y departamentales que podemos negociar para ti en México.",
};

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
      <section className="py-[64px] lg:py-[96px] bg-[#F1EEF3]">
        <div className="bravo-container flex flex-col gap-[36px]">
          <div className="text-center max-w-[680px] mx-auto flex flex-col gap-2">
            <h2 className="m-0 text-[30px] sm:text-[36px] font-extrabold text-[#17131F]">
              Tipos de deudas que resolvemos
            </h2>
            <p className="m-0 text-[16px] text-[#5B5266]">
              Negociamos directamente con las principales instituciones financieras del país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white border border-[#E7E3EC] rounded-[20px] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center">
                <CreditCardIcon size={24} />
              </div>
              <h3 className="text-[20px] font-bold text-[#17131F] m-0">Tarjetas de Crédito</h3>
              <p className="text-[15px] text-[#3A3344] leading-relaxed m-0">
                Bancarias tradicionales de BBVA, Banamex, Santander, Banorte, HSBC y más.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E7E3EC] rounded-[20px] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center">
                <PersonalLoanIcon size={24} />
              </div>
              <h3 className="text-[20px] font-bold text-[#17131F] m-0">Préstamos Personales</h3>
              <p className="text-[15px] text-[#3A3344] leading-relaxed m-0">
                Créditos de nómina y préstamos personales sin garantía hipotecaria.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E7E3EC] rounded-[20px] shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center">
                <RetailDebtIcon size={24} />
              </div>
              <h3 className="text-[20px] font-bold text-[#17131F] m-0">Tarjetas Departamentales</h3>
              <p className="text-[15px] text-[#3A3344] leading-relaxed m-0">
                Liverpool, Palacio de Hierro, Sears, Coppel y cadenas comerciales afines.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
