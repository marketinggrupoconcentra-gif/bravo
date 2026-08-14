"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";
import { DEFAULT_CMS_SECTIONS, CmsSectionConfig } from "@/config/cmsDefault";
import { CheckIcon } from "@/components/icons/bravo";
import { ColorPalettePicker } from "./ColorPalettePicker";

const AVAILABLE_PAGES = [
  { slug: "home", name: "Página Principal (Inicio)", path: "/" },
  { slug: "soluciones", name: "Soluciones", path: "/soluciones" },
  { slug: "tipos-de-deuda", name: "Tipos de Deuda", path: "/tipos-de-deuda" },
  { slug: "como-funciona", name: "Cómo Funciona", path: "/como-funciona" },
  { slug: "requisitos", name: "Requisitos", path: "/requisitos" },
  { slug: "casos", name: "Casos de Éxito", path: "/casos" },
  { slug: "recursos", name: "Recursos y Guías", path: "/recursos" },
];

const SECTION_DOM_TARGETS: Record<string, string> = {
  hero: "hero-section",
  process: "como-funciona",
  advisor: "advisor-section",
  calculator: "calculator-section",
  faq: "faq-section",
  final_cta: "final-cta-section",
};

interface DeviceOption {
  id: string;
  name: string;
  category: "desktop" | "tablet" | "mobile";
  width: number;
  height: number;
}

const DEVICE_OPTIONS: DeviceOption[] = [
  { id: "desktop-1440", name: "Desktop 1440px", category: "desktop", width: 1440, height: 900 },
  { id: "laptop-1280", name: "Laptop 1280px", category: "desktop", width: 1280, height: 800 },
  { id: "tablet-1024", name: "iPad 1024px (Horizontal)", category: "tablet", width: 1024, height: 768 },
  { id: "tablet-768", name: "iPad 768px (Vertical)", category: "tablet", width: 768, height: 1024 },
  { id: "mobile-430", name: "iPhone Max 430px", category: "mobile", width: 430, height: 932 },
  { id: "mobile-390", name: "iPhone 390px (Estándar)", category: "mobile", width: 390, height: 844 },
  { id: "mobile-360", name: "Android 360px (Compacto)", category: "mobile", width: 360, height: 740 },
];

type SubmoduleTab = "texts" | "colors" | "buttons" | "animations";

export function LandingEditor() {
  const { sections, getSection, updateSection, resetSection } = useCms();
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [activeSubmodule, setActiveSubmodule] = useState<SubmoduleTab>("texts");

  // Filter sections for the selected page
  const pageSections = useMemo(
    () => Object.values(DEFAULT_CMS_SECTIONS).filter((s) => s.pageSlug === selectedPage),
    [selectedPage]
  );

  const [selectedSectionKey, setSelectedSectionKey] = useState<string>(
    pageSections[0]?.id || "home_hero"
  );

  const currentSavedSection = getSection(selectedSectionKey);

  // Form Draft State (Transient until saved)
  const [formData, setFormData] = useState<CmsSectionConfig>(currentSavedSection);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // =========================================================================
  // CLEAN DEVTOOLS VIEWPORT SCALING & EMULATION ENGINE
  // =========================================================================
  const [activeCategory, setActiveCategory] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("desktop-1440");
  const [customWidth, setCustomWidth] = useState<number>(1440);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [zoomMode, setZoomMode] = useState<"fit" | "75" | "100">("fit");
  const [showDeviceBezel, setShowDeviceBezel] = useState<boolean>(true);
  const [workbenchLayout, setWorkbenchLayout] = useState<"split" | "wide" | "full">("split");
  const [previewKey, setPreviewKey] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [containerHeight, setContainerHeight] = useState<number>(750);

  // Target page URL for iframe
  const selectedPageObj = AVAILABLE_PAGES.find((p) => p.slug === selectedPage) || AVAILABLE_PAGES[0];
  const previewPath = selectedPageObj.path;

  // Measure stage container width on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(Math.floor(entry.contentRect.width));
          setContainerHeight(Math.max(600, Math.floor(entry.contentRect.height)));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [workbenchLayout]);

  // Devices in the current active category
  const categoryDevices = useMemo(
    () => DEVICE_OPTIONS.filter((d) => d.category === activeCategory),
    [activeCategory]
  );

  const currentDevice = DEVICE_OPTIONS.find((d) => d.id === selectedDeviceId) || DEVICE_OPTIONS[0];

  // Active Dimensions (considering rotation)
  const activeWidth = isRotated ? (currentDevice.height || 844) : customWidth;

  // Calculate True Scale Factor for DevTools-like viewport emulation
  const computedScaleFactor = useMemo(() => {
    if (zoomMode === "75") return 0.75;
    if (zoomMode === "100") return 1.0;

    // "fit" mode: auto-scale down so activeWidth fits seamlessly inside containerWidth
    const availableW = Math.max(300, containerWidth - 36);
    if (activeWidth > availableW) {
      return Number((availableW / activeWidth).toFixed(3));
    }
    return 1.0;
  }, [zoomMode, containerWidth, activeWidth]);

  // Scaled height for the inner iframe viewport
  const unscaledIframeHeight = useMemo(() => {
    const baseHeight = Math.max(700, containerHeight - 30);
    return Math.round(baseHeight / computedScaleFactor);
  }, [containerHeight, computedScaleFactor]);

  // Dynamic Breakpoint Label
  const breakpointShortLabel = useMemo(() => {
    if (activeWidth < 640) return "xs (<640)";
    if (activeWidth < 768) return "sm (640-768)";
    if (activeWidth < 1024) return "md (768-1024)";
    if (activeWidth < 1280) return "lg (1024-1280)";
    if (activeWidth < 1536) return "xl (1280-1536)";
    return "2xl (≥1536)";
  }, [activeWidth]);

  // Send real-time draft updates to the iframe
  const syncDraftToPreview = useCallback((updatedData: CmsSectionConfig) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "BRAVO_CMS_PREVIEW_SYNC",
          sectionId: updatedData.id,
          data: updatedData,
        },
        "*"
      );
    }
  }, []);

  // Scroll to section inside iframe
  const scrollToCurrentSectionInPreview = (secId: string) => {
    const targetDomId = SECTION_DOM_TARGETS[secId] || secId;
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "BRAVO_CMS_SCROLL_TO",
          targetId: targetDomId,
        },
        "*"
      );
    }
  };

  // Change Category (Desktop, Tablet, Mobile)
  const handleSelectCategory = (cat: "desktop" | "tablet" | "mobile") => {
    setActiveCategory(cat);
    const firstDev = DEVICE_OPTIONS.find((d) => d.category === cat);
    if (firstDev) {
      setSelectedDeviceId(firstDev.id);
      setCustomWidth(firstDev.width);
      setIsRotated(false);
    }
  };

  // Change Specific Device Preset
  const handleSelectDevice = (device: DeviceOption) => {
    setSelectedDeviceId(device.id);
    setActiveCategory(device.category);
    setCustomWidth(device.width);
    setIsRotated(false);
  };

  // Highlight specific element in preview iframe
  const highlightElementInPreview = useCallback(
    (fieldKey: string, fieldLabel: string) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "BRAVO_CMS_HIGHLIGHT_ELEMENT",
            sectionId: formData.id,
            fieldKey,
            fieldLabel,
          },
          "*"
        );
      }
    },
    [formData.id]
  );

  // Clear active highlight
  const clearHighlightInPreview = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "BRAVO_CMS_CLEAR_HIGHLIGHT",
        },
        "*"
      );
    }
  }, []);

  // When changing section, hydrate form from saved state
  const handleSelectSection = (key: string) => {
    setSelectedSectionKey(key);
    const sec = getSection(key);
    setFormData(sec);
    setHasUnsavedChanges(false);
    setSaveSuccess(false);

    // Scroll to and highlight section in preview
    setTimeout(() => {
      scrollToCurrentSectionInPreview(sec.sectionId);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "BRAVO_CMS_HIGHLIGHT_ELEMENT",
            sectionId: sec.id,
            fieldKey: "section",
            fieldLabel: sec.sectionName,
          },
          "*"
        );
      }
    }, 150);
  };

  // When changing page, set first section & reload preview path
  const handleSelectPage = (pageSlug: string) => {
    setSelectedPage(pageSlug);
    const firstSection = Object.values(DEFAULT_CMS_SECTIONS).find(
      (s) => s.pageSlug === pageSlug
    );
    if (firstSection) {
      setSelectedSectionKey(firstSection.id);
      setFormData(getSection(firstSection.id));
      setHasUnsavedChanges(false);
      setSaveSuccess(false);
    }
  };

  // Handle generic field change in form and sync to preview immediately
  const handleFieldChange = (field: keyof CmsSectionConfig, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setHasUnsavedChanges(true);
    setSaveSuccess(false);

    // Broadcast live draft update to preview iframe in real time!
    syncDraftToPreview(updated);
  };

  // Handle nested custom color changes
  const handleCustomColorChange = (colorKey: string, hexValue: string) => {
    const updatedColors = {
      ...(formData.customColors || {}),
      [colorKey]: hexValue,
    };
    const updated = { ...formData, customColors: updatedColors };
    setFormData(updated);
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
    syncDraftToPreview(updated);
  };

  // Handle nested animation config changes
  const handleAnimationChange = (animKey: string, value: any) => {
    const updatedAnim = {
      ...(formData.animationConfig || {}),
      [animKey]: value,
    };
    const updated = { ...formData, animationConfig: updatedAnim };
    setFormData(updated);
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
    syncDraftToPreview(updated);
  };

  // Save changes permanently
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updateSection(selectedSectionKey, formData);
    setIsSaving(false);
    if (success) {
      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Discard draft and revert preview to saved state
  const handleDiscardDraft = () => {
    const saved = getSection(selectedSectionKey);
    setFormData(saved);
    setHasUnsavedChanges(false);
    syncDraftToPreview(saved);
  };

  // Reset to original system default
  const handleResetToDefault = () => {
    if (
      confirm("¿Deseas restablecer esta sección a los textos, fondos y colores originales de fábrica?")
    ) {
      resetSection(selectedSectionKey);
      const defaultSec = DEFAULT_CMS_SECTIONS[selectedSectionKey];
      if (defaultSec) {
        setFormData(defaultSec);
        syncDraftToPreview(defaultSec);
        setHasUnsavedChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    }
  };

  // When iframe loads, sync all current sections & scroll to active section
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Sync all current sections to iframe
      Object.entries(sections).forEach(([id, secData]) => {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "BRAVO_CMS_PREVIEW_SYNC",
            sectionId: id,
            data: id === selectedSectionKey ? formData : secData,
          },
          "*"
        );
      });

      // Scroll to current section
      setTimeout(() => {
        scrollToCurrentSectionInPreview(formData.sectionId);
      }, 400);
    }
  };

  const isFullLayout = workbenchLayout === "full";
  const isWideLayout = workbenchLayout === "wide";

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Hierarchy Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] font-extrabold uppercase tracking-wider mb-1">
            <span>Editor CMS Modular</span>
            <span>·</span>
            <span className="text-[#157A5A]">Scroll Sincronizado y Fluido</span>
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
            Personalización de Textos, Colores RGB, Botones y Animaciones
          </h2>
        </div>

        {/* Top Actions: Layout Mode & Public Page Link */}
        <div className="flex items-center gap-2.5">
          {/* Layout Split Mode Selector */}
          <div className="flex items-center bg-[#FAF8FB] p-1 rounded-xl border border-[#C9C1D4]">
            <button
              onClick={() => setWorkbenchLayout("split")}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                workbenchLayout === "split"
                  ? "bg-[#5B2C72] text-white shadow-2xs"
                  : "text-[#5B5266] hover:text-[#17131F]"
              }`}
              title="Disposición 50/50"
            >
              50 / 50
            </button>
            <button
              onClick={() => setWorkbenchLayout("wide")}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                workbenchLayout === "wide"
                  ? "bg-[#5B2C72] text-white shadow-2xs"
                  : "text-[#5B5266] hover:text-[#17131F]"
              }`}
              title="Preview Ampliado"
            >
              Canvas Amplio
            </button>
            <button
              onClick={() => setWorkbenchLayout("full")}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                workbenchLayout === "full"
                  ? "bg-[#5B2C72] text-white shadow-2xs"
                  : "text-[#5B5266] hover:text-[#17131F]"
              }`}
              title="100% Canvas Completo"
            >
              100% Canvas
            </button>
          </div>

          <Link
            href={previewPath}
            target="_blank"
            className="inline-flex items-center gap-2 bg-[#FAF8FB] hover:bg-[#F5EDF9] text-[#5B2C72] border border-[#C9C1D4] font-bold text-[13px] px-3.5 py-2 rounded-full transition-colors cursor-pointer"
          >
            <span>Página pública</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main Split Layout: Editor Form vs Clean DevTools-Scaled Preview */}
      <div className={`grid ${isFullLayout ? "grid-cols-1" : isWideLayout ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1 xl:grid-cols-12"} gap-6 items-start`}>
        {/* ===================================================================
            LEFT COLUMN: Jerarquía y Formulario con Scroll Independiente
            =================================================================== */}
        {!isFullLayout && (
          <div className={`${isWideLayout ? "lg:col-span-5" : "xl:col-span-5"} flex flex-col gap-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-1`}>
            {/* NIVEL 1: Selector de Página */}
            <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-[#E7E3EC] shadow-xs flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11.5px] font-mono font-extrabold uppercase text-[#5B2C72] tracking-wider">
                  1. Módulo: Selección de Página
                </span>
                <span className="text-[11px] text-[#8A8095]">7 páginas activas</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_PAGES.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => handleSelectPage(p.slug)}
                    className={`px-3 py-1.5 rounded-full text-[12.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedPage === p.slug
                        ? "bg-[#5B2C72] text-white shadow-2xs"
                        : "bg-[#FAF8FB] text-[#5B5266] border border-[#E7E3EC] hover:border-[#AB6CCA] hover:text-[#5B2C72]"
                    }`}
                  >
                    <span>{p.name}</span>
                    {selectedPage === p.slug && <CheckIcon size={12} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* NIVEL 2: Selector de Segmento / Sección */}
            <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-[#E7E3EC] shadow-xs flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11.5px] font-mono font-extrabold uppercase text-[#5B2C72] tracking-wider">
                  2. Submódulo: Sección a Personalizar
                </span>
                <button
                  onClick={() => scrollToCurrentSectionInPreview(formData.sectionId)}
                  className="text-[11px] text-[#5B2C72] hover:underline font-bold"
                >
                  Localizar en preview ↓
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {pageSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className={`p-2.5 rounded-xl text-[12px] font-bold text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedSectionKey === sec.id
                        ? "bg-[#2E1739] text-white shadow-2xs border-l-3 border-[#5ECBDB]"
                        : "bg-[#FAF8FB] text-[#5B5266] border border-[#E7E3EC] hover:bg-[#F5EDF9] hover:text-[#5B2C72]"
                    }`}
                  >
                    <span className="truncate">{sec.sectionName}</span>
                    <span className="text-[10px] font-mono opacity-70">#{sec.sectionId}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* NIVEL 3: Panel de Personalización Modular con Pestañas */}
            <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
              {/* Header del Formulario */}
              <div className="flex justify-between items-start border-b border-[#EAE5EF] pb-3">
                <div>
                  <span className="text-[11px] font-mono text-[#5B2C72] font-bold uppercase block">
                    Propiedades: {formData.sectionName}
                  </span>
                  <span className="text-[14px] font-extrabold text-[#17131F]">
                    Personalizar Contenidos y Estilos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasUnsavedChanges && (
                    <button
                      type="button"
                      onClick={handleDiscardDraft}
                      className="text-[11.5px] text-[#8A8095] hover:text-[#B02A24] font-bold cursor-pointer underline"
                    >
                      Descartar borrador
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11.5px] text-[#8A8095] hover:text-[#5B2C72] font-bold cursor-pointer"
                    title="Restablecer valores de fábrica"
                  >
                    Restablecer
                  </button>
                </div>
              </div>

              {/* Notification Banner */}
              {saveSuccess && (
                <div className="bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] p-3 rounded-[12px] text-[13px] font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckIcon size={16} />
                  <span>¡Cambios publicados y guardados con éxito!</span>
                </div>
              )}

              {hasUnsavedChanges && !saveSuccess && (
                <div className="bg-[#FFF9E6] border border-[#FEDF89] text-[#B54708] p-2.5 rounded-[12px] text-[12px] font-bold flex items-center justify-between">
                  <span>Modificaciones en vivo en el preview (sin guardar).</span>
                  <span className="text-[11px] font-mono opacity-80">Borrador</span>
                </div>
              )}

              {/* Submodule Segmented Tabs (Textos, Colores, Botones, Animaciones) */}
              <div className="flex items-center bg-[#FAF8FB] p-1 rounded-xl border border-[#E7E3EC] overflow-x-auto gap-1">
                {[
                  { id: "texts", label: "Textos", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                  { id: "colors", label: "Colores y RGB", icon: "M7 21a4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4 4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
                  { id: "buttons", label: "Botones", icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" },
                  { id: "animations", label: "Animaciones", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSubmodule(tab.id as SubmoduleTab)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      activeSubmodule === tab.id
                        ? "bg-[#5B2C72] text-white shadow-2xs"
                        : "text-[#5B5266] hover:text-[#17131F]"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4 pt-1">
                {/* =============================================================
                    SUBMÓDULO 1: TEXTOS Y COPYS
                    ============================================================= */}
                {activeSubmodule === "texts" && (
                  <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
                    {/* Badge */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F] flex items-center justify-between">
                        <span>Badge / Tagline Superior</span>
                        <span className="text-[10.5px] font-mono text-[#5ECBDB] font-normal">resalta en preview</span>
                      </label>
                      <input
                        type="text"
                        value={formData.badge || ""}
                        onFocus={() => highlightElementInPreview("badge", "Badge Superior")}
                        onMouseEnter={() => highlightElementInPreview("badge", "Badge Superior")}
                        onChange={(e) => handleFieldChange("badge", e.target.value)}
                        placeholder="Ej. PROGRAMA DE LIQUIDACIÓN Y AHORRO EN MÉXICO"
                        className="w-full p-2.5 bg-[#FAF8FB] focus:bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] focus:ring-2 focus:ring-[#5ECBDB]/20 rounded-lg text-[13.5px] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Titular */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F] flex items-center justify-between">
                        <span>Titular Principal (H1/H2) <span className="text-[#B02A24]">*</span></span>
                        <span className="text-[10.5px] font-mono text-[#5ECBDB] font-normal">resalta en preview</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formData.title || ""}
                        onFocus={() => highlightElementInPreview("title", "Titular Principal")}
                        onMouseEnter={() => highlightElementInPreview("title", "Titular Principal")}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        placeholder="Titular de la sección"
                        className="w-full p-2.5 bg-[#FAF8FB] focus:bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] focus:ring-2 focus:ring-[#5ECBDB]/20 rounded-lg text-[14px] font-bold focus:outline-none transition-all resize-y"
                      />
                    </div>

                    {/* Subtítulo */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F] flex items-center justify-between">
                        <span>Subtítulo / Bajada Explicativa</span>
                        <span className="text-[10.5px] font-mono text-[#5ECBDB] font-normal">resalta en preview</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.subtitle || ""}
                        onFocus={() => highlightElementInPreview("subtitle", "Subtítulo Descriptivo")}
                        onMouseEnter={() => highlightElementInPreview("subtitle", "Subtítulo Descriptivo")}
                        onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                        placeholder="Texto descriptivo complementario"
                        className="w-full p-2.5 bg-[#FAF8FB] focus:bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] focus:ring-2 focus:ring-[#5ECBDB]/20 rounded-lg text-[13px] focus:outline-none transition-all resize-y text-[#3A3344]"
                      />
                    </div>
                  </div>
                )}

                {/* =============================================================
                    SUBMÓDULO 2: COLORES, FONDOS Y TABLA RGB / HEX
                    ============================================================= */}
                {activeSubmodule === "colors" && (
                  <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
                    {/* Atmósfera de Fondo Predefinida */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[12px] font-bold text-[#17131F]">
                        Estilo de Atmósfera de Fondo:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "default", label: "Estándar (#F1EEF3)" },
                          { id: "dark-purple", label: "Púrpura (#2E1739)" },
                          { id: "aurora-glow", label: "Aurora con Ondas" },
                          { id: "light-offwhite", label: "Blanco Cálido (#FAF8FB)" },
                          { id: "pure-white", label: "Blanco Puro (#FFFFFF)" },
                        ].map((bg) => (
                          <label
                            key={bg.id}
                            onMouseEnter={() => highlightElementInPreview("section", "Atmósfera / Fondo")}
                            className={`p-2.5 rounded-xl border text-[12px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                              formData.backgroundStyle === bg.id
                                ? "border-[#5B2C72] bg-[#F5EDF9] text-[#5B2C72]"
                                : "border-[#E7E3EC] bg-[#FAF8FB] text-[#5B5266] hover:bg-white"
                            }`}
                          >
                            <span className="truncate">{bg.label}</span>
                            <input
                              type="radio"
                              name="backgroundStyle"
                              value={bg.id}
                              checked={formData.backgroundStyle === bg.id}
                              onChange={() => {
                                handleFieldChange("backgroundStyle", bg.id);
                                highlightElementInPreview("section", "Atmósfera / Fondo");
                              }}
                              className="text-[#5B2C72] focus:ring-[#5B2C72]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Color Primario Personalizado con Tabla RGB */}
                    <ColorPalettePicker
                      label="Color de Botón y Acento Primario"
                      value={formData.customColors?.primaryColor || "#5B2C72"}
                      onChange={(hex) => handleCustomColorChange("primaryColor", hex)}
                      onFocusElement={() => highlightElementInPreview("primaryCta", "Color de Botón")}
                    />

                    {/* Color de Fondo Personalizado con Tabla RGB */}
                    <ColorPalettePicker
                      label="Color de Fondo Personalizado"
                      value={formData.customColors?.backgroundColor || "#FBF8FC"}
                      onChange={(hex) => handleCustomColorChange("backgroundColor", hex)}
                      onFocusElement={() => highlightElementInPreview("section", "Color de Fondo")}
                    />

                    {/* Color de Texto Personalizado con Tabla RGB */}
                    <ColorPalettePicker
                      label="Color de Tipografía y Titulares"
                      value={formData.customColors?.textColor || "#17131F"}
                      onChange={(hex) => handleCustomColorChange("textColor", hex)}
                      onFocusElement={() => highlightElementInPreview("title", "Color de Texto")}
                    />
                  </div>
                )}

                {/* =============================================================
                    SUBMÓDULO 3: BOTONES, CTAS Y RADIOS DE BORDE
                    ============================================================= */}
                {activeSubmodule === "buttons" && (
                  <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
                    {/* Selector de Estilo Visual de Botón */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-bold text-[#17131F]">
                        Variante Visual del Botón Primario:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "primary-purple", label: "Púrpura Bravo", desc: "Clásico con alto contraste" },
                          { id: "cyan-glow", label: "Cian Glow", desc: "Luminoso con halo cian" },
                          { id: "emerald-success", label: "Verde Esmeralda", desc: "Éxito y seguridad" },
                          { id: "glass-border", label: "Glass con Borde", desc: "Contorno elegante" },
                          { id: "minimal-white", label: "Blanco Minimal", desc: "Superficie pura" },
                        ].map((btnStyle) => (
                          <button
                            key={btnStyle.id}
                            type="button"
                            onClick={() => {
                              handleFieldChange("buttonStyle", btnStyle.id);
                              highlightElementInPreview("primaryCta", `Botón: ${btnStyle.label}`);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                              (formData.buttonStyle || "primary-purple") === btnStyle.id
                                ? "border-[#5B2C72] bg-[#F5EDF9] text-[#5B2C72] shadow-2xs ring-1 ring-[#5B2C72]"
                                : "border-[#E7E3EC] bg-[#FAF8FB] text-[#5B5266] hover:bg-white"
                            }`}
                          >
                            <span className="text-[12px] font-bold">{btnStyle.label}</span>
                            <span className="text-[10px] text-[#8A8095]">{btnStyle.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Radio de Esquinas (Border Radius) */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-bold text-[#17131F]">
                        Forma / Radio de Esquinas:
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: "full", label: "Redondo (Pill)", radius: "9999px" },
                          { id: "lg", label: "Curvo (16px)", radius: "16px" },
                          { id: "sm", label: "Suave (8px)", radius: "8px" },
                          { id: "none", label: "Recto (0px)", radius: "0px" },
                        ].map((rad) => (
                          <button
                            key={rad.id}
                            type="button"
                            onClick={() => {
                              handleFieldChange("buttonBorderRadius", rad.id);
                              highlightElementInPreview("primaryCta", `Radio: ${rad.label}`);
                            }}
                            className={`p-2 border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              (formData.buttonBorderRadius || "full") === rad.id
                                ? "border-[#5B2C72] bg-[#5B2C72] text-white shadow-2xs"
                                : "border-[#E7E3EC] bg-[#FAF8FB] text-[#5B5266] hover:bg-white"
                            }`}
                            style={{ borderRadius: rad.radius }}
                          >
                            <span className="text-[11px] font-bold">{rad.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Configuración de Textos y URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="flex flex-col gap-1 p-2.5 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC]">
                        <label className="text-[11px] font-bold text-[#5B2C72]">
                          Texto Botón Principal:
                        </label>
                        <input
                          type="text"
                          value={formData.primaryCtaText || ""}
                          onFocus={() => highlightElementInPreview("primaryCta", "Botón Principal")}
                          onMouseEnter={() => highlightElementInPreview("primaryCta", "Botón Principal")}
                          onChange={(e) => handleFieldChange("primaryCtaText", e.target.value)}
                          placeholder="Ej. Revisar mi caso"
                          className="w-full p-2 bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] rounded-md text-[12.5px] font-bold focus:outline-none"
                        />
                        <input
                          type="text"
                          value={formData.primaryCtaUrl || ""}
                          onFocus={() => highlightElementInPreview("primaryCta", "Destino URL")}
                          onChange={(e) => handleFieldChange("primaryCtaUrl", e.target.value)}
                          placeholder="/formulario"
                          className="w-full p-1.5 bg-white border border-[#E7E3EC] rounded-md text-[11.5px] font-mono focus:border-[#5B2C72] focus:outline-none text-[#5B5266]"
                        />
                      </div>

                      <div className="flex flex-col gap-1 p-2.5 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC]">
                        <label className="text-[11px] font-bold text-[#5B2C72]">
                          Texto Botón Secundario:
                        </label>
                        <input
                          type="text"
                          value={formData.secondaryCtaText || ""}
                          onFocus={() => highlightElementInPreview("secondaryCta", "Botón Secundario")}
                          onMouseEnter={() => highlightElementInPreview("secondaryCta", "Botón Secundario")}
                          onChange={(e) => handleFieldChange("secondaryCtaText", e.target.value)}
                          placeholder="Ej. Cómo funciona"
                          className="w-full p-2 bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] rounded-md text-[12.5px] font-bold focus:outline-none"
                        />
                        <input
                          type="text"
                          value={formData.secondaryCtaUrl || ""}
                          onFocus={() => highlightElementInPreview("secondaryCta", "Destino URL")}
                          onChange={(e) => handleFieldChange("secondaryCtaUrl", e.target.value)}
                          placeholder="/como-funciona"
                          className="w-full p-1.5 bg-white border border-[#E7E3EC] rounded-md text-[11.5px] font-mono focus:border-[#5B2C72] focus:outline-none text-[#5B5266]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* =============================================================
                    SUBMÓDULO 4: ANIMACIONES Y EFECTOS VISUALES
                    ============================================================= */}
                {activeSubmodule === "animations" && (
                  <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
                    {/* Efecto de Resplandor Glow */}
                    <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-[#17131F]">
                          Resplandores Ambientales (Glow Orbs)
                        </span>
                        <span className="text-[11px] text-[#5B5266]">
                          Luces suaves difuminadas en las esquinas de la sección.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const current = formData.animationConfig?.glowEnabled !== false;
                          handleAnimationChange("glowEnabled", !current);
                          highlightElementInPreview("section", `Glow: ${!current ? "ON" : "OFF"}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                          formData.animationConfig?.glowEnabled !== false
                            ? "bg-[#157A5A] text-white shadow-2xs"
                            : "bg-[#E7E3EC] text-[#5B5266]"
                        }`}
                      >
                        {formData.animationConfig?.glowEnabled !== false ? "Activado" : "Desactivado"}
                      </button>
                    </div>

                    {/* Ondas Vectoriales de Fondo */}
                    <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-[#17131F]">
                          Ondas Vectoriales Flotantes
                        </span>
                        <span className="text-[11px] text-[#5B5266]">
                          Líneas orgánicas con movimiento fluido y armónico.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const current = formData.animationConfig?.wavesEnabled !== false;
                          handleAnimationChange("wavesEnabled", !current);
                          highlightElementInPreview("section", `Ondas: ${!current ? "ON" : "OFF"}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                          formData.animationConfig?.wavesEnabled !== false
                            ? "bg-[#157A5A] text-white shadow-2xs"
                            : "bg-[#E7E3EC] text-[#5B5266]"
                        }`}
                      >
                        {formData.animationConfig?.wavesEnabled !== false ? "Activado" : "Desactivado"}
                      </button>
                    </div>

                    {/* Velocidad de Animación */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-bold text-[#17131F]">
                        Ritmo / Velocidad de Movimiento:
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: "normal", label: "Estándar" },
                          { id: "slow", label: "Suave / Zen" },
                          { id: "fast", label: "Dinámica" },
                          { id: "none", label: "Estática" },
                        ].map((spd) => (
                          <button
                            key={spd.id}
                            type="button"
                            onClick={() => {
                              handleAnimationChange("speed", spd.id);
                              highlightElementInPreview("section", `Velocidad: ${spd.label}`);
                            }}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              (formData.animationConfig?.speed || "normal") === spd.id
                                ? "border-[#5B2C72] bg-[#5B2C72] text-white shadow-2xs"
                                : "border-[#E7E3EC] bg-[#FAF8FB] text-[#5B5266] hover:bg-white"
                            }`}
                          >
                            <span className="text-[11px] font-bold">{spd.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón de Guardado y Publicación */}
                <div className="flex justify-end gap-3 pt-3 border-t border-[#EAE5EF]">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full sm:w-auto px-6 py-3 rounded-full font-extrabold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      hasUnsavedChanges
                        ? "bg-[#157A5A] hover:bg-[#106247] text-white animate-pulse"
                        : "bg-[#5B2C72] hover:bg-[#45205A] text-white"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Guardando cambios...</span>
                      </>
                    ) : (
                      <span>Guardar y Publicar en Producción</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            RIGHT COLUMN: STREAMLINED & CLEAN DEVTOOLS VIEWPORT WORKBENCH
            =================================================================== */}
        <div className={`${isFullLayout ? "col-span-1" : isWideLayout ? "lg:col-span-7" : "xl:col-span-7"} flex flex-col gap-3 sticky top-[80px]`}>
          {/* Streamlined Clean Control Bar */}
          <div className="bg-[#1E0F26] text-white p-3 rounded-[18px] border border-[#3A2244] flex flex-col gap-2.5 shadow-md">
            {/* Primary Clean Row: Category Switcher, Device Selector & Action Tools */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Device Category Segmented Control */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#2E1739] p-1 rounded-xl border border-[#4A3A57]">
                  {[
                    { id: "desktop", label: "Desktop", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                    { id: "tablet", label: "Tablet", icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
                    { id: "mobile", label: "Móvil", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeCategory === cat.id
                          ? "bg-[#5B2C72] text-white shadow-2xs border border-[#AB6CCA]/50"
                          : "text-[#C7B8D2] hover:text-white"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                      </svg>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Specific Device Resolution Select Dropdown */}
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    const dev = DEVICE_OPTIONS.find((d) => d.id === e.target.value);
                    if (dev) handleSelectDevice(dev);
                  }}
                  className="bg-[#2E1739] text-[#5ECBDB] font-mono text-[12px] font-bold border border-[#4A3A57] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#5ECBDB] cursor-pointer"
                >
                  {categoryDevices.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#1E0F26] text-white">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right: Quick Zoom, Rotate, Frame & Refresh Tools */}
              <div className="flex items-center gap-1.5 ml-auto">
                {/* Breakpoint Badge */}
                <span className="hidden sm:inline-flex text-[11px] font-mono text-[#5ECBDB] bg-[#2E1739] px-2.5 py-1 rounded-lg border border-[#4A3A57]">
                  {breakpointShortLabel}
                </span>

                {/* Scale Mode */}
                <div className="flex items-center bg-[#2E1739] p-0.5 rounded-lg border border-[#4A3A57]">
                  <button
                    onClick={() => setZoomMode("fit")}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      zoomMode === "fit" ? "bg-[#5ECBDB] text-[#17131F]" : "text-[#C7B8D2] hover:text-white"
                    }`}
                    title="Ajuste automático a la pantalla"
                  >
                    Auto ({Math.round(computedScaleFactor * 100)}%)
                  </button>
                  <button
                    onClick={() => setZoomMode("100")}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      zoomMode === "100" ? "bg-[#5ECBDB] text-[#17131F]" : "text-[#C7B8D2] hover:text-white"
                    }`}
                    title="Tamaño real 100%"
                  >
                    100%
                  </button>
                </div>

                {/* Rotate Orientation Button */}
                <button
                  onClick={() => setIsRotated(!isRotated)}
                  className={`p-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    isRotated
                      ? "bg-[#5ECBDB] text-[#17131F] border-[#5ECBDB]"
                      : "bg-[#2E1739] text-[#C7B8D2] border-[#4A3A57] hover:text-white"
                  }`}
                  title={isRotated ? "Girar a Retrato" : "Girar a Paisaje"}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                {/* Device Frame Bezel Toggle */}
                <button
                  onClick={() => setShowDeviceBezel(!showDeviceBezel)}
                  className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    showDeviceBezel
                      ? "bg-[#2E1739] text-[#5ECBDB] border-[#5ECBDB]/40"
                      : "bg-[#2E1739] text-[#8A8095] border-[#4A3A57]"
                  }`}
                  title="Activar/Desactivar marco físico del dispositivo"
                >
                  Marco
                </button>

                {/* Reload Button */}
                <button
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="p-1.5 rounded-lg bg-[#2E1739] hover:bg-[#4A3A57] text-[#C7B8D2] hover:text-white border border-[#4A3A57] transition-colors cursor-pointer"
                  title="Recargar vista previa"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Secondary Compact Slider: Ancho personalizado en tiempo real */}
            <div className="flex items-center gap-3 bg-[#170B1D] px-3 py-1.5 rounded-xl border border-[#2E1739]">
              <span className="text-[11px] font-mono text-[#8A8095] shrink-0">Ancho libre:</span>
              <input
                type="range"
                min={320}
                max={1536}
                step={10}
                value={customWidth}
                onChange={(e) => {
                  setCustomWidth(parseInt(e.target.value, 10));
                  setSelectedDeviceId("custom");
                }}
                className="w-full h-1 bg-[#3A2244] rounded-lg appearance-none cursor-pointer accent-[#5ECBDB]"
              />
              <span className="text-[11.5px] font-mono text-[#5ECBDB] font-bold shrink-0 min-w-[55px]">
                {activeWidth} px
              </span>
            </div>
          </div>

          {/* =================================================================
              DEVTOOLS STAGE: Proportional Viewport Scaling Sandbox
              ================================================================= */}
          <div
            ref={containerRef}
            className="bg-[#120817] p-4 rounded-[26px] border border-[#3A2244] shadow-2xl overflow-hidden flex justify-center items-start min-h-[640px] h-[calc(100vh-250px)] max-h-[88vh]"
          >
            {/* Viewport Frame Container with centered transform-origin */}
            <div
              className="relative transition-all duration-150 ease-out flex justify-center items-start h-full"
              style={{
                width: `${activeWidth * computedScaleFactor}px`,
              }}
            >
              {/* Scaled Frame Box */}
              <div
                className={`flex flex-col bg-white overflow-hidden ${
                  showDeviceBezel && (currentDevice.category === "mobile" || currentDevice.category === "tablet")
                    ? "rounded-[36px] border-[8px] border-[#2E1739] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/20"
                    : "rounded-[12px] border border-[#3A2244] shadow-2xl"
                }`}
                style={{
                  width: `${activeWidth}px`,
                  minWidth: `${activeWidth}px`,
                  maxWidth: `${activeWidth}px`,
                  height: `${unscaledIframeHeight}px`,
                  transform: `scale(${computedScaleFactor})`,
                  transformOrigin: "top center",
                }}
              >
                {/* Mobile Notch simulation */}
                {showDeviceBezel && currentDevice.category === "mobile" && (
                  <div className="w-full bg-[#2E1739] h-4 flex justify-center items-center shrink-0">
                    <div className="w-16 h-2.5 bg-black rounded-full" />
                  </div>
                )}

                {/* Real Landing Page Iframe with True Viewport Dimensions */}
                <iframe
                  key={`${previewPath}_${previewKey}`}
                  ref={iframeRef}
                  src={`${previewPath}?preview=1`}
                  onLoad={handleIframeLoad}
                  className="w-full h-full flex-grow border-0"
                  style={{
                    width: `${activeWidth}px`,
                    height: "100%",
                  }}
                  title="DevTools Emulated Landing Page Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
