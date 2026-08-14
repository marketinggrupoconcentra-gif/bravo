"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FAQGuideIcon } from "@/components/icons/bravo";

interface FaqItem {
  q: string;
  a: string;
}

const faqItems: FaqItem[] = [
  {
    q: "¿Qué tipo de deudas aplican para el programa de Bravo?",
    a: "Aplican deudas no garantizadas como tarjetas de crédito bancarias, tarjetas departamentales, préstamos personales y créditos de nómina. No aplican créditos hipotecarios ni empeños.",
  },
  {
    q: "¿Cuánto tiempo dura el programa de liquidación?",
    a: "La duración depende del monto de la deuda, la capacidad de ahorro mensual y las condiciones particulares de cada caso. Un asesor te presentará una propuesta estructurada según tu situación específica.",
  },
  {
    q: "¿Una liquidación con descuento puede tener implicaciones en mi historial crediticio?",
    a: "Sí. La forma en que una cuenta se reporta depende del acreedor y de las condiciones del convenio. Antes de aceptar una alternativa, revisa cómo será registrada la liquidación y conserva la documentación correspondiente.",
  },
  {
    q: "¿Por qué no se consulta el Buró de Crédito en este formulario?",
    a: "Este primer paso sirve para que un asesor conozca tu situación general. Cualquier consulta formal a sociedades de información crediticia solo se realiza con tu autorización expresa y por escrito en una etapa posterior.",
  },
  {
    q: "¿Tienen algún costo las asesorías iniciales?",
    a: "No. El análisis preliminar y la propuesta de plan personalizado son de carácter informativo y sin compromiso. Conocerás todas las condiciones antes de tomar cualquier decisión.",
  },
];

import { trackEvent } from "@/lib/analytics/track";
import { useCms } from "@/context/CmsContext";

export function Faq() {
  const { getSection } = useCms();
  const cms = getSection("home_faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
    trackEvent("faq_toggle", {
      question: faqItems[index]?.q || `Pregunta ${index + 1}`,
      is_open: isOpening,
      index: index,
    });
  };

  return (
    <section
      id="faq-section"
      data-cms-section="home_faq"
      className="py-[72px] lg:py-[104px] bg-[#FAF8FB] border-b border-[#E7E3EC] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-[100px] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px] animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[100px] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[100px] animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)", animationDelay: "3s" }}
      />

      <div className="bravo-container relative z-10">
        {/* Open 2-Column Split Layout (No rigid enclosing card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[36px] lg:gap-[56px] items-start">
          {/* ===================================================================
              LEFT COLUMN (4 cols): Sticky Header & Direct Support Box
              =================================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-[24px] lg:sticky lg:top-[100px] reveal-fade-left">
            <div className="flex flex-col gap-2.5">
              <div
                data-cms-field="badge"
                className="inline-flex self-start items-center gap-2 text-[12px] font-mono text-[#5B2C72] uppercase tracking-widest font-extrabold bg-[#F5EDF9] border border-[#DDCBE6] px-3.5 py-1 rounded-full shadow-2xs transition-all duration-300"
              >
                <FAQGuideIcon size={14} />
                <span>{cms.badge || "PREGUNTAS FRECUENTES"}</span>
              </div>
              <h2
                data-cms-field="title"
                className="m-0 text-[32px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.03em] text-[#17131F] leading-[1.1] transition-all duration-300"
              >
                {cms.title || "Respuestas claras a dudas comunes"}
              </h2>
              <p
                data-cms-field="subtitle"
                className="m-0 text-[15px] text-[#5B5266] leading-relaxed transition-all duration-300"
              >
                {cms.subtitle || "Todo lo que necesitas saber antes de iniciar tu plan de liquidación y ahorro con Bravo."}
              </p>
            </div>

            {/* Support Card */}
            <div className="bg-white border border-[#E7E3EC] rounded-[20px] p-[22px] flex flex-col gap-3 shadow-xs">
              <span className="text-[14.5px] font-bold text-[#17131F]">
                ¿Tienes una duda específica sobre tu banco?
              </span>
              <span className="text-[13px] text-[#5B5266] leading-snug">
                Un asesor especializado te atiende de forma personalizada y sin costo.
              </span>
              <div className="pt-1">
                <Link
                  href="/formulario"
                  className="bravo-btn-primary w-full text-center text-[15px] shadow-xs"
                >
                  Consultar con un asesor
                </Link>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN (8 cols): Floating Minimalist Accordion Items
              =================================================================== */}
          <div className="lg:col-span-8 flex flex-col gap-3.5 reveal-fade-right">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              const staggerClass = `stagger-${(idx % 5) + 1}`;
              return (
                <div key={idx} className={`reveal-init ${staggerClass} w-full`}>
                  <div
                    className={`rounded-[20px] transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-white border-2 border-[#5B2C72] shadow-md"
                        : "bg-white/80 backdrop-blur-sm border border-[#E7E3EC] hover:border-[#AB6CCA] hover:shadow-sm"
                    }`}
                  >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full p-[20px] sm:p-[24px] text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2C72]"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-extrabold text-[16.5px] sm:text-[18px] leading-snug transition-colors ${
                      isOpen ? "text-[#5B2C72]" : "text-[#17131F]"
                    }`}>
                      {item.q}
                    </span>
                    <span
                      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? "bg-[#5B2C72] text-white shadow-xs"
                          : "bg-[#F5EDF9] text-[#5B2C72]"
                      }`}
                    >
                      <svg
                        className={`w-[16px] h-[16px] transition-transform duration-300 ease-out origin-center ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  {/* Smooth Animated Opening Transition */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-[20px] sm:px-[24px] pb-[24px] text-[15.5px] sm:text-[16.5px] leading-[1.7] text-[#3A3344] border-t border-[#EAE5EF]/60 pt-4">
                        {item.a}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Faq as FAQ };
