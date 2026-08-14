import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  GuideIcon,
  ReviewCaseIcon,
  CostClarityIcon,
  DataProtectionIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Cómo priorizar pagos con múltiples tarjetas de crédito en México | Bravo",
  description: "Guía práctica sobre los métodos Bola de Nieve y Avalancha para organizar pagos de tarjetas de crédito en México con tasas e intereses reales.",
};

export default function PriorizarPagosPage() {
  return (
    <>
      <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
        {/* Ambient Glows */}
        <div
          className="pointer-events-none absolute -top-[120px] left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-[100px] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)", animationDelay: "4s" }}
        />

        <div className="bravo-container relative z-10 max-w-[1080px]">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/recursos" className="hover:text-[#5B2C72] transition-colors">Recursos</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold truncate">Priorizar Múltiples Tarjetas</span>
          </nav>

          {/* Article Header */}
          <header className="flex flex-col gap-4 border-b border-[#EAE5EF] pb-8 mb-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
                <GuideIcon size={14} />
                <span>GUÍA DE FINANZAS PERSONALES MÉXICO</span>
              </span>
              <span className="text-[13px] text-[#8A8095]">· 5 min de lectura · Actualizado 2026</span>
            </div>

            <h1 className="m-0 text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-[-0.035em] text-[#17131F] leading-[1.08]">
              Cómo priorizar pagos cuando tienes múltiples tarjetas de crédito en México
            </h1>

            <p className="m-0 text-[17px] sm:text-[19px] leading-[1.65] text-[#5B5266]">
              Tener dos, tres o más tarjetas de crédito al tope suele fragmentar los ingresos familiares. Aprende a aplicar el método matemático de Avalancha o el método psicológico de Bola de Nieve para recuperar el control sin caer en sobreendeudamiento.
            </p>
          </header>

          {/* Key Takeaways Box */}
          <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[24px] sm:p-[32px] mb-10 shadow-xs">
            <h2 className="m-0 text-[18px] font-extrabold text-[#17131F] mb-3 flex items-center gap-2">
              <div className="w-[24px] h-[24px] rounded-[6px] bg-[#F5EDF9] border border-[#DDCBE6] flex items-center justify-center shrink-0 text-[#5B2C72]">
                <GuideIcon size={14} />
              </div>
              <span>Lo esencial de esta guía</span>
            </h2>
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[14.5px] text-[#3A3344] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#157A5A] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>El pago mínimo no amortiza:</strong> En México, hasta el 85% de tu pago mínimo se va a intereses e IVA, extendiendo la deuda por años.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#157A5A] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Método Avalancha (Tasa Más Alta):</strong> Ahorra el mayor dinero en intereses al liquidar primero las tarjetas con CAT más elevado.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#157A5A] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Método Bola de Nieve (Saldo Menor):</strong> Otorga victorias rápidas al eliminar cuentas pequeñas primero, liberando flujo mensual de efectivo.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#157A5A] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Límite crítico del 30%:</strong> Si los pagos mínimos superan el 30% de tus ingresos netos, un programa de liquidación con descuento es más viable que seguir pagando mínimos.</span>
              </li>
            </ul>
          </div>

          {/* Content Body */}
          <div className="flex flex-col gap-8 text-[16.5px] sm:text-[17.5px] leading-[1.75] text-[#3A3344]">
            <section className="flex flex-col gap-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                1. El dilema de pagar solo los mínimos en México
              </h2>
              <p className="m-0">
                En el sistema bancario mexicano, la fórmula del pago mínimo regulada por Banco de México contempla generalmente el 1.25% del límite de la línea de crédito o el 1.5% del saldo pendiente más intereses e IVA.
              </p>
              <p className="m-0">
                Esto significa que pagar el mínimo únicamente mantiene la cuenta al corriente frente a Buró de Crédito, pero <strong className="text-[#17131F]">no reduce sustancialmente el capital de la deuda</strong>. Si tienes 3 tarjetas (por ejemplo, BBVA, Banamex y Nu), pagar el mínimo en todas simplemente diluye tus ingresos sin reducir el saldo real.
              </p>
            </section>

            {/* Comparison Table of Strategies */}
            <section className="flex flex-col gap-4 pt-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                2. Comparativa: Método Avalancha vs. Bola de Nieve
              </h2>
              <p className="m-0">
                Ambos métodos exigen que pagues el mínimo en todas tus tarjetas excepto en una, a la cual destinarás todo el dinero extra disponible:
              </p>

              <div className="overflow-hidden rounded-[18px] border border-[#C9C1D4] shadow-xs my-2">
                <table className="w-full text-left border-collapse text-[14.5px]">
                  <thead>
                    <tr className="bg-[#F5EDF9] text-[#17131F] border-b border-[#C9C1D4]">
                      <th className="p-4 font-bold">Criterio</th>
                      <th className="p-4 font-bold">Método Avalancha (Tasa Más Alta)</th>
                      <th className="p-4 font-bold">Método Bola de Nieve (Saldo Menor)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5EF] bg-white">
                    <tr>
                      <td className="p-4 font-bold text-[#17131F]">Prioridad de pago</td>
                      <td className="p-4 text-[#5B5266]">Tarjeta con mayor CAT o tasa de interés anual</td>
                      <td className="p-4 text-[#5B5266]">Tarjeta con el monto adeudado más bajo</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#17131F]">Ventaja principal</td>
                      <td className="p-4 text-[#157A5A] font-semibold">Máximo ahorro matemático en intereses</td>
                      <td className="p-4 text-[#5B2C72] font-semibold">Motivación y flujo de caja rápido al cancelar cuentas</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#17131F]">Perfil recomendado</td>
                      <td className="p-4 text-[#5B5266]">Personas disciplinadas y orientadas a números</td>
                      <td className="p-4 text-[#5B5266]">Personas que buscan reducir estrés eliminando acreedores</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Practical Example */}
            <section className="bg-[#FAF4FC] border-2 border-[#5B2C72] rounded-[22px] p-[24px] sm:p-[32px] flex flex-col gap-4 my-4">
              <h3 className="m-0 text-[20px] font-extrabold text-[#5B2C72]">
                Ejemplo Práctico en México ($120,000 MXN en 3 tarjetas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px]">
                <div className="bg-white p-3.5 rounded-[12px] border border-[#DDCBE6]">
                  <strong className="block text-[#17131F]">Tarjeta 1 (Nu):</strong>
                  <span className="text-[#5B5266]">Deuda: $18,000 MXN<br />Tasa: 78% CAT</span>
                </div>
                <div className="bg-white p-3.5 rounded-[12px] border border-[#DDCBE6]">
                  <strong className="block text-[#17131F]">Tarjeta 2 (BBVA):</strong>
                  <span className="text-[#5B5266]">Deuda: $42,000 MXN<br />Tasa: 65% CAT</span>
                </div>
                <div className="bg-white p-3.5 rounded-[12px] border border-[#DDCBE6]">
                  <strong className="block text-[#17131F]">Tarjeta 3 (Banamex):</strong>
                  <span className="text-[#5B5266]">Deuda: $60,000 MXN<br />Tasa: 55% CAT</span>
                </div>
              </div>
              <p className="m-0 text-[14.5px] text-[#3A3344] leading-relaxed">
                En este ejemplo, el método Bola de Nieve y el método Avalancha coinciden en liquidar primero la <strong>Tarjeta Nu ($18,000 al 78%)</strong>, permitiendo eliminar el primer acreedor en pocos meses y transferir ese pago mensual directamente a la Tarjeta 2.
              </p>
            </section>

            {/* When it's not enough */}
            <section className="flex flex-col gap-4 pt-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                3. ¿Qué hacer cuando tus ingresos ya no alcanzan para pagar los mínimos?
              </h2>
              <p className="m-0">
                Cuando los pagos mínimos superan el 30% o 40% de tu sueldo mensual neto, ninguna de las dos estrategias resulta suficiente porque no existe capital sobrante para amortizar.
              </p>
              <p className="m-0">
                En este escenario, la alternativa legal y formal en México es un <strong className="text-[#17131F]">Programa de Liquidación con Descuento (Quita)</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <div className="bg-[#FAF8FB] border border-[#E7E3EC] p-4 rounded-[16px] flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[#5B2C72] font-bold text-[15px]">
                    <ReviewCaseIcon size={16} />
                    <span>Ahorro mensual protegido</span>
                  </div>
                  <span className="text-[13.5px] text-[#5B5266]">
                    Acumulas una mensualidad fija y cómoda en una cuenta a tu nombre, deteniendo el pago de intereses descontrolados.
                  </span>
                </div>
                <div className="bg-[#FAF8FB] border border-[#E7E3EC] p-4 rounded-[16px] flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[#157A5A] font-bold text-[15px]">
                    <CostClarityIcon size={16} />
                    <span>Descuento de hasta ~60%</span>
                  </div>
                  <span className="text-[13.5px] text-[#5B5266]">
                    Negociadores expertos obtienen cartas finiquito oficiales emitidas directamente por los bancos acreedores.
                  </span>
                </div>
              </div>
            </section>

            {/* In-Article CTA */}
            <div className="bg-gradient-to-r from-[#5B2C72] to-[#3B1F4A] text-white rounded-[24px] p-[28px] sm:p-[36px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg my-6">
              <div className="flex flex-col gap-1">
                <span className="text-[20px] font-extrabold text-white">
                  ¿Tus deudas de tarjetas superan los $50,000 MXN?
                </span>
                <span className="text-[14px] text-[#DDCBE6]">
                  Un asesor de Bravo revisa tu caso sin costo ni consulta previa al buró.
                </span>
              </div>
              <Link
                href="/formulario"
                className="bravo-btn-cyan whitespace-nowrap shadow-md font-extrabold"
              >
                Revisar mi caso gratis
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
