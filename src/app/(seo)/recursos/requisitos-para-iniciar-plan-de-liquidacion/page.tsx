import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  RequirementsIcon,
  ReviewCaseIcon,
  DataProtectionIcon,
  AdvisorSupportIcon,
  NoPasswordIcon,
} from "@/components/icons/bravo";

export const metadata: Metadata = {
  title: "Requisitos y Documentación para Liquidar Deudas en México | Bravo",
  description: "Conoce los documentos indispensables, requisitos de monto y criterios de elegibilidad para ingresar a un programa de liquidación con descuento en México.",
};

export default function RequisitosLiquidacionPage() {
  return (
    <>
      <article className="py-[48px] lg:py-[72px] bg-[#FFFFFF] relative overflow-hidden">
        {/* Ambient Glows */}
        <div
          className="pointer-events-none absolute -top-[120px] left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #157A5A 0%, transparent 70%)" }}
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
            <span className="text-[#17131F] font-semibold truncate">Requisitos para tu Plan</span>
          </nav>

          {/* Article Header */}
          <header className="flex flex-col gap-4 border-b border-[#EAE5EF] pb-8 mb-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#157A5A] uppercase tracking-widest font-extrabold bg-[#F1FAF6] border border-[#C6E6D9] px-3 py-1 rounded-full shadow-2xs">
                <RequirementsIcon size={14} />
                <span>GUÍA DE REQUISITOS Y DOCUMENTACIÓN</span>
              </span>
              <span className="text-[13px] text-[#8A8095]">· 4 min de lectura · Normativa México</span>
            </div>

            <h1 className="m-0 text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-[-0.035em] text-[#17131F] leading-[1.08]">
              Qué documentos y requisitos necesitas para iniciar tu plan de liquidación
            </h1>

            <p className="m-0 text-[17px] sm:text-[19px] leading-[1.65] text-[#5B5266]">
              La transparencia y la seguridad jurídica son el pilar de un proceso de negociación exitoso. Conoce con exactitud qué información se requiere y en qué etapa se presenta.
            </p>
          </header>

          {/* Checklist Summary Box */}
          <div className="bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-[24px] sm:p-[32px] mb-10 shadow-xs">
            <h2 className="m-0 text-[18px] font-extrabold text-[#17131F] mb-4 flex items-center gap-2">
              <div className="w-[24px] h-[24px] rounded-[6px] bg-[#F1FAF6] border border-[#C6E6D9] flex items-center justify-center shrink-0 text-[#157A5A]">
                <RequirementsIcon size={14} />
              </div>
              <span>Resumen de requisitos básicos</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[16px] border border-[#E7E3EC] flex flex-col gap-1.5">
                <span className="text-[12px] font-mono font-bold text-[#157A5A] uppercase">1. MONTO MÍNIMO</span>
                <strong className="text-[16px] text-[#17131F]">$50,000+ MXN</strong>
                <span className="text-[12.5px] text-[#5B5266]">Deuda acumulada total sumando todas tus instituciones.</span>
              </div>

              <div className="bg-white p-4 rounded-[16px] border border-[#E7E3EC] flex flex-col gap-1.5">
                <span className="text-[12px] font-mono font-bold text-[#157A5A] uppercase">2. TIPO DE DEUDA</span>
                <strong className="text-[16px] text-[#17131F]">No garantizada</strong>
                <span className="text-[12.5px] text-[#5B5266]">Tarjetas de crédito, departamentales o préstamos personales.</span>
              </div>

              <div className="bg-white p-4 rounded-[16px] border border-[#E7E3EC] flex flex-col gap-1.5">
                <span className="text-[12px] font-mono font-bold text-[#157A5A] uppercase">3. CAPACIDAD</span>
                <strong className="text-[16px] text-[#17131F]">Ahorro mensual</strong>
                <span className="text-[12.5px] text-[#5B5266]">Posibilidad de aportar mensualmente a tu fondo propio.</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex flex-col gap-8 text-[16.5px] sm:text-[17.5px] leading-[1.75] text-[#3A3344]">
            <section className="flex flex-col gap-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                1. ¿En qué momento se solicitan los documentos?
              </h2>
              <p className="m-0">
                Un error común es creer que se deben enviar estados de cuenta o identificaciones desde el primer contacto en la web. <strong className="text-[#17131F]">En Bravo, el primer paso es 100% informativo:</strong> solo indicas montos aproximados y tipos de institución para que un asesor te explique alternativas.
              </p>
              <p className="m-0">
                La documentación formal solo se solicita <strong className="text-[#157A5A]">después</strong> de que hablaste con tu asesor, conociste los costos, plazos y decidiste por escrito que deseas avanzar.
              </p>
            </section>

            {/* Documents List */}
            <section className="flex flex-col gap-4 pt-4">
              <h2 className="m-0 text-[26px] sm:text-[30px] font-extrabold text-[#17131F] tracking-tight">
                2. Lista de documentos indispensables
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
                <div className="bg-[#FBFAFC] border border-[#E7E3EC] rounded-[18px] p-5 flex flex-col gap-2">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center font-bold">
                    <svg className="w-4 h-4 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <strong className="text-[16px] text-[#17131F]">Identificación Oficial</strong>
                  <span className="text-[13.5px] text-[#5B5266]">
                    INE/IFE vigente o Pasaporte mexicano para acreditar la titularidad de los contratos.
                  </span>
                </div>

                <div className="bg-[#FBFAFC] border border-[#E7E3EC] rounded-[18px] p-5 flex flex-col gap-2">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center font-bold">
                    <svg className="w-4 h-4 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <strong className="text-[16px] text-[#17131F]">Comprobante de Domicilio</strong>
                  <span className="text-[13.5px] text-[#5B5266]">
                    Recibo de luz (CFE), agua, teléfono o predial no mayor a 3 meses de antigüedad.
                  </span>
                </div>

                <div className="bg-[#FBFAFC] border border-[#E7E3EC] rounded-[18px] p-5 flex flex-col gap-2">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F1FAF6] text-[#157A5A] flex items-center justify-center font-bold">
                    <svg className="w-4 h-4 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <strong className="text-[16px] text-[#17131F]">Estados de Cuenta</strong>
                  <span className="text-[13.5px] text-[#5B5266]">
                    El estado de cuenta más reciente de cada tarjeta o crédito para verificar números de contrato y saldos.
                  </span>
                </div>
              </div>
            </section>

            {/* What NEVER to provide */}
            <section className="bg-[#FFF5F5] border-2 border-[#E53E3E] rounded-[22px] p-[24px] sm:p-[32px] flex flex-col gap-3 my-4">
              <div className="flex items-center gap-2 text-[#C53030] font-extrabold text-[18px]">
                <NoPasswordIcon size={20} />
                <span>Lo que NUNCA debes compartir con ninguna empresa</span>
              </div>
              <p className="m-0 text-[14.5px] text-[#4A5568] leading-relaxed">
                Por tu máxima seguridad financiera, ninguna reparadora legítima te solicitará jamás:
              </p>
              <ul className="m-0 p-0 list-none flex flex-col gap-2 text-[14px] text-[#2D3748]">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C53030] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Contraseñas de tu banca móvil o NIPs de tus tarjetas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C53030] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Códigos dinámicos de Token o SMS de confirmación bancaria.</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C53030] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Depósitos a cuentas personales de ejecutivos o intermediarios no autorizados.</span>
                </li>
              </ul>
            </section>

            {/* In-Article CTA */}
            <div className="bg-gradient-to-r from-[#157A5A] to-[#0D4D38] text-white rounded-[24px] p-[28px] sm:p-[36px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px] shadow-lg my-6">
              <div className="flex flex-col gap-1">
                <span className="text-[20px] font-extrabold text-white">
                  ¿Quieres validar si tus deudas son elegibles?
                </span>
                <span className="text-[14px] text-[#A5E3C5]">
                  Toma menos de 2 minutos y no necesitas tener documentos a la mano hoy.
                </span>
              </div>
              <Link
                href="/formulario"
                className="bravo-btn-cyan whitespace-nowrap shadow-md font-extrabold"
              >
                Comenzar evaluación inicial
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
