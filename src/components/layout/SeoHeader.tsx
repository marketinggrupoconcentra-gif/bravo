"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { trackEvent } from "@/lib/analytics/track";
import { getValidatedClaim } from "@/config/claims";

export function SeoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  // Validate if phone number or operational hours exist
  const phone = getValidatedClaim("phone-support");
  const hours = getValidatedClaim("business-hours");
  const showUtilityBar = Boolean(phone || hours);

  const navLinks = [
    { href: "/soluciones", label: "Soluciones" },
    { href: "/tipos-de-deuda", label: "Tipos de deuda" },
    { href: "/como-funciona", label: "Cómo funciona" },
    { href: "/requisitos", label: "Requisitos" },
    { href: "/casos", label: "Casos" },
    { href: "/recursos", label: "Recursos" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleCtaClick = () => {
    trackEvent("cta_click", {
      cta_id: "header_evaluate",
      placement: "seo_header",
    });
  };

  return (
    <>
      {/* Utility Bar: Render ONLY if validated configuration exists */}
      {showUtilityBar && (
        <div className="bg-[#1F1126] text-[#EFE7F4] hidden md:flex justify-between items-center px-6 lg:px-12 py-2 text-[13px] border-b border-[#3A1F48]">
          <div className="text-[#C7B8D2]">{hours || "Atención a clientes en toda la República Mexicana"}</div>
          <div className="flex gap-[22px] items-center">
            {phone && <span className="font-mono text-[#5ECBDB] font-bold">{phone}</span>}
            <Link href="/aviso-de-privacidad" className="text-[#C7B8D2] hover:text-white transition-colors">
              Aviso de privacidad
            </Link>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E7E3EC] shadow-2xs">
        <div className="bravo-container flex items-center justify-between h-[66px] md:h-[76px]">
          {/* Left: Complete Brand Logo */}
          <div className="flex items-center gap-[28px] xl:gap-[40px]">
            <BrandLogo />

            {/* Desktop Navigation with Active Indicator */}
            <nav className="hidden lg:flex items-center gap-[22px] xl:gap-[30px] text-[15px] font-semibold">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2.5 transition-all ${
                      active
                        ? "text-[#5B2C72] font-bold after:absolute after:bottom-[-19px] md:after:bottom-[-23.5px] after:left-0 after:right-0 after:h-[3.5px] after:bg-[#5B2C72] after:rounded-full"
                        : "text-[#5B5266] hover:text-[#5B2C72] font-medium after:absolute after:bottom-[-19px] md:after:bottom-[-23.5px] after:left-0 after:right-0 after:h-[2px] after:bg-[#5B2C72]/40 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions — only on desktop (matches nav breakpoint at lg) */}
          <div className="hidden lg:flex items-center gap-[16px]">
            <Link
              href="/formulario"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center bg-[#5B2C72] text-white text-[15px] font-extrabold h-[46px] px-[26px] rounded-full hover:bg-[#45205A] transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              Revisar mi caso
            </Link>
          </div>

          {/* Mobile Hamburger Button (44x44 target) */}
          <button
            className="lg:hidden w-[44px] h-[44px] flex items-center justify-center text-[#17131F] rounded-lg hover:bg-[#F5EDF9] transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Abrir menú de navegación"
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`w-[20px] h-[2px] bg-[#17131F] transition-all ${
                  isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`w-[20px] h-[2px] bg-[#17131F] transition-all ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-[20px] h-[2px] bg-[#17131F] transition-all ${
                  isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Dropdown + Overlay */}
        {isMenuOpen && (
          <>
            {/* Overlay backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
              style={{ top: 66 }}
            />
            <div className="lg:hidden border-t border-[#E7E3EC] bg-white px-5 py-5 shadow-xl absolute w-full left-0 top-[66px] z-50 flex flex-col gap-4">
              <nav className="flex flex-col gap-1.5 text-[15.5px]">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                        active
                          ? "bg-[#F5EDF9] text-[#5B2C72] font-bold border-l-4 border-[#5B2C72]"
                          : "text-[#5B5266] hover:text-[#5B2C72] hover:bg-[#FAF8FB] font-medium"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && <span className="w-2 h-2 rounded-full bg-[#5B2C72]" />}
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-1 pb-1 flex flex-col gap-2">
                <Link
                  href="/formulario"
                  onClick={() => {
                    handleCtaClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-full bg-[#5B2C72] py-3.5 text-[16px] font-extrabold text-white shadow-xs hover:bg-[#45205A] transition-colors"
                >
                  Revisar mi caso
                </Link>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
