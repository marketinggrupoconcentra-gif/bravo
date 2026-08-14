"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BravoSuccessMark } from "@/components/visuals/BravoSuccessMark";
import {
  DataProtectionIcon,
  ReviewCaseIcon,
  AdvisorSupportIcon,
  CostClarityIcon,
  CreditCardIcon,
} from "@/components/icons/bravo";

interface LeadData {
  nombre: string;
  amount: string;
  tipoDeuda: string;
  institucion: string;
  last4: string;
  folio: string;
}

function PersonalizedGraciasContent() {
  const searchParams = useSearchParams();

  const [lead, setLead] = useState<LeadData>({
    nombre: "Carlos",
    amount: "$120,000 - $250,000 MXN",
    tipoDeuda: "Tarjeta de crédito",
    institucion: "BBVA México",
    last4: "8920",
    folio: "BR-489757",
  });

  useEffect(() => {
    // 1. Try URL Query Params first
    const qNombre = searchParams.get("nombre");
    const qTel4 = searchParams.get("tel4");
    const qInst = searchParams.get("inst");
    const qDeuda = searchParams.get("deuda");
    const qMonto = searchParams.get("monto");

    // 2. Try SessionStorage
    let sData: Partial<LeadData> = {};
    try {
      const stored = sessionStorage.getItem("bravo_lead_summary");
      if (stored) {
        sData = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    const finalNombre = qNombre || sData.nombre || "Carlos";
    const finalTel4 = qTel4 || sData.last4 || "8920";
    const finalInst = qInst || sData.institucion || "BBVA México";
    const finalDeuda = qDeuda || sData.tipoDeuda || "Tarjeta de crédito";
    const finalMonto = qMonto || sData.amount || "$120,000 - $250,000 MXN";
    const finalFolio = sData.folio || `BR-${Math.floor(100000 + Math.random() * 900000)}`;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLead({
      nombre: finalNombre,
      amount: finalMonto,
      tipoDeuda: finalDeuda,
      institucion: finalInst,
      last4: finalTel4,
      folio: finalFolio,
    });
  }, [searchParams]);

  const formattedPhone = React.useMemo(() => {
    const cleanLast4 = lead.last4.replace(/\D/g, "").slice(-4) || "8920";
    return {
      prefix: "55 •••• ",
      digits: cleanLast4,
    };
  }, [lead.last4]);

  const whatsappMessage = encodeURIComponent(
    `Hola, acabo de registrar mi solicitud en Bravo México con folio ${lead.folio} a nombre de ${lead.nombre} para liquidar mi deuda de ${lead.institucion}.`
  );

  return (
    <div className="max-w-[760px] w-full bg-white p-6 sm:p-10 lg:p-12 rounded-[28px] shadow-xl border border-[#E7E3EC] flex flex-col items-center gap-7 relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div
        className="pointer-events-none absolute -top-[100px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full opacity-20 blur-[80px]"
        style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)" }}
      />

      <BravoSuccessMark size={88} />

      {/* Personalized Header */}
      <div className="flex flex-col items-center text-center gap-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] text-[12.5px] font-mono font-bold px-3.5 py-1 rounded-full shadow-2xs">
          <svg className="w-3.5 h-3.5 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>SOLICITUD REGISTRADA CON ÉXITO</span>
        </div>

        <h1 className="text-[30px] sm:text-[38px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0 leading-tight">
          ¡Gracias, <span className="text-[#5B2C72]">{lead.nombre}</span>!
        </h1>

        <p className="text-[15px] text-[#5B5266] m-0 font-mono">
          Folio oficial de atención: <strong className="text-[#17131F] font-bold">{lead.folio}</strong>
        </p>
      </div>

      {/* Personalized Lead Summary Box */}
      <div className="w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-5 sm:p-6 flex flex-col gap-4 shadow-xs relative z-10">
        <div className="text-[12px] font-mono font-extrabold tracking-wider uppercase text-[#5B2C72] border-b border-[#EAE5EF] pb-2.5 flex items-center justify-between">
          <span>Resumen de tu diagnóstico personalizado:</span>
          <span className="text-[#157A5A] font-bold">SIN COSTO INICIAL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[14px]">
          {/* Nombre Confirmado */}
          <div className="bg-white p-3.5 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
            <span className="text-[12px] text-[#8A8095] font-medium">Titular del caso:</span>
            <strong className="text-[#5B2C72] font-extrabold text-[15px]">{lead.nombre}</strong>
          </div>

          {/* Teléfono con últimos 4 dígitos visibles */}
          <div className="bg-white p-3.5 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
            <span className="text-[12px] text-[#8A8095] font-medium">Teléfono de contacto confirmado:</span>
            <div className="font-mono text-[15.5px]">
              <span className="text-[#8A8095]">{formattedPhone.prefix}</span>
              <span className="text-[#17131F] font-extrabold bg-[#F5EDF9] px-1.5 py-0.5 rounded-md text-[#5B2C72] border border-[#DDCBE6]">
                {formattedPhone.digits}
              </span>
            </div>
          </div>

          {/* Institución */}
          <div className="bg-white p-3.5 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
            <span className="text-[12px] text-[#8A8095] font-medium">Institución acreedora:</span>
            <strong className="text-[#17131F] font-extrabold text-[15px]">{lead.institucion}</strong>
          </div>

          {/* Monto de Deuda */}
          <div className="bg-white p-3.5 rounded-[14px] border border-[#E7E3EC] flex flex-col gap-1">
            <span className="text-[12px] text-[#8A8095] font-medium">Monto estimado registrado:</span>
            <strong className="text-[#157A5A] font-extrabold text-[15px]">{lead.amount}</strong>
          </div>
        </div>
      </div>

      {/* Personalized Next Steps Roadmap */}
      <div className="space-y-4 text-[#3A3344] text-left w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-[22px] p-5 sm:p-6 text-[14.5px] relative z-10">
        <div className="text-[13px] font-mono font-extrabold tracking-wider uppercase text-[#17131F] mb-1">
          Próximos pasos con tu asesor asignado:
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-[32px] h-[32px] rounded-full bg-[#5B2C72] text-white flex items-center justify-center font-extrabold text-[13px] shrink-0 mt-0.5 shadow-xs">
            1
          </div>
          <div>
            <strong className="text-[#17131F] block mb-0.5">
              Diagnóstico inicial para tu cuenta de {lead.institucion}:
            </strong>
            <span className="text-[#5B5266] text-[13.5px] leading-relaxed">
              Un asesor revisará los parámetros de quita histórica aplicables a tu caso de {lead.tipoDeuda.toLowerCase()}.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-[32px] h-[32px] rounded-full bg-[#5B2C72] text-white flex items-center justify-center font-extrabold text-[13px] shrink-0 mt-0.5 shadow-xs">
            2
          </div>
          <div>
            <strong className="text-[#17131F] block mb-0.5">
              Llamada personalizada a tu número ({formattedPhone.prefix}{formattedPhone.digits}):
            </strong>
            <span className="text-[#5B5266] text-[13.5px] leading-relaxed">
              Te contactaremos en menos de 24 horas hábiles desde una línea oficial para explicarte tus alternativas sin costo ni compromiso.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-[32px] h-[32px] rounded-full bg-[#5B2C72] text-white flex items-center justify-center font-extrabold text-[13px] shrink-0 mt-0.5 shadow-xs">
            3
          </div>
          <div>
            <strong className="text-[#17131F] block mb-0.5">
              Propuesta de ahorro mensual y Carta Finiquito:
            </strong>
            <span className="text-[#5B5266] text-[13.5px] leading-relaxed">
              Recibirás por escrito las mensualidades sugeridas para liquidar con descuento formal y obtener tu carta finiquito oficial.
            </span>
          </div>
        </div>

        {/* Legal data protection notice */}
        <div className="text-[12.5px] border-t border-[#EAE5EF] pt-3 mt-3 text-[#8A8095] leading-relaxed flex items-center gap-2">
          <DataProtectionIcon size={16} className="text-[#157A5A] shrink-0" />
          <span>
            Tus datos están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
          </span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10 pt-1">
        {/* WhatsApp Fast Track Button */}
        <a
          href={`https://wa.me/525556703000?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-[15px] h-[52px] px-6 rounded-full transition-all shadow-md active:scale-[0.98]"
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>Atención rápida por WhatsApp</span>
        </a>

        {/* Return Home Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-[#FAF8FB] hover:bg-[#F5EDF9] text-[#5B2C72] border-2 border-[#5B2C72] font-extrabold text-[15px] h-[52px] px-6 rounded-full transition-all shadow-xs active:scale-[0.98] text-center"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export function PersonalizedGracias() {
  return (
    <Suspense fallback={null}>
      <PersonalizedGraciasContent />
    </Suspense>
  );
}
