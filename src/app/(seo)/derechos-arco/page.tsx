import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { DataProtectionIcon } from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Procedimiento de Derechos ARCO | Bravo México",
  description: "Guía y procedimiento oficial para ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) en Bravo México conforme a la LFPDPPP.",
};

export default function DerechosArcoPage() {
  return (
    <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
      <div className="bravo-container relative z-10 max-w-[960px]">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-6">
          <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-[#17131F] font-semibold">Derechos ARCO</span>
        </nav>

        <header className="flex flex-col gap-3 border-b border-[#EAE5EF] pb-6 mb-8">
          <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
            <DataProtectionIcon size={14} />
            <span>PROTECCIÓN DE DATOS PERSONALES · LFPDPPP</span>
          </div>

          <h1 className="m-0 text-[32px] sm:text-[42px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
            Procedimiento para Ejercer tus Derechos ARCO
          </h1>

          <div className="text-[13.5px] text-[#8A8095]">
            Acceso, Rectificación, Cancelación y Oposición de Datos Personales
          </div>
        </header>

        <div className="flex flex-col gap-6 text-[15.5px] leading-[1.75] text-[#3A3344]">
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">¿Qué son los Derechos ARCO?</h2>
            <p className="m-0">
              Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, como titular de tus datos personales tienes en todo momento el derecho de:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              <div className="bg-[#FAF8FB] p-4 rounded-[14px] border border-[#E7E3EC]">
                <strong className="block text-[#5B2C72]">Acceso (A):</strong>
                <span className="text-[13.5px] text-[#5B5266]">Conocer qué datos personales tenemos de ti y las condiciones del tratamiento.</span>
              </div>
              <div className="bg-[#FAF8FB] p-4 rounded-[14px] border border-[#E7E3EC]">
                <strong className="block text-[#5B2C72]">Rectificación (R):</strong>
                <span className="text-[13.5px] text-[#5B5266]">Solicitar la corrección de tus datos en caso de estar desactualizados o inexactos.</span>
              </div>
              <div className="bg-[#FAF8FB] p-4 rounded-[14px] border border-[#E7E3EC]">
                <strong className="block text-[#5B2C72]">Cancelación (C):</strong>
                <span className="text-[13.5px] text-[#5B5266]">Solicitar que se eliminen tus datos de nuestros registros cuando no exista obligación legal.</span>
              </div>
              <div className="bg-[#FAF8FB] p-4 rounded-[14px] border border-[#E7E3EC]">
                <strong className="block text-[#5B2C72]">Oposición (O):</strong>
                <span className="text-[13.5px] text-[#5B5266]">Oponerte al uso de tus datos personales para finalidades específicas como publicidad.</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[20px] font-bold text-[#17131F]">Procedimiento de Solicitud</h2>
            <p className="m-0">
              Para tramitar su solicitud ARCO, deberá enviar un correo electrónico a nuestro Departamento de Privacidad:
            </p>
            <div className="bg-[#F5EDF9] border border-[#DDCBE6] p-5 rounded-[18px] flex flex-col gap-2">
              <span className="text-[14px] font-bold text-[#5B2C72]">Correo electrónico oficial:</span>
              <a href="mailto:privacidad@bravocredito.com" className="text-[18px] font-mono font-bold text-[#17131F] hover:underline">
                privacidad@bravocredito.com
              </a>
              <span className="text-[13px] text-[#5B5266]">
                Tiempo máximo de respuesta conforme a ley: 20 días hábiles a partir de la recepción formal.
              </span>
            </div>
          </section>

          <div className="border-t border-[#EAE5EF] pt-6 mt-4 flex justify-between items-center text-[13.5px] text-[#8A8095]">
            <Link href="/aviso-de-privacidad" className="text-[#5B2C72] font-bold hover:underline">← Ver Aviso de Privacidad Integral</Link>
            <Link href="/" className="text-[#5B2C72] font-bold hover:underline">Volver al inicio</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
