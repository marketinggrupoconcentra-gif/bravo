"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export type AdminTab =
  | "summary"
  | "records"
  | "cms_editor"
  | "forms"
  | "whatsapp"
  | "tracking_tags"
  | "audiences"
  | "heatmaps"
  | "telemetry";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  leadsCount: number;
  eventsCount: number;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  leadsCount,
  eventsCount,
}: AdminSidebarProps) {
  const navItems: {
    id: AdminTab;
    label: string;
    description: string;
    badge?: number | string;
    isLiveBadge?: boolean;
    icon: (props: { className?: string }) => React.ReactNode;
  }[] = [
    {
      id: "summary",
      label: "Resumen Ejecutivo",
      description: "Métricas, registros y salud de APIs",
      badge: "C-Level",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "records",
      label: "Expedientes y Registros",
      description: "Revisión de prospectos",
      badge: leadsCount,
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "cms_editor",
      label: "Editor de Landing Page",
      description: "Copys, fondos y botones",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: "forms",
      label: "Constructor de Formulario",
      description: "Pasos, Webhooks y presets",
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: "whatsapp",
      label: "Canales y WhatsApp",
      description: "Línea oficial, mensaje y widget",
      badge: "En Vivo",
      isLiveBadge: true,
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: "tracking_tags",
      label: "Etiquetas y Píxeles",
      description: "GTM, GA4, Meta y Ads",
      badge: "En Vivo",
      isLiveBadge: true,
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: "audiences",
      label: "Audiencias y Retorno",
      description: "Meta CAPI, Google y CRM",
      badge: "CAPI Live",
      isLiveBadge: true,
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "heatmaps",
      label: "Mapas de Calor en Vivo",
      description: "Visualizador térmico por página",
      badge: "En Vivo",
      isLiveBadge: true,
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
    },
    {
      id: "telemetry",
      label: "Telemetría y Analítica",
      description: "Acciones de usuario en vivo",
      badge: eventsCount,
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`bg-[#170B1F] text-white flex flex-col justify-between border-r border-[#341C3D] transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-40 select-none ${
        isCollapsed ? "w-[76px]" : "w-[320px] xl:w-[340px]"
      }`}
    >
      {/* Top Brand & Header */}
      <div className="flex flex-col min-h-0 flex-1">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#341C3D] h-[72px] shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BrandLogo variant="white" />
              </Link>
            </div>
          ) : (
            <Link href="/" className="w-full flex justify-center hover:opacity-90">
              <div className="w-9 h-9 rounded-xl bg-[#5B2C72] flex items-center justify-center font-black text-white text-[16px] border border-[#AB6CCA]/50 shadow-sm">
                B
              </div>
            </Link>
          )}

          {/* Collapse / Expand Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-8 h-8 rounded-lg bg-[#281333] hover:bg-[#3E1B4F] border border-[#5B2C72]/60 text-[#D4C8DF] hover:text-white flex items-center justify-center transition-all cursor-pointer ${
              isCollapsed ? "hidden" : "ml-auto"
            }`}
            title={isCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
            aria-label={isCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Collapsed expander icon under logo if collapsed */}
        {isCollapsed && (
          <div className="p-2 flex justify-center border-b border-[#341C3D] shrink-0">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-[#281333] hover:bg-[#3E1B4F] border border-[#5B2C72]/60 text-[#D4C8DF] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Expandir menú lateral"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Items (Scrollable if viewport is small) */}
        <nav className="p-3.5 flex flex-col gap-2 overflow-y-auto flex-1 overscroll-contain">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left relative group ${
                  isActive
                    ? "bg-gradient-to-r from-[#5B2C72] to-[#45205A] text-white shadow-md border-l-4 border-l-[#5ECBDB] border-y border-r border-[#884FA4]/40"
                    : "text-[#D0C2DD] hover:text-white hover:bg-[#281333] border-l-4 border-l-transparent"
                } ${isCollapsed ? "justify-center px-0 py-3" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#381648] text-[#5ECBDB]"
                      : "bg-[#24102F] text-[#B8A3C9] group-hover:text-white group-hover:bg-[#361845]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text Content */}
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1 leading-snug">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[14px] font-bold tracking-[-0.01em] whitespace-nowrap ${
                          isActive ? "text-white" : "text-[#E8E0F0] group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Badges */}
                      {item.badge !== undefined && (
                        <>
                          {item.isLiveBadge ? (
                            <span className="text-[10.5px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#157A5A]/30 text-[#42DFAC] border border-[#157A5A]/50 shrink-0 uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#42DFAC] animate-pulse" />
                              <span>{item.badge}</span>
                            </span>
                          ) : (
                            <span className="text-[11.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#271033] text-[#5ECBDB] border border-[#5ECBDB]/30 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <span className="text-[12px] text-[#A594B5] font-normal mt-0.5 group-hover:text-[#C7BAD3] truncate">
                      {item.description}
                    </span>
                  </div>
                )}

                {/* Collapsed dot badge */}
                {isCollapsed && item.badge !== undefined && (
                  <span
                    className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ring-2 ring-[#170B1F] ${
                      item.isLiveBadge ? "bg-[#42DFAC]" : "bg-[#5ECBDB]"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer: Quick Return to Public Site with plenty of bottom margin to clear overlays */}
      <div className="p-3.5 pb-6 border-t border-[#341C3D] shrink-0 bg-[#120719]">
        <Link
          href="/"
          className={`flex items-center gap-2.5 text-[13.5px] font-bold text-[#5ECBDB] hover:text-white transition-all p-2.5 rounded-xl hover:bg-[#281333] border border-transparent hover:border-[#5B2C72]/40 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Ver Landing Pública" : undefined}
        >
          <div className="w-7 h-7 rounded-md bg-[#5ECBDB]/15 text-[#5ECBDB] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          {!isCollapsed && <span className="tracking-[-0.01em]">Ver Landing Pública</span>}
        </Link>
      </div>
    </aside>
  );
}
