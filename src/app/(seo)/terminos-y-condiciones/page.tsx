import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ReviewCaseIcon, CostClarityIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | Bravo México",
  description: "Términos y condiciones legales que rigen el uso del sitio web y los servicios de asesoría e intermediación de liquidación de deudas de Bravo México.",
};

export default function TerminosCondicionesPage() {
  return (
    <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
      <div className="bravo-container relative z-10 max-w-[960px]">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
          <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-[#17131F] font-semibold">Términos y Condiciones</span>
        </nav>

        <header className="flex flex-col gap-3 border-b border-[#EAE5EF] pb-6 mb-8">
          <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
            <CostClarityIcon size={14} />
            <span>TÉRMINOS LEGALES Y DE SERVICIO</span>
          </div>

          <h1 className="m-0 text-[32px] sm:text-[42px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
            Términos y Condiciones de Uso
          </h1>

          <div className="text-[13.5px] text-[#8A8095]">
            Vigentes a partir de Agosto de 2026 · Legislación aplicable: Estados Unidos Mexicanos
          </div>
        </header>

        <div className="flex flex-col gap-6 text-[15.5px] leading-[1.75] text-[#3A3344]">
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">1. Objeto y Aceptación</h2>
            <p className="m-0">
              El presente documento establece los términos y condiciones generales aplicables al acceso y uso del sitio web operado por <strong>Go Bravo Soluciones, S.A.P.I. de C.V.</strong> (“Bravo México”). Al acceder o ingresar información en este portal, el usuario acepta de manera expresa los presentes términos.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">2. Naturaleza de los Servicios</h2>
            <p className="m-0">
              Bravo México opera como una <strong>reparadora y mediadora de crédito independiente</strong>. Nuestros servicios consisten en el análisis financiero, estructuración de programas de ahorro voluntario y la intermediación en negociaciones de quita y descuento con instituciones bancarias, comerciales y crediticias en México.
            </p>
            <p className="m-0">
              <strong>Aclaración regulatoria:</strong> Bravo México no es una institución bancaria ni capta recursos del público en general. Los fondos de ahorro para liquidación permanecen en cuentas o fideicomisos a nombre del titular contratante.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">3. Carácter Informativo de la Precalificación</h2>
            <p className="m-0">
              Las calculadoras, simuladores y formularios iniciales presentados en este portal son de carácter meramente informativo e ilustrativo. Ningún porcentaje de descuento o plazo se considerará vinculante hasta la formalización de un contrato de prestación de servicios debidamente firmado y revisado con su asesor.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">4. Derechos de Propiedad Intelectual</h2>
            <p className="m-0">
              Todas las marcas, logotipos, textos, diseños, gráficos, código fuente y elementos visuales contenidos en este portal son propiedad exclusiva de Go Bravo Soluciones S.A.P.I. de C.V. o cuentan con las licencias de uso correspondientes.
            </p>
          </section>

          <div className="border-t border-[#EAE5EF] pt-6 mt-4 flex justify-between items-center text-[13.5px] text-[#8A8095]">
            <span>Go Bravo Soluciones S.A.P.I. de C.V. · Ciudad de México</span>
            <Link href="/" className="text-[#5B2C72] font-bold hover:underline">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
