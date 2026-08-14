import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  CreditCardArticleIcon,
  NegotiationIcon,
  ReviewCaseIcon,
  CostClarityIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Diferencias al Negociar Deudas Bancarias vs. Departamentales en México | Bravo",
  description: "Entiende cómo operan las políticas de cobranza, descuentos por quita y regulación entre bancos y tiendas departamentales (Liverpool, Coppel, Elektra, Sears) en México.",
};

export default function DeudaDepartamentalVsBancariaPage() {
  return (
    <>
      <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
        {/* Ambient Glows */}
        <div
          className="pointer-events-none absolute -top-[120px] left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #1E8A9B 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-[100px] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)", animationDelay: "4s" }}
        />

        <div className="bravo-container relative z-10 max-w-[1080px]">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/recursos" className="hover:text-[#5B2C72] transition-colors">Recursos</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold truncate">Bancos vs. Departamentales</span>
          </nav>

          {/* Article Header */}
          <header className="flex flex-col gap-4 border-b border-[#EAE5EF] pb-8 mb-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#1E8A9B] uppercase tracking-widest font-extrabold bg-[#E9F8FA] border border-[#BEE7ED] px-3 py-1 rounded-full shadow-2xs">
                <CreditCardArticleIcon size={14} />
                <span>ANÁLISIS FINANCIERO Y DE COBRANZA EN MÉXICO</span>
              </span>
              <span className="text-[13px] text-[#8A8095]">· 5 min de lectura · Regulación CONDUSEF / PROFECO</span>
            </div>

            <h1 className="m-0 text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-[-0.035em] text-[#17131F] leading-[1.08]">
              Diferencias entre negociar deudas con bancos y tiendas departamentales
            </h1>

            <p className="m-0 text-[17px] sm:text-[19px] leading-[1.65] text-[#5B5266]">
              Negociar con Liverpool, Coppel, Elektra, Sears o Palacio de Hierro requiere una estrategia distinta a la que se utiliza con BBVA, Banamex o Santander. Conoce el marco legal, los tiempos de quita y cómo proteger tu tranquilidad.
            </p>
          </header>

          {/* Key Differences Box */}
          <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[24px] sm:p-[32px] mb-10 shadow-xs">
            <h2 className="m-0 text-[18px] font-extrabold text-[#17131F] mb-4 flex items-center gap-2">
              <div className="w-[24px] h-[24px] rounded-[6px] bg-[#E9F8FA] border border-[#BEE7ED] flex items-center justify-center shrink-0 text-[#1E8A9B]">
                <CreditCardArticleIcon size={14} />
              </div>
              <span>Comparativa directa de entidades</span>
            </h2>

            <div className="overflow-hidden rounded-[16px] border border-[#C9C1D4] shadow-xs">
              <table className="w-full text-left border-collapse text-[14.5px]">
                <thead>
                  <tr className="bg-[#E9F8FA] text-[#17131F] border-b border-[#BEE7ED]">
                    <th className="p-4 font-bold">Elemento</th>
                    <th className="p-4 font-bold">Instituciones Bancarias</th>
                    <th className="p-4 font-bold">Tiendas Comerciales / Departamentales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5EF] bg-white">
                  <tr>
                    <td className="p-4 font-bold text-[#17131F]">Regulador principal</td>
                    <td className="p-4 text-[#5B5266]">CONDUSEF / CNBV / Banxico</td>
                    <td className="p-4 text-[#5B5266]">PROFECO o CONDUSEF (según emisor SOFOM)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[#17131F]">Canal de cobranza</td>
                    <td className="p-4 text-[#5B5266]">Despachos externos certificados (REDECO)</td>
                    <td className="p-4 text-[#5B5266]">Cobranza directa, llamadas y visitas domiciliarias</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[#17131F]">Tiempos de quita</td>
                    <td className="p-4 text-[#5B5266]">Campañas semestrales estructuradas</td>
                    <td className="p-4 text-[#5B5266]">Negociaciones puntuales con gerencias de crédito</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[#17131F]">Descuento promedio</td>
                    <td className="p-4 text-[#157A5A] font-bold">50% a 70% sobre saldo total</td>
                    <td className="p-4 text-[#157A5A] font-bold">40% a 65% según antigüedad de mora</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex flex-col gap-8 text-[16.5px] sm:text-[17.5px] leading-[1.75] text-[#3A3344]">
            <section className="flex flex-col gap-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                1. ¿Por qué la cobranza departamental suele ser más insistente?
              </h2>
              <p className="m-0">
                Las tiendas comerciales y cadenas departamentales suelen operar con sus propios departamentos de cobranza interna antes de transferir las cuentas a agencias externas. Esto se traduce en un volumen mayor de recordatorios telefónicos y, en ocasiones, visitas domiciliarias.
              </p>
              <p className="m-0">
                <strong className="text-[#17131F]">Tus derechos en México:</strong> La ley prohíbe que cualquier cobrador realice amenazas, use lenguaje intimidatorio, pegue avisos en la fachada de tu domicilio o contacte a personas que no sean avales. Las quejas por cobranza indebida se canalizan mediante REDECO ante CONDUSEF o PROFECO.
              </p>
            </section>

            <section className="flex flex-col gap-4 pt-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                2. ¿Cómo se negocia una quita con tiendas como Liverpool o Coppel?
              </h2>
              <p className="m-0">
                A diferencia de los bancos tradicionales que manejan criterios matemáticos estandarizados de riesgo, las tiendas departamentales manejan esquemas de negociación basados en la antigüedad de la cuenta y la capacidad comprobada de pago del deudor.
              </p>
              <p className="m-0">
                En Bravo contamos con canales de enlace formal con las principales cadenas comerciales de México, permitiendo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
                <div className="bg-[#FBFAFC] border border-[#E7E3EC] p-4 rounded-[16px] flex flex-col gap-1.5">
                  <span className="font-bold text-[#17131F]">1. Canalización de llamadas</span>
                  <span className="text-[13px] text-[#5B5266]">
                    Nuestros negociadores asumen la interlocución formal con el área de cobranza.
                  </span>
                </div>
                <div className="bg-[#FBFAFC] border border-[#E7E3EC] p-4 rounded-[16px] flex flex-col gap-1.5">
                  <span className="font-bold text-[#17131F]">2. Congelamiento y descuento</span>
                  <span className="text-[13px] text-[#5B5266]">
                    Buscamos convenios de descuento sustancial sobre el saldo real sin cobros abusivos.
                  </span>
                </div>
                <div className="bg-[#FBFAFC] border border-[#E7E3EC] p-4 rounded-[16px] flex flex-col gap-1.5">
                  <span className="font-bold text-[#17131F]">3. Carta Finiquito Comercial</span>
                  <span className="text-[13px] text-[#5B5266]">
                    Validamos que la tienda emita el documento legal que extingue el 100% del adeudo.
                  </span>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 pt-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                3. Agrupar deudas bancarias y departamentales en un solo plan
              </h2>
              <p className="m-0">
                Si tienes deudas combinadas (por ejemplo, una tarjeta bancaria Banorte y dos tarjetas departamentales Liverpool y Coppel), el programa Bravo te permite integrar todas tus cuentas en un <strong className="text-[#17131F]">único plan mensual de ahorro cómodo</strong>, negociando cada institución en el momento en que se obtenga el descuento más alto.
              </p>
            </section>

            {/* In-Article CTA */}
            <div className="bg-gradient-to-r from-[#1E8A9B] to-[#125863] text-white rounded-[24px] p-[28px] sm:p-[36px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg my-6">
              <div className="flex flex-col gap-1">
                <span className="text-[20px] font-extrabold text-white">
                  ¿Tienes deudas bancarias o departamentales acumuladas?
                </span>
                <span className="text-[14px] text-[#BEE7ED]">
                  Revisa tu caso con un asesor y conoce cuánto puedes ahorrar hoy.
                </span>
              </div>
              <Link
                href="/formulario"
                className="bravo-btn-cyan whitespace-nowrap shadow-md font-extrabold"
              >
                Solicitar diagnóstico sin costo
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Global Final CTA */}
      <FinalCta />
    </>
  );
}
