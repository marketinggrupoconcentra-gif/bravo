"use client";

import React from "react";
import Link from "next/link";
import {
  GuideIcon,
  RequirementsIcon,
  CreditCardArticleIcon,
  DataProtectionIcon,
  ReviewCaseIcon,
  NegotiationIcon,
} from "@/components/icons/bravo";

export function SeoModule() {
  return (
    <section
      id="recursos"
      className="py-[72px] lg:py-[104px] bg-[#FFFFFF] border-b border-[#E7E3EC] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-[120px] left-[5%] w-[550px] h-[550px] rounded-full opacity-[0.06] blur-[110px] animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[100px] right-[5%] w-[550px] h-[550px] rounded-full opacity-[0.07] blur-[110px] animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />

      <div className="bravo-container flex flex-col gap-[48px] relative z-10">
        {/* ===================================================================
            HEADER: Bold Editorial Split Header
            =================================================================== */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[24px] border-b border-[#EAE5EF] pb-[32px] reveal-init">
          <div className="flex flex-col gap-2.5 max-w-[780px]">
            <div className="inline-flex self-start items-center gap-2 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3.5 py-1 rounded-full shadow-2xs">
              <span>GUÍA EDUCATIVA Y LEGAL 2026</span>
            </div>
            <h2 className="m-0 text-[32px] sm:text-[40px] lg:text-[46px] font-extrabold tracking-[-0.035em] text-[#17131F] leading-[1.08]">
              Cómo negociar y liquidar una deuda bancaria en México sin caer en fraudes
            </h2>
          </div>

          <div className="flex flex-col gap-1 text-[13.5px] text-[#8A8095] lg:text-right shrink-0">
            <span className="text-[#5B5266] font-medium text-[13px]">
              Guía de referencia educativa · 2026
            </span>
          </div>
        </div>

        {/* ===================================================================
            MIDDLE: 3 Dynamic Pillar Cards (Fluid & Elevated)
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {/* Pillar 1 */}
          <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[26px] flex flex-col justify-between gap-4 shadow-xs hover:shadow-md hover:border-[#5B2C72] transition-all group reveal-init stagger-1">
            <div className="flex flex-col gap-3">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72] group-hover:scale-105 transition-transform">
                <ReviewCaseIcon size={20} />
              </div>
              <h3 className="m-0 text-[18px] font-extrabold text-[#17131F]">
                1. Liquidación con Quita Formal
              </h3>
              <p className="m-0 text-[14px] text-[#5B5266] leading-[1.6]">
                Es un convenio directo con el acreedor para liquidar el saldo mediante un pago acordado por escrito. Las condiciones dependen de cada institución y de la situación específica del caso. El convenio se formaliza mediante una <strong className="text-[#17131F]">Carta Finiquito</strong>.
              </p>
            </div>
            <div className="text-[12px] font-mono font-bold text-[#5B2C72] uppercase tracking-wider pt-2 border-t border-[#EAE5EF]/60">
              NEGOCIACIÓN DIRECTA CON EL ACREEDOR
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[26px] flex flex-col justify-between gap-4 shadow-xs hover:shadow-md hover:border-[#157A5A] transition-all group reveal-init stagger-2">
            <div className="flex flex-col gap-3">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#F1FAF6] border border-[#C6E6D9] flex items-center justify-center shrink-0 text-[#157A5A] group-hover:scale-105 transition-transform">
                <NegotiationIcon size={20} />
              </div>
              <h3 className="m-0 text-[18px] font-extrabold text-[#17131F]">
                2. Ahorro en Cuenta a tu Nombre
              </h3>
              <p className="m-0 text-[14px] text-[#5B5266] leading-[1.6]">
                No entregas dinero a terceros: aportas mensualmente a un fondo propio y solo se desembolsa una vez formalizado el descuento y verificado el convenio con la entidad bancaria.
              </p>
            </div>
            <div className="text-[12px] font-mono font-bold text-[#157A5A] uppercase tracking-wider pt-2 border-t border-[#EAE5EF]/60">
              TU DINERO EN CUENTA PROPIA
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[26px] flex flex-col justify-between gap-4 shadow-xs hover:shadow-md hover:border-[#C53030] transition-all group reveal-init stagger-3">
            <div className="flex flex-col gap-3">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-[#FFF5F5] border border-[#F5C6C6] flex items-center justify-center shrink-0 text-[#C53030] group-hover:scale-105 transition-transform">
                <DataProtectionIcon size={20} />
              </div>
              <h3 className="m-0 text-[18px] font-extrabold text-[#17131F]">
                3. Alerta Ante Fraudes Digitales
              </h3>
              <p className="m-0 text-[14px] text-[#5B5266] leading-[1.6]">
                Ninguna empresa legítima puede <strong className="text-[#C53030]">“borrar tu Buró al instante”</strong> ni debe pedirte contraseñas bancarias. Desconfía de gestores informales que prometen soluciones milagro.
              </p>
            </div>
            <div className="text-[12px] font-mono font-bold text-[#C53030] uppercase tracking-wider pt-2 border-t border-[#EAE5EF]/60">
              SEGURIDAD Y PROTECCIÓN LEGAL
            </div>
          </div>
        </div>

        {/* ===================================================================
            COMPARISON MATRIX (Modern Asymmetric Presentation)
            =================================================================== */}
        <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[26px] p-[28px] sm:p-[36px] lg:p-[44px] flex flex-col gap-[26px] shadow-sm reveal-init">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
            <div className="flex flex-col gap-1">
              <h3 className="m-0 text-[22px] sm:text-[26px] font-extrabold tracking-[-0.025em] text-[#17131F]">
                Comparativa de alternativas ante una deuda bancaria elevada
              </h3>
              <p className="m-0 text-[14.5px] text-[#5B5266]">
                Analiza el costo real, los riesgos y el resultado antes de tomar una decisión:
              </p>
            </div>
          </div>

          {/* Desktop Table View (High Contrast) */}
          <div className="hidden md:block overflow-hidden rounded-[18px] border border-[#C9C1D4] shadow-xs">
            <table className="w-full text-left border-collapse text-[14.5px]">
              <thead>
                <tr className="bg-[#F5EDF9] text-[#17131F] border-b border-[#C9C1D4]">
                  <th className="p-4 font-extrabold text-[14.5px]">Alternativa</th>
                  <th className="p-4 font-extrabold text-[14.5px]">Costo e Intereses</th>
                  <th className="p-4 font-extrabold text-[14.5px]">Acompañamiento</th>
                  <th className="p-4 font-extrabold text-[14.5px]">Resultado Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5EF] bg-white">
                {/* Row 1 */}
                <tr className="hover:bg-[#FAF8FB] transition-colors">
                  <td className="p-4 font-bold text-[#17131F]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A8095]" />
                      Pagar el mínimo mensual
                    </div>
                  </td>
                  <td className="p-4 text-[#5B5266]">
                    <span className="font-semibold text-[#8C201B]">Intereses elevados</span> · el saldo puede crecer con el tiempo dependiendo de la tasa y pagos realizados
                  </td>
                  <td className="p-4 text-[#5B5266]">Sin acompañamiento; cobros frecuentes de la institución</td>
                  <td className="p-4 text-[#5B5266]">
                    <span className="inline-block bg-[#F4F2F6] text-[#5B5266] text-[12px] font-bold px-2.5 py-1 rounded-md">
                      Plazo extendido de pago
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-[#FAF8FB] transition-colors">
                  <td className="p-4 font-bold text-[#17131F]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A8095]" />
                      Consolidar con nuevo crédito
                    </div>
                  </td>
                  <td className="p-4 text-[#5B5266]">
                    Tasa fija de un nuevo préstamo bancario
                  </td>
                  <td className="p-4 text-[#5B5266]">Limitado al trámite inicial</td>
                  <td className="p-4 text-[#5B5266]">
                    <span className="inline-block bg-[#F4F2F6] text-[#5B5266] text-[12px] font-bold px-2.5 py-1 rounded-md">
                      Riesgo de sobreendeudamiento
                    </span>
                  </td>
                </tr>

                {/* Row 3: Bravo Highlighted */}
                <tr className="bg-[#FAF4FC] border-t-2 border-b-2 border-[#5B2C72]">
                  <td className="p-4 font-extrabold text-[#5B2C72]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#5B2C72] flex items-center justify-center text-white">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Programa Bravo México
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-[#157A5A]">
                    Descuento negociado según condiciones del caso, sin intereses en marcha
                  </td>
                  <td className="p-4 font-bold text-[#5B2C72]">
                    Asesor 1 a 1 + Negociación activa con acreedores
                  </td>
                  <td className="p-4 font-extrabold text-[#5B2C72]">
                    <span className="inline-block bg-[#F5EDF9] text-[#5B2C72] text-[12.5px] font-extrabold px-3 py-1 rounded-md border border-[#DDCBE6]">
                      Liquidación total con carta finiquito
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card Presentation */}
          <div className="md:hidden flex flex-col gap-3 text-[14px]">
            <div className="bg-white p-4 rounded-[16px] border border-[#E7E3EC] flex flex-col gap-2">
              <span className="font-bold text-[#17131F]">Pagar el mínimo mensual:</span>
              <span className="text-[#8C201B] font-semibold">Intereses elevados que pueden extender el plazo de pago según las condiciones del crédito.</span>
            </div>
            <div className="bg-white p-4 rounded-[16px] border border-[#E7E3EC] flex flex-col gap-2">
              <span className="font-bold text-[#17131F]">Consolidar con nuevo crédito:</span>
              <span className="text-[#5B5266]">Tasa fija, pero alto riesgo de sobreendeudamiento.</span>
            </div>
            <div className="bg-[#F5EDF9] p-4 rounded-[16px] border-2 border-[#5B2C72] flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[#5B2C72]">Programa Bravo México:</span>
              </div>
              <span className="text-[#17131F] font-semibold">
                Descuento negociado directamente con el acreedor y carta finiquito formal.
              </span>
            </div>
          </div>

          {/* In-Article Contextual CTA Banner */}
          <div className="bg-gradient-to-r from-[#5B2C72] to-[#3B1F4A] text-white rounded-[20px] p-[24px] sm:p-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[18px] sm:text-[20px] font-extrabold text-white">
                ¿Quieres conocer qué opciones pueden aplicar en tu caso?
              </span>
              <span className="text-[14px] text-[#DDCBE6]">
                Evaluación inicial gratuita y confidencial. Esta evaluación no consulta tu Buró de Crédito.
              </span>
            </div>
            <Link
              href="#precalificar"
              className="bravo-btn-cyan whitespace-nowrap shadow-md"
            >
              Revisar mi caso
            </Link>
          </div>
        </div>

        {/* ===================================================================
            3 COMPLEMENTARY EDITORIAL RESOURCE CARDS
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {/* Card 1 */}
          <div className="bg-white border-t-4 border-t-[#5B2C72] border-x border-b border-[#E7E3EC] rounded-[20px] p-[24px] flex flex-col justify-between gap-[16px] hover:shadow-lg hover:-translate-y-1 transition-all reveal-init stagger-1">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] uppercase font-bold">
                <GuideIcon size={16} />
                <span>GUÍA DE APOYO</span>
              </div>
              <h3 className="m-0 text-[18px] font-bold text-[#17131F] leading-snug">
                Cómo priorizar pagos cuando tienes múltiples tarjetas de crédito
              </h3>
              <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                Aprende la diferencia entre el método bola de nieve y tasa más alta para reducir el estrés financiero en tu hogar.
              </p>
            </div>
            <Link
              href="/recursos/como-priorizar-pagos-multiples-tarjetas-de-credito"
              className="text-[14px] font-bold text-[#5B2C72] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Leer recomendaciones →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-t-4 border-t-[#157A5A] border-x border-b border-[#E7E3EC] rounded-[20px] p-[24px] flex flex-col justify-between gap-[16px] hover:shadow-lg hover:-translate-y-1 transition-all reveal-init stagger-2">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#157A5A] uppercase font-bold">
                <RequirementsIcon size={16} />
                <span>REQUISITOS</span>
              </div>
              <h3 className="m-0 text-[18px] font-bold text-[#17131F] leading-snug">
                Qué documentos necesitas tener a la mano para iniciar tu plan
              </h3>
              <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                Conoce la documentación básica requerida únicamente cuando decides continuar con el programa de ahorro.
              </p>
            </div>
            <Link
              href="/recursos/requisitos-para-iniciar-plan-de-liquidacion"
              className="text-[14px] font-bold text-[#157A5A] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Ver requisitos →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-t-4 border-t-[#1E8A9B] border-x border-b border-[#E7E3EC] rounded-[20px] p-[24px] flex flex-col justify-between gap-[16px] hover:shadow-lg hover:-translate-y-1 transition-all reveal-init stagger-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#1E8A9B] uppercase font-bold">
                <CreditCardArticleIcon size={16} />
                <span>DEUDA DEPARTAMENTAL</span>
              </div>
              <h3 className="m-0 text-[18px] font-bold text-[#17131F] leading-snug">
                Diferencias entre negociar con bancos y tiendas departamentales
              </h3>
              <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                Por qué las tiendas comerciales tienen políticas de cobranza distintas y cómo abordarlas de manera legal y estructurada.
              </p>
            </div>
            <Link
              href="/recursos/diferencias-negociar-bancos-vs-tiendas-departamentales"
              className="text-[14px] font-bold text-[#1E8A9B] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Ver diferencias →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
