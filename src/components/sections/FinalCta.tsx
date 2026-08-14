"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";
import { DataProtectionIcon } from "@/components/icons/bravo";
import { useCms } from "@/context/CmsContext";

export function FinalCta() {
  const { getSection } = useCms();
  const cms = getSection("home_final_cta");

  const bgStyleClass =
    cms.backgroundStyle === "aurora-glow"
      ? "bg-gradient-to-b from-[#2E1739] via-[#4A205A] to-[#2E1739] text-white"
      : cms.backgroundStyle === "pure-white"
      ? "bg-[#FFFFFF] text-[#17131F]"
      : cms.backgroundStyle === "light-offwhite"
      ? "bg-[#FAF8FB] text-[#17131F]"
      : "bg-[#2E1739] text-white";

  return (
    <section
      id="final-cta-section"
      data-cms-section="home_final_cta"
      className={`py-[80px] lg:py-[108px] relative overflow-hidden transition-colors duration-300 ${bgStyleClass}`}
    >
      {/* Dynamic Ambient Mesh Glows inside Purple Section */}
      <div
        className="pointer-events-none absolute -bottom-[140px] -right-[120px] w-[500px] h-[500px] rounded-full opacity-35 blur-[100px] animate-mesh-drift"
        style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -top-[120px] -left-[100px] w-[450px] h-[450px] rounded-full opacity-30 blur-[100px] animate-mesh-drift-reverse"
        style={{ background: "radial-gradient(circle, #AB6CCA 0%, transparent 70%)" }}
      />

      {/* Curved Trajectory Vector Path */}
      <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
        <Image
          src="/images/brand/vector/bravo-cta-path.svg"
          alt=""
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="bravo-container relative z-10 text-center flex flex-col items-center gap-[24px] reveal-init">
        <div
          data-cms-field="badge"
          className="inline-flex items-center gap-2 bg-[#5ECBDB]/15 border border-[#5ECBDB]/30 text-[#5ECBDB] text-[13px] font-bold px-4 py-1.5 rounded-full backdrop-blur-xs transition-all duration-300"
        >
          {cms.badge || "Plan de ahorro y negociación personalizada"}
        </div>

        <h2
          data-cms-field="title"
          className="m-0 text-[32px] sm:text-[42px] lg:text-[50px] font-extrabold tracking-[-0.03em] max-w-[850px] leading-[1.06] text-white transition-all duration-300"
        >
          {cms.title || "¿Quieres entender qué opciones pueden aplicar a tu situación?"}
        </h2>

        <p
          data-cms-field="subtitle"
          className="m-0 text-[17px] sm:text-[19px] leading-[1.6] text-[#C7B8D2] max-w-[680px] transition-all duration-300"
        >
          {cms.subtitle || "Responde unas preguntas breves en menos de dos minutos para que un asesor especializado revise tu caso sin costo ni compromiso."}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-[16px] items-center">
          <Link
            href={cms.primaryCtaUrl || "/formulario"}
            data-cms-field="primaryCta"
            onClick={() =>
              trackEvent("cta_click", {
                cta_id: "final_cta_button",
                placement: "final_cta_section",
              })
            }
            className="inline-flex items-center justify-center bg-[#5ECBDB] hover:bg-white text-[#17131F] font-extrabold text-[17px] h-[54px] px-[36px] rounded-full transition-all duration-200 shadow-md active:scale-[0.98]"
          >
            {cms.primaryCtaText || "Revisar mi caso"}
          </Link>
        </div>

        <div className="text-[13px] text-[#C7B8D2]/90 flex items-center gap-1.5 pt-1">
          <DataProtectionIcon size={15} className="text-[#5ECBDB]" />
          <span>Sin consulta automática al buró en este paso inicial</span>
        </div>
      </div>
    </section>
  );
}
