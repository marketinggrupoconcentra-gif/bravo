"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";

export function StickyMobileCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroPrimaryCta = document.getElementById("hero-primary-cta");
      const prequalForm = document.getElementById("precalificar");
      const finalCta = document.getElementById("final-cta-section");

      if (!heroPrimaryCta) return;

      const heroRect = heroPrimaryCta.getBoundingClientRect();
      const heroPassed = heroRect.bottom < 0;

      let formInView = false;
      if (prequalForm) {
        const formRect = prequalForm.getBoundingClientRect();
        formInView = formRect.top < window.innerHeight && formRect.bottom > 0;
      }

      let finalCtaInView = false;
      if (finalCta) {
        const finalRect = finalCta.getBoundingClientRect();
        finalCtaInView = finalRect.top < window.innerHeight && finalRect.bottom > 0;
      }

      // Show only if hero CTA has left viewport AND neither form nor final CTA are in view
      setIsVisible(heroPassed && !formInView && !finalCtaInView);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E3EC] p-3.5 pb-[max(14px,env(safe-area-inset-bottom))] shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
      <Link
        href="#precalificar"
        onClick={() =>
          trackEvent("cta_click", {
            cta_id: "sticky_mobile_cta",
            placement: "mobile_sticky_bar",
          })
        }
        className="flex w-full items-center justify-center rounded-full bg-[#5B2C72] py-3.5 text-[16px] font-bold text-white shadow-md active:scale-[0.98] transition-transform"
      >
        Revisar mi caso
      </Link>
    </div>
  );
}
