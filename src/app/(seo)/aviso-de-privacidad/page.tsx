import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DataProtectionIcon, ReviewCaseIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Aviso de Privacidad Integral | Bravo México",
  description: "Aviso de Privacidad Integral de Bravo México (Go Bravo Soluciones S.A.P.I. de C.V.) conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).",
};

export default function AvisoPrivacidadPage() {
  return (
    <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
      <div className="bravo-container relative z-10 max-w-[960px]">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
          <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-[#17131F] font-semibold">Aviso de Privacidad</span>
        </nav>

        <header className="flex flex-col gap-3 border-b border-[#EAE5EF] pb-6 mb-8">
          <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
            <DataProtectionIcon size={14} />
            <span>TRANSPARENCIA LEGAL MÉXICO · LFPDPPP</span>
          </div>

          <h1 className="m-0 text-[32px] sm:text-[42px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
            Aviso de Privacidad Integral
          </h1>

          <div className="text-[13.5px] text-[#8A8095]">
            Última actualización: 13 de Agosto de 2026 · Conforme a la legislación federal mexicana
          </div>
        </header>

        <div className="flex flex-col gap-6 text-[15.5px] leading-[1.75] text-[#3A3344]">
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">1. Identidad y Domicilio del Responsable</h2>
            <p className="m-0">
              <strong>Go Bravo Soluciones, S.A.P.I. de C.V.</strong> (en lo sucesivo “Bravo México”), con domicilio corporativo en la Ciudad de México, México, en estricto apego a la <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</em> y su Reglamento, hace de su conocimiento que es el responsable del uso, tratamiento y protección de sus datos personales.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">2. Datos Personales que Recabamos</h2>
            <p className="m-0">
              Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar sus datos personales a través de formularios en línea, llamadas telefónicas y comunicaciones digitales:
            </p>
            <ul className="m-0 pl-5 list-disc flex flex-col gap-1.5 text-[#5B5266]">
              <li><strong>Datos de Identificación y Contacto:</strong> Nombre completo, número telefónico (móvil/fijo), correo electrónico y entidad federativa.</li>
              <li><strong>Datos Financieros y Crediticios (Fase de Evaluación):</strong> Monto estimado de deuda, tipo de crédito (bancario, departamental, personal) e instituciones acreedoras.</li>
            </ul>
            <div className="bg-[#F5EDF9] border border-[#DDCBE6] p-4 rounded-[14px] text-[14px] text-[#5B2C72] font-medium">
              Nota importante: En la fase de precalificación pública web NO se solicitan datos sensibles, contraseñas bancarias, tokens ni números confidenciales de tarjetas.
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">3. Finalidades Primarias del Tratamiento</h2>
            <p className="m-0">Los datos personales recabados serán utilizados para las siguientes finalidades indispensables:</p>
            <ol className="m-0 pl-5 list-decimal flex flex-col gap-1.5 text-[#5B5266]">
              <li>Realizar el diagnóstico preliminar y análisis de viabilidad para el programa de liquidación con descuento.</li>
              <li>Contactarlo vía telefónica, correo electrónico o mensajería instantánea oficial para presentarle su propuesta personalizada.</li>
              <li>En caso de contratación, gestionar la intermediación y negociación de quitas ante los acreedores correspondientes.</li>
            </ol>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">4. Ejercicio de Derechos ARCO</h2>
            <p className="m-0">
              Usted tiene derecho de <strong>Acceder</strong> a sus datos personales, <strong>Rectificarlos</strong> en caso de ser inexactos, <strong>Cancelarlos</strong> cuando considere que no se requieren para las finalidades señaladas, u <strong>Oponerse</strong> al tratamiento de los mismos (Derechos ARCO).
            </p>
            <p className="m-0">
              Para ejercer sus derechos ARCO o revocar su consentimiento, puede enviar su solicitud por escrito al Departamento de Privacidad al correo: <a href="mailto:privacidad@bravocredito.com" className="text-[#5B2C72] font-bold underline">privacidad@bravocredito.com</a> o consultar el procedimiento detallado en nuestra sección de <Link href="/derechos-arco" className="text-[#5B2C72] font-bold underline">Derechos ARCO</Link>.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">5. Transferencia de Datos</h2>
            <p className="m-0">
              Bravo México no vende, renta ni comercializa sus datos personales con terceros. Las transferencias de datos se limitan estrictamente a las necesarias para el cumplimiento del servicio contratado (por ejemplo, con entidades fiduciarias o acreedores directamente involucrados en el convenio de liquidación), siempre con su autorización previa.
            </p>
          </section>

          <div className="border-t border-[#EAE5EF] pt-6 mt-4 flex justify-between items-center text-[13.5px] text-[#8A8095]">
            <span>Go Bravo Soluciones S.A.P.I. de C.V.</span>
            <Link href="/" className="text-[#5B2C72] font-bold hover:underline">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
