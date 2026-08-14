import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  GuideIcon,
  RequirementsIcon,
  CreditCardArticleIcon,
  CostClarityIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Centro de Recursos y Educación Financiera | Bravo México",
  description: "Guías prácticas, requisitos legales, análisis comparativos y simuladores para resolver tus deudas en México.",
};

export default function RecursosPage() {
  return (
    <>
      <header className="py-[48px] lg:py-[72px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden">
        <div className="bravo-container relative z-10 max-w-[1080px]">
          <nav className="flex items-center gap-2 text-[13px] text-[#8A8095] mb-4">
            <Link href="/" className="hover:text-[#5B2C72] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#17131F] font-semibold">Recursos</span>
          </nav>

          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-1.5 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3 py-1 rounded-full shadow-2xs">
              <GuideIcon size={14} />
              <span>CENTRO DE EDUCACIÓN FINANCIERA MÉXICO</span>
            </div>
            <h1 className="m-0 text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-tight">
              Guías, análisis y herramientas para recuperar tu tranquilidad
            </h1>
            <p className="m-0 text-[16px] sm:text-[18px] text-[#5B5266] max-w-[760px] leading-relaxed">
              Aprende cómo operan los créditos, cómo negociar quitas con bancos y cómo organizar tus finanzas familiares en México.
            </p>
          </div>
        </div>
      </header>

      <section className="py-[64px] lg:py-[88px] bg-white border-b border-[#E7E3EC]">
        <div className="bravo-container max-w-[1080px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Priorizar Tarjetas */}
          <div className="bg-[#FAF8FB] border-t-4 border-t-[#5B2C72] border-x border-b border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 hover:shadow-md transition-all">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] uppercase font-bold">
                <GuideIcon size={16} />
                <span>GUÍA DE ESTRATEGIA</span>
              </div>
              <h2 className="m-0 text-[20px] font-bold text-[#17131F]">
                Cómo priorizar pagos cuando tienes múltiples tarjetas de crédito
              </h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Descubre cuándo aplicar el Método Avalancha o Bola de Nieve para reducir intereses y cancelar tarjetas en México.
              </p>
            </div>
            <Link
              href="/recursos/como-priorizar-pagos-multiples-tarjetas-de-credito"
              className="text-[14px] font-bold text-[#5B2C72] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Leer guía completa →
            </Link>
          </div>

          {/* Card 2: Requisitos */}
          <div className="bg-[#FAF8FB] border-t-4 border-t-[#157A5A] border-x border-b border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 hover:shadow-md transition-all">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#157A5A] uppercase font-bold">
                <RequirementsIcon size={16} />
                <span>REQUISITOS Y DOCUMENTOS</span>
              </div>
              <h2 className="m-0 text-[20px] font-bold text-[#17131F]">
                Qué documentos necesitas tener a la mano para iniciar tu plan
              </h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Conoce la documentación indispensable (INE, comprobante y estados de cuenta) y qué datos nunca debes compartir.
              </p>
            </div>
            <Link
              href="/recursos/requisitos-para-iniciar-plan-de-liquidacion"
              className="text-[14px] font-bold text-[#157A5A] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Ver requisitos →
            </Link>
          </div>

          {/* Card 3: Bancos vs Departamentales */}
          <div className="bg-[#FAF8FB] border-t-4 border-t-[#1E8A9B] border-x border-b border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 hover:shadow-md transition-all">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#1E8A9B] uppercase font-bold">
                <CreditCardArticleIcon size={16} />
                <span>ANÁLISIS DE COBRANZA</span>
              </div>
              <h2 className="m-0 text-[20px] font-bold text-[#17131F]">
                Diferencias entre negociar con bancos y tiendas departamentales
              </h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Políticas de quita, tiempos y derechos del consumidor ante despachos de cobranza en Liverpool, Coppel o Sears.
              </p>
            </div>
            <Link
              href="/recursos/diferencias-negociar-bancos-vs-tiendas-departamentales"
              className="text-[14px] font-bold text-[#1E8A9B] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Ver análisis comparativo →
            </Link>
          </div>

          {/* Card 4: Simulador */}
          <div className="bg-[#FAF8FB] border-t-4 border-t-[#AB6CCA] border-x border-b border-[#E7E3EC] rounded-[22px] p-6 flex flex-col justify-between gap-4 hover:shadow-md transition-all">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[12px] font-mono text-[#AB6CCA] uppercase font-bold">
                <CostClarityIcon size={16} />
                <span>HERRAMIENTA INTERACTIVA</span>
              </div>
              <h2 className="m-0 text-[20px] font-bold text-[#17131F]">
                Simulador de Liquidación de Deudas en México
              </h2>
              <p className="m-0 text-[14px] text-[#5B5266] leading-relaxed">
                Calcula en segundos tu ahorro potencial estimado y la aportación mensual sugerida para liquidar con descuento.
              </p>
            </div>
            <Link
              href="/simulador-de-liquidacion"
              className="text-[14px] font-bold text-[#5B2C72] inline-flex items-center gap-1 hover:underline pt-2"
            >
              Abrir simulador interactivo →
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
