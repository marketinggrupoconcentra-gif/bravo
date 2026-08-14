import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  CreditCardIcon,
  ReviewCaseIcon,
  CostClarityIcon,
  NegotiationIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Liquidación de Tarjetas de Crédito en México con Descuento | Bravo",
  description: "Programa de negociación y liquidación con quita para tarjetas de crédito bancarias (BBVA, Banamex, Santander, Banorte, HSBC, Nu) en México.",
};

export default function TarjetasCreditoPage() {
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
            <span className="text-[#17131F] font-semibold">Tarjetas de Crédito</span>
          </nav>

          <header className="flex flex-col gap-4 border-b border-[#EAE5EF] pb-8 mb-10">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <CreditCardIcon size={14} />
              <span>PROGRAMA PARA TARJETAS BANCARIAS MÉXICO</span>
            </div>

            <h1 className="m-0 text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-[-0.035em] text-[#17131F] leading-[1.08]">
              Liquidación de Deudas de Tarjetas de Crédito con Descuento
            </h1>

            <p className="m-0 text-[17px] sm:text-[19px] leading-[1.65] text-[#5B5266]">
              Cuando el CAT y los intereses sobre saldo promedio diario superan tu capacidad de pago, negociamos un convenio formal de quita con tu banco acreedor para que saldes la cuenta con descuento y obtengas tu carta finiquito.
            </p>
          </header>

          <div className="flex flex-col gap-8 text-[16.5px] sm:text-[17.5px] leading-[1.75] text-[#3A3344]">
            {/* Banks List */}
            <section className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[24px] sm:p-[32px] flex flex-col gap-4">
              <h2 className="m-0 text-[20px] font-extrabold text-[#17131F]">
                Instituciones bancarias que negociamos en México
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[14px]">
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">BBVA México</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">Citibanamex</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">Santander</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">Banorte</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">HSBC México</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">Scotiabank</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">Nu México</div>
                <div className="bg-white p-3 rounded-[12px] border border-[#E7E3EC] font-semibold text-[#17131F] text-center">Banco Azteca</div>
              </div>
            </section>

            <section className="flex flex-col gap-4 pt-2">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                ¿Cómo detenemos el ciclo de endeudamiento de las tarjetas?
              </h2>
              <p className="m-0">
                Las tarjetas de crédito en México tienen tasas de interés que frecuentemente superan el 60% al 85% anual. Al pagar solo el mínimo, la mayor parte de tu pago se destina a cubrir intereses ordinarios, comisiones e IVA, dejando el capital casi intacto.
              </p>
              <p className="m-0">
                En el programa Bravo, definimos una aportación mensual fija a tu medida que se acumula en una cuenta a tu nombre. Con ese fondo negociamos un descuento de hasta el 60% sobre el saldo adeudado, cerrando la cuenta formalmente ante el Buró de Crédito con estatus de liquidada.
              </p>
            </section>

            {/* In-Article CTA */}
            <div className="bg-gradient-to-r from-[#5B2C72] to-[#3B1F4A] text-white rounded-[24px] p-[28px] sm:p-[36px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg my-4">
              <div className="flex flex-col gap-1">
                <span className="text-[20px] font-extrabold text-white">
                  ¿Tienes deudas de tarjetas por más de $50,000 MXN?
                </span>
                <span className="text-[14px] text-[#DDCBE6]">
                  Un asesor revisa tu caso sin costo ni consulta previa al buró.
                </span>
              </div>
              <Link
                href="/formulario"
                className="bravo-btn-cyan whitespace-nowrap shadow-md font-extrabold"
              >
                Revisar mis tarjetas
              </Link>
            </div>
          </div>
        </div>
      </article>

      <FinalCta />
    </>
  );
}
