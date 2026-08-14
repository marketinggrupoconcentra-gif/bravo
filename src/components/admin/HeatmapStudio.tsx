"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { UserActionLog } from "@/lib/telemetry/logger";

interface HeatmapStudioProps {
  actions?: UserActionLog[];
}

type HeatmapType = "clicks" | "scroll" | "hover";
type DeviceViewport = "desktop" | "tablet" | "mobile";

const PAGE_OPTIONS = [
  { path: "/", name: "Página Principal (Inicio)" },
  { path: "/formulario", name: "Formulario de Precalificación" },
  { path: "/simulador-de-liquidacion", name: "Simulador de Liquidación" },
  { path: "/soluciones", name: "Soluciones de Deuda" },
  { path: "/como-funciona", name: "Cómo Funciona el Plan" },
  { path: "/casos", name: "Casos de Éxito" },
  { path: "/preguntas-frecuentes", name: "Preguntas Frecuentes (FAQ)" },
  { path: "/recursos", name: "Recursos y Guías México" },
];

export function HeatmapStudio({ actions = [] }: HeatmapStudioProps) {
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [heatmapType, setHeatmapType] = useState<HeatmapType>("clicks");
  const [deviceViewport, setDeviceViewport] = useState<DeviceViewport>("desktop");
  const [overlayOpacity, setOverlayOpacity] = useState<number>(90);
  const [scaleFactor, setScaleFactor] = useState<number>(0.60);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);
  const [liveStreamEvents, setLiveStreamEvents] = useState<UserActionLog[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Measure container width dynamically to ensure zero-clipping auto-fit
  useEffect(() => {
    const updateWidth = () => {
      if (previewContainerRef.current) {
        setContainerWidth(previewContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    const timer = setTimeout(updateWidth, 100);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateWidth) : null;
    if (ro && previewContainerRef.current) {
      ro.observe(previewContainerRef.current);
    }
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      ro?.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [isExpandedView, deviceViewport]);

  // Combine parent actions with live stream events
  const allActions = useMemo(() => {
    const combined = [...liveStreamEvents, ...actions];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [liveStreamEvents, actions]);

  // Real events for the selected page
  const pageActions = useMemo(() => {
    return allActions.filter((a) => {
      if (selectedPath === "/") return a.page_path === "/" || a.page_path === "";
      return a.page_path === selectedPath;
    });
  }, [allActions, selectedPath]);

  // Real click events for this page
  const pageClickEvents = useMemo(() => {
    return pageActions.filter(
      (a) => a.event === "cta_click" || a.event === "calculator_interaction" || a.event === "faq_toggle"
    );
  }, [pageActions]);

  const totalRealClicks = pageClickEvents.length;

  // Listen to incoming live events from the embedded replica iframe
  useEffect(() => {
    const handleLiveMessage = (e: MessageEvent) => {
      if (e.data?.type === "BRAVO_HEATMAP_ACTION" && e.data.payload) {
        setLiveStreamEvents((prev) => [e.data.payload, ...prev.slice(0, 50)]);
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<UserActionLog>;
      if (customEvent.detail) {
        setLiveStreamEvents((prev) => [customEvent.detail, ...prev.slice(0, 50)]);
      }
    };

    window.addEventListener("message", handleLiveMessage);
    window.addEventListener("BRAVO_ACTION_LOGGED", handleCustomEvent);

    return () => {
      window.removeEventListener("message", handleLiveMessage);
      window.removeEventListener("BRAVO_ACTION_LOGGED", handleCustomEvent);
    };
  }, []);

  // Post heatmap configuration updates to the iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "BRAVO_HEATMAP_CONFIG",
          enabled: true,
          mode: heatmapType,
          opacity: overlayOpacity,
        },
        "*"
      );
    }
  }, [heatmapType, overlayOpacity]);

  // Dynamic Iframe URL with Native In-Page Heatmap Engine
  const previewIframeUrl = useMemo(() => {
    const separator = selectedPath.includes("?") ? "&" : "?";
    return `${selectedPath}${separator}heatmap=true&mode=${heatmapType}&opacity=${overlayOpacity}`;
  }, [selectedPath, heatmapType, overlayOpacity]);

  // Aggregate Top Elements by Real Clicks
  const topInteractiveElements = useMemo(() => {
    const countsMap: Record<string, { label: string; clicks: number }> = {};

    pageClickEvents.forEach((ev) => {
      const d = (ev.details || {}) as Record<string, any>;
      const key = d.cta_id || d.id || d.placement || ev.event;
      const label = d.cta_text || d.label || key;

      if (!countsMap[key]) {
        countsMap[key] = { label, clicks: 0 };
      }
      countsMap[key].clicks += 1;
    });

    if (Object.keys(countsMap).length === 0) {
      if (selectedPath === "/") {
        return [
          { key: "hero_primary", label: "CTA Hero: Revisar mi caso", clicks: 0 },
          { key: "hero_calc", label: "Calculadora de Liquidación", clicks: 0 },
          { key: "advisor_cta", label: "Hablar con un asesor", clicks: 0 },
          { key: "final_cta", label: "CTA Cierre: Revisar mi caso sin costo", clicks: 0 },
        ];
      }
      if (selectedPath === "/formulario") {
        return [
          { key: "form_step_1", label: "Paso 1: Selector de Monto", clicks: 0 },
          { key: "form_continue", label: "Botón Continuar (Paso 1)", clicks: 0 },
          { key: "form_bank", label: "Paso 2: Selector de Banco", clicks: 0 },
          { key: "form_submit", label: "Paso 4: Envío de Solicitud", clicks: 0 },
        ];
      }
      return [{ key: "general_cta", label: "Interacciones de Página", clicks: 0 }];
    }

    return Object.entries(countsMap)
      .map(([key, data]) => ({ key, label: data.label, clicks: data.clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [pageClickEvents, selectedPath]);

  // Optimal auto-fit calculation to ensure zero horizontal/vertical clipping
  const availableInnerWidth = Math.max(320, containerWidth - 32);
  const autoFitDesktopScale = Math.min(1, Math.max(0.35, availableInnerWidth / 1200));
  const autoFitTabletScale = Math.min(1, Math.max(0.4, availableInnerWidth / 768));

  const appliedScale = useMemo(() => {
    if (deviceViewport === "desktop") {
      return isAutoFit ? autoFitDesktopScale : scaleFactor;
    }
    if (deviceViewport === "tablet") {
      return availableInnerWidth < 768 ? autoFitTabletScale : 1;
    }
    return 1;
  }, [deviceViewport, isAutoFit, autoFitDesktopScale, scaleFactor, availableInnerWidth, autoFitTabletScale]);

  // Target viewport dimensions
  const nativeViewportWidth = deviceViewport === "desktop" ? 1200 : deviceViewport === "tablet" ? 768 : 390;
  const nativeViewportHeight = deviceViewport === "desktop" ? 850 : deviceViewport === "tablet" ? 900 : 780;

  // Scaled container dimensions (exact bounding box to prevent clipping or dead space)
  const scaledBoxWidth = Math.round(nativeViewportWidth * appliedScale);
  const scaledBoxHeight = Math.round(nativeViewportHeight * appliedScale);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* =====================================================================
          CONTROLS TOOLBAR: Page Selector, Mode & Device Switcher
          ===================================================================== */}
      <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#F0EDF3] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] font-extrabold uppercase tracking-wider mb-1">
              <span>Réplica Exacta 1:1</span>
              <span>·</span>
              <span className="text-[#157A5A]">Renderizado de Alta Precisión</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
              Generador de Mapas de Calor por Página
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1.5 rounded-full text-[12px] font-mono font-bold bg-[#F1FAF6] text-[#157A5A] border border-[#C6E6D9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#157A5A] animate-ping" />
              <span>{totalRealClicks} clics capturados</span>
            </div>

            {/* Viewport Selector */}
            <div className="flex items-center bg-[#FAF8FB] p-1 rounded-xl border border-[#C9C1D4] gap-1">
              {[
                {
                  id: "desktop",
                  label: "Desktop (1200px)",
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  id: "tablet",
                  label: "Tablet (768px)",
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  id: "mobile",
                  label: "Móvil (390px)",
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDeviceViewport(d.id as DeviceViewport)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    deviceViewport === d.id
                      ? "bg-[#5B2C72] text-white shadow-2xs"
                      : "text-[#5B5266] hover:text-[#17131F]"
                  }`}
                >
                  {d.icon}
                  <span>{d.label}</span>
                </button>
              ))}
            </div>

            {/* Full Width Toggle */}
            <button
              onClick={() => setIsExpandedView((prev) => !prev)}
              className={`p-2 rounded-xl border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isExpandedView
                  ? "bg-[#2E1739] text-white border-[#2E1739]"
                  : "bg-[#FAF8FB] text-[#5B5266] border-[#C9C1D4] hover:text-[#17131F]"
              }`}
              title={isExpandedView ? "Restaurar vista dividida" : "Expandir emulación a ancho completo"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isExpandedView ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
              <span className="hidden sm:inline">{isExpandedView ? "Vista Dividida" : "Ancho Completo"}</span>
            </button>
          </div>
        </div>

        {/* Second Control Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Page Dropdown */}
          <div className="md:col-span-4 flex flex-col gap-1">
            <label className="text-[11.5px] font-mono uppercase text-[#8A8095] font-bold">
              Página a Inspeccionar:
            </label>
            <select
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-bold focus:outline-none focus:border-[#5B2C72]"
            >
              {PAGE_OPTIONS.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.name} ({p.path})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="md:col-span-4 flex flex-col gap-1">
            <label className="text-[11.5px] font-mono uppercase text-[#8A8095] font-bold">
              Capa de Calor Térmico:
            </label>
            <div className="flex items-center bg-[#FAF8FB] p-1 rounded-xl border border-[#C9C1D4] gap-1">
              {[
                {
                  id: "clicks",
                  label: "Clics",
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  ),
                },
                {
                  id: "scroll",
                  label: "Scroll",
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  ),
                },
                {
                  id: "hover",
                  label: "Cursor",
                  icon: (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  ),
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setHeatmapType(m.id as HeatmapType)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    heatmapType === m.id
                      ? "bg-[#2E1739] text-white shadow-2xs"
                      : "text-[#5B5266] hover:text-[#17131F]"
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zoom / Scale Controls for Desktop */}
          {deviceViewport === "desktop" && (
            <div className="md:col-span-4 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11.5px] font-mono">
                <span className="text-[#8A8095] font-bold uppercase">Escala Desktop:</span>
                <span className="text-[#5B2C72] font-extrabold">
                  {Math.round(appliedScale * 100)}% {isAutoFit && "(Auto)"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsAutoFit(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    isAutoFit
                      ? "bg-[#157A5A] text-white shadow-2xs"
                      : "bg-[#FAF8FB] border border-[#C9C1D4] text-[#5B5266] hover:text-[#17131F]"
                  }`}
                >
                  Ajuste 100%
                </button>
                {[0.5, 0.65, 0.8, 1.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setIsAutoFit(false);
                      setScaleFactor(val);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      !isAutoFit && scaleFactor === val
                        ? "bg-[#5B2C72] text-white shadow-2xs"
                        : "bg-[#FAF8FB] border border-[#C9C1D4] text-[#5B5266] hover:text-[#17131F]"
                    }`}
                  >
                    {Math.round(val * 100)}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {deviceViewport !== "desktop" && (
            <div className="md:col-span-4 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11.5px] font-mono">
                <span className="text-[#8A8095] font-bold uppercase">Opacidad de Capa:</span>
                <span className="text-[#5B2C72] font-extrabold">{overlayOpacity}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#E7E3EC] rounded-lg appearance-none cursor-pointer accent-[#5B2C72]"
              />
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          MAIN HEATMAP LIVE REPLICA FRAME (8/12 cols preview, 4/12 cols ranking)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Live Page Simulation */}
        <div
          ref={previewContainerRef}
          className={`${
            isExpandedView ? "lg:col-span-12" : "lg:col-span-8"
          } bg-[#1E0F26] p-4 sm:p-5 rounded-[28px] border border-[#3A1F48] shadow-xl flex flex-col items-center justify-start relative overflow-hidden transition-all duration-300`}
        >
          {/* Live Header Info Bar */}
          <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-3.5 px-1">
            <div className="bg-black/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-white/20 text-[11.5px] font-mono flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#157A5A] animate-ping" />
              <span className="text-[#C7B8D2]">Réplica Activa:</span>
              <span className="text-white font-bold">{selectedPath}</span>
            </div>

            <div className="flex items-center gap-3 text-[11.5px] font-mono text-[#C7B8D2]">
              <span>
                {deviceViewport === "desktop"
                  ? `Resolución 1200px · Renderizado a ${Math.round(appliedScale * 100)}%`
                  : deviceViewport === "tablet"
                  ? `Resolución 768px · Renderizado a ${Math.round(appliedScale * 100)}%`
                  : "Resolución 390px · Móvil Nativo 1:1"}
              </span>
            </div>
          </div>

          {/* Device Frame Viewport Container (Zero-Clipping Scaled Box) */}
          <div className="w-full flex items-center justify-center overflow-x-auto py-2">
            <div
              className={`transition-all duration-300 bg-white shadow-2xl relative overflow-hidden block ${
                deviceViewport === "mobile"
                  ? "rounded-[36px] border-[8px] border-[#2E1739] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  : "rounded-2xl border-4 border-[#3A1F48]"
              }`}
              style={{
                width: `${scaledBoxWidth}px`,
                height: `${scaledBoxHeight}px`,
                maxWidth: "100%",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* Phone Speaker Notch simulation for mobile viewport */}
              {deviceViewport === "mobile" && (
                <div className="w-28 h-4 bg-[#2E1739] rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none">
                  <span className="w-8 h-1 bg-[#4A3258] rounded-full" />
                </div>
              )}

              {/* Native 1:1 Page Replica with Integrated Heatmap Layer */}
              <iframe
                ref={iframeRef}
                key={`${selectedPath}-${deviceViewport}`}
                src={previewIframeUrl}
                title={`Réplica exacta en vivo de ${selectedPath}`}
                className="border-0 bg-white"
                style={{
                  width: `${nativeViewportWidth}px`,
                  height: `${nativeViewportHeight}px`,
                  transform: `scale(${appliedScale})`,
                  transformOrigin: "top left",
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Hotspots & Element Ranking Sidebar */}
        <div
          className={`${
            isExpandedView ? "lg:col-span-12" : "lg:col-span-4"
          } bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-4`}
        >
          <div className="border-b border-[#F0EDF3] pb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">
                Interacciones de Página
              </h3>
              <span className="text-[11.5px] font-mono font-bold text-[#5B2C72] bg-[#F5EDF9] px-2.5 py-0.5 rounded-full border border-[#DDCBE6]">
                {totalRealClicks} clics reales
              </span>
            </div>
            <p className="text-[12px] text-[#5B5266] m-0 mt-1">
              Todos los elementos y botones con telemetría registrada en {selectedPath}.
            </p>
          </div>

          {/* Ranked Interactive Hotspot List */}
          <div
            className={`flex flex-col gap-2.5 ${
              isExpandedView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "max-h-[460px] overflow-y-auto pr-1"
            }`}
          >
            {topInteractiveElements.map((el, rank) => {
              const pct = totalRealClicks > 0 ? Math.round((el.clicks / totalRealClicks) * 100) : 0;

              return (
                <div
                  key={el.key}
                  className="p-3 rounded-xl border border-[#E7E3EC] bg-[#FAF8FB] hover:border-[#AB6CCA] transition-all flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white border border-[#C9C1D4] text-[#5B2C72] font-mono text-[10.5px] font-extrabold flex items-center justify-center shrink-0">
                        #{rank + 1}
                      </span>
                      <strong className="text-[#17131F] leading-snug">{el.label}</strong>
                    </div>
                    <span className="font-mono font-extrabold text-[#5B2C72] text-[13px] shrink-0">
                      {el.clicks} clics
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#EAE5EF] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            el.clicks >= 10 ? "#EF4444" : el.clicks >= 3 ? "#F97316" : "#5ECBDB",
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-[#8A8095] shrink-0">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC] text-[12px] text-[#5B5266] flex items-start gap-2">
            <svg className="w-4 h-4 text-[#5B2C72] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <strong className="text-[#17131F]">Réplica Nativa en Vivo:</strong>
              <span>La vista previa es una réplica exacta de la página en ejecución con ajuste automático responsivo sin recortes en escritorio (1200px), tablet y móvil.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
