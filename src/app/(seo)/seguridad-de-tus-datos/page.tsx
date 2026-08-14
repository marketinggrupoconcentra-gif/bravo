import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { DataProtectionIcon, ReviewCaseIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Seguridad de tus Datos y Encriptación SSL | Bravo México",
  description: "Conoce los protocolos de encriptación SSL de 256 bits, cumplimiento LFPDPPP y estándares de ciberseguridad que protegen tu información en Bravo México.",
};

export default function SeguridadDatosPage() {
  return (
    <>
      <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[960px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Seguridad de tus Datos</span>
          </nav>

          <header className="flex flex-col gap-4 border-b border-[#EAE5EF] pb-8 mb-10">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <DataProtectionIcon size={14} />
              <span>ESTÁNDARES DE CIBERSEGURIDAD Y PRIVACIDAD MÉXICO</span>
            </div>

            <h1 className="m-0 text-[32px] sm:text-[42px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
              Cómo protegemos y resguardamos tus datos en Bravo
            </h1>

            <p className="m-0 text-[16.5px] sm:text-[18px] leading-[1.65] text-[#5B5266]">
              Tu tranquilidad no solo es financiera: la confidencialidad de tu información personal y crediticia está respaldada por tecnología de grado bancario y estricto apego legal.
            </p>
          </header>

          <div className="flex flex-col gap-8 text-[15.5px] leading-[1.75] text-[#3A3344]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[20px] p-6 flex flex-col gap-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#F5EDF9] text-[#5B2C72] flex items-center justify-center">
                  <DataProtectionIcon size={20} />
                </div>
                <h3 className="m-0 text-[18px] font-bold text-[#17131F]">Encriptación SSL de 256 bits</h3>
                <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                  Toda la comunicación entre tu navegador y nuestros servidores viaja cifrada mediante certificados SSL/TLS de alta seguridad.
                </p>
              </div>

              <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[20px] p-6 flex flex-col gap-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center">
                  <ReviewCaseIcon size={20} />
                </div>
                <h3 className="m-0 text-[18px] font-bold text-[#17131F]">Cumplimiento LFPDPPP</h3>
                <p className="m-0 text-[13.5px] text-[#5B5266] leading-relaxed">
                  Tratamiento legal riguroso conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                </p>
              </div>
            </div>

            <section className="flex flex-col gap-3 pt-2">
              <h2 className="m-0 text-[22px] font-bold text-[#17131F]">Nuestra Política de No Comercialización</h2>
              <p className="m-0">
                Bravo México <strong className="text-[#17131F]">nunca vende, renta ni cede bases de datos a terceros</strong>. La información que compartes se utiliza exclusivamente para evaluar tu situación financiera y realizar las gestiones de descuento que tú autorices.
              </p>
            </section>

            <div className="border-t border-[#EAE5EF] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Link href="/aviso-de-privacidad" className="text-[#5B2C72] font-bold hover:underline">
                Consultar Aviso de Privacidad Integral →
              </Link>
              <Link href="/derechos-arco" className="text-[#5B2C72] font-bold hover:underline">
                Ver procedimiento de Derechos ARCO →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <FinalCta />
    </>
  );
}
