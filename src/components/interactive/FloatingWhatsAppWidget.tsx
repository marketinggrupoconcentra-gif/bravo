"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useContactChannels } from "@/context/ContactContext";
import { logUserAction } from "@/lib/telemetry/logger";

export function FloatingWhatsAppWidget() {
  const { config, getWhatsAppUrl } = useContactChannels();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Show after minor scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not show on admin or login pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/acceso")) {
    return null;
  }

  // Only render if widget is enabled AND a real WhatsApp number is configured
  if (!config.floatingWidgetEnabled || !config.whatsappNumber || !hasScrolled) {
    return null;
  }

  const isBottomLeft = config.floatingWidgetPosition === "bottom-left";
  const whatsappUrl = getWhatsAppUrl();

  // Guard: if URL couldn't be built (e.g., bad number), don't render
  if (!whatsappUrl) return null;


  const handleOpenChat = () => {
    logUserAction("whatsapp_floating_click", {
      position: config.floatingWidgetPosition,
      page: pathname,
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`fixed z-40 hidden lg:flex flex-col items-end gap-3 transition-all duration-300 ${
        isBottomLeft ? "left-5 bottom-5 items-start" : "right-5 bottom-5 items-end"
      }`}
    >
      {/* Floating Prompt Bubble */}
      {isOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-[#E7E3EC] max-w-[280px] flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex justify-between items-center border-b border-[#F0EDF3] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="font-extrabold text-[13px] text-[#17131F]">Asesor en Línea Bravo</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8A8095] hover:text-[#17131F] p-1 rounded-full cursor-pointer"
              aria-label="Cerrar globo"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[12.5px] text-[#5B5266] m-0 leading-relaxed">
            {config.floatingWidgetText || "¿Tienes dudas sobre cómo liquidar tus deudas con descuento? Escríbenos directamente."}
          </p>
          <button
            onClick={handleOpenChat}
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[13px] font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Iniciar chat de WhatsApp</span>
          </button>
        </div>
      )}

      {/* Main Floating Round Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer relative group"
        aria-label="Abrir chat de WhatsApp"
      >

        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button>
    </div>
  );
}
