"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons/bravo";
import { logUserAction } from "@/lib/telemetry/logger";
import { useContactChannels } from "@/context/ContactContext";

export function SmartExitIntentModal() {
  const { getWhatsAppUrl } = useContactChannels();
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Only on desktop viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        logUserAction("exit_intent_modal_shown", { source: "mouse_leave" });
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    logUserAction("exit_intent_modal_dismissed", {});
  };

  const handleWhatsAppClick = () => {
    logUserAction("exit_intent_whatsapp_click", {});
    const url = getWhatsAppUrl("Hola, quisiera asesoría inmediata para liquidar mis deudas con descuento con Bravo México.");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] border border-[#E7E3EC] shadow-2xl max-w-[480px] w-full p-6 sm:p-8 flex flex-col gap-5 relative text-[#17131F] transform transition-all">
        {/* Close cross button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#8A8095] hover:text-[#17131F] rounded-full hover:bg-[#FAF8FB] transition-colors cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-2 text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-[#F5EDF9] border border-[#DDCBE6] text-[#5B2C72] mx-auto flex items-center justify-center font-extrabold text-[20px]">
            <svg className="w-6 h-6 text-[#5B2C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-[22px] font-extrabold tracking-tight text-[#17131F] m-0">
            ¿Tienes dudas con tus bancos o tarjetas?
          </h3>
          <p className="text-[14px] text-[#5B5266] m-0 leading-relaxed">
            No te vayas con la duda. Un asesor financiero certificado puede revisar tu caso de forma confidencial y sin ningún compromiso.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#E7E3EC] flex flex-col gap-2 text-[12.5px] text-[#3A3344]">
          <div className="flex items-center gap-2">
            <CheckIcon size={16} className="text-[#157A5A] shrink-0" />
            <span>Descuentos de hasta el 70% en saldos bancarios.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon size={16} className="text-[#157A5A] shrink-0" />
            <span>Tranquilidad y cese de llamadas de cobranza abusiva.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon size={16} className="text-[#157A5A] shrink-0" />
            <span>Asesoría inicial gratuita y de carácter informativo.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-[14.5px] rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>Consultar por WhatsApp ahora</span>
          </button>

          <Link
            href="/formulario"
            onClick={handleClose}
            className="w-full py-3 bg-[#5B2C72] hover:bg-[#472259] text-white font-bold text-[13.5px] rounded-full text-center shadow-2xs transition-all cursor-pointer"
          >
            Completar precalificación en línea (2 min) →
          </Link>
        </div>
      </div>
    </div>
  );
}
