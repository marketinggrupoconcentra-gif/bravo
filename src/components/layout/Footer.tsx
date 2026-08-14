"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DataProtectionIcon } from "@/components/icons/bravo";
import { useContactChannels } from "@/context/ContactContext";

export function Footer() {
  const { config, getWhatsAppUrl, isChannelConfigured } = useContactChannels();

  return (
    <footer className="bg-[#1E0F26] text-white px-4 lg:px-[40px] py-[64px] lg:py-[80px] relative overflow-hidden border-t border-[#3A1F48]">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-[100px] -left-[100px] w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, #AB6CCA 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-[100px] -right-[100px] w-[500px] h-[500px] rounded-full opacity-25 blur-[100px]"
        style={{ background: "radial-gradient(circle, #5ECBDB 0%, transparent 70%)" }}
      />

      <div className="bravo-container flex flex-col gap-[48px] relative z-10">
        {/* ===================================================================
            TOP GRID: Brand Column + 3 Navigation Columns
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[40px] lg:gap-[48px]">
          {/* Column 1: Brand, Mission & App Download Badges (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-[20px]">
            <Link href="/" className="inline-block self-start">
              <Image
                src="/50ac38d4-bravo-logo-blanco_105602x05601l00000o028.png"
                alt="Bravo México"
                width={145}
                height={40}
                className="object-contain"
              />
            </Link>

            <p className="text-[14.5px] leading-[1.65] text-[#DDCBE6] m-0 max-w-[360px]">
              Ayudamos a las familias en México a recuperar su tranquilidad financiera a través de un programa estructurado de ahorro mensual y negociación de deudas con descuento.
            </p>

            {/* Direct WhatsApp Contact Button — only shown if configured */}
            {isChannelConfigured("whatsappNumber") && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-[#5ECBDB]">
                  Contáctanos por WhatsApp
                </span>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[13.5px] font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm w-fit"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp: {config.whatsappFormatted}</span>
                </a>
              </div>
            )}


          </div>

          {/* Column 2: Soluciones & Programas (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-[14px]">
            <div className="text-[13px] font-extrabold tracking-[0.08em] uppercase text-[#5ECBDB]">
              Soluciones & Programa
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/como-funciona" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Cómo funciona el programa
              </Link>
              <Link href="/formulario" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Precalificación en 2 minutos
              </Link>
              <Link href="/simulador-de-liquidacion" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Simulador de liquidación
              </Link>
              <Link href="/soluciones/tarjetas-de-credito" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Liquidación de tarjetas de crédito
              </Link>
              <Link href="/soluciones/prestamos-personales" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Préstamos personales y nómina
              </Link>
              <Link href="/preguntas-frecuentes" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Preguntas frecuentes (FAQ)
              </Link>
            </div>
          </div>

          {/* Column 3: Recursos y Educación (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-[14px]">
            <div className="text-[13px] font-extrabold tracking-[0.08em] uppercase text-[#5ECBDB]">
              Educación Financiera
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/recursos/como-priorizar-pagos-multiples-tarjetas-de-credito" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Priorizar múltiples tarjetas
              </Link>
              <Link href="/recursos/requisitos-para-iniciar-plan-de-liquidacion" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Requisitos y documentos
              </Link>
              <Link href="/recursos/diferencias-negociar-bancos-vs-tiendas-departamentales" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Bancos vs. Departamentales
              </Link>
              <Link href="/recursos" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Centro de guías México
              </Link>
            </div>
          </div>

          {/* Column 4: Legal & Cumplimiento México (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-[14px]">
            <div className="text-[13px] font-extrabold tracking-[0.08em] uppercase text-[#5ECBDB]">
              Transparencia & Legal
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/aviso-de-privacidad" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Aviso de Privacidad Integral
              </Link>
              <Link href="/terminos-y-condiciones" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Términos y Condiciones de Uso
              </Link>
              <Link href="/derechos-arco" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors">
                Ejercicio de Derechos ARCO
              </Link>
              <Link href="/seguridad-de-tus-datos" className="text-[14px] text-[#DDCBE6] hover:text-white transition-colors flex items-center gap-1.5 pt-0.5">
                <DataProtectionIcon size={14} className="text-[#5ECBDB] shrink-0" />
                <span>Protección de datos y Aviso de Privacidad</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MEXICAN REGULATORY DISCLAIMER & CORPORATE REGISTRATION
            =================================================================== */}
        <div className="border-t border-[#3A1F48] pt-[28px] flex flex-col gap-4 text-[12px] text-[#C7B8D2] leading-relaxed">
          <p className="m-0">
            <strong>Razón Social:</strong> Go Bravo Soluciones, S.A.P.I. de C.V. (Bravo México). Domicilio corporativo en Ciudad de México, México. Bravo México opera como una reparadora e intermediaria de crédito privada e independiente. No es una entidad bancaria ni capta recursos financieros del público en general.
          </p>
          <p className="m-0">
            Los resultados de descuento y plazos dependen de la negociación individual con cada acreedor conforme al marco legal mercantil en México. Las quejas sobre despachos de cobranza se rigen conforme a las disposiciones de la CONDUSEF y PROFECO.
          </p>
        </div>

        {/* ===================================================================
            BOTTOM BAR: Copyright & Vector Social Icons
            =================================================================== */}
        <div className="border-t border-[#3A1F48] pt-[24px] flex flex-col md:flex-row justify-between items-center gap-[16px]">
          <div className="text-[13px] text-[#DDCBE6] text-center md:text-left">
            © {new Date().getFullYear()} Bravo México (Go Bravo Soluciones S.A.P.I. de C.V.). Todos los derechos reservados.
          </div>

          {/* Vectorized Social Icons */}
          <div className="flex items-center gap-[12px] flex-wrap justify-center">
            {/* YouTube */}
            {config.youtubeUrl && (
              <a
                href={config.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Bravo México"
                className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-[#FF0000] hover:text-white text-white flex items-center justify-center transition-all"
                title="Canal Oficial de YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}

            {/* Facebook */}
            {config.facebookUrl && (
              <a
                href={config.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Bravo México"
                className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-[#1877F2] hover:text-white text-white flex items-center justify-center transition-all"
                title="Facebook Oficial"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}

            {/* Instagram */}
            {config.instagramUrl && (
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Bravo México"
                className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-[#E4405F] hover:text-white text-white flex items-center justify-center transition-all"
                title="Instagram Oficial"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}

            {/* TikTok */}
            {config.tiktokUrl && (
              <a
                href={config.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Bravo México"
                className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-[#000000] hover:text-[#5ECBDB] text-white flex items-center justify-center transition-all"
                title="TikTok Oficial"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.79 1.34-.03 2.58-.88 3.03-2.13.23-.62.3-1.3.28-1.96V0z" />
                </svg>
              </a>
            )}

            {/* LinkedIn */}
            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Bravo México"
                className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-[#0A66C2] hover:text-white text-white flex items-center justify-center transition-all"
                title="LinkedIn Oficial"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}

            {/* X / Twitter */}
            {config.twitterUrl && (
              <a
                href={config.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) Bravo México"
                className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-black hover:text-white text-white flex items-center justify-center transition-all"
                title="X / Twitter Oficial"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
