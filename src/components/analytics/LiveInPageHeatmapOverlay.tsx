"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { getLocalUserActions, UserActionLog, logUserAction } from "@/lib/telemetry/logger";

function InPageHeatmapContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isEnabled, setIsEnabled] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState<"clicks" | "scroll" | "hover">("clicks");
  const [opacity, setOpacity] = useState<number>(90);
  const [actions, setActions] = useState<UserActionLog[]>([]);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [decorations, setDecorations] = useState<
    Array<{
      id: string;
      label: string;
      top: number;
      left: number;
      width: number;
      height: number;
      clicks: number;
    }>
  >([]);

  // Check URL params or parent message
  useEffect(() => {
    const isUrlHeatmap = searchParams?.get("heatmap") === "true";
    const modeParam = (searchParams?.get("mode") as any) || "clicks";
    const opacityParam = parseInt(searchParams?.get("opacity") || "90", 10);

    if (isUrlHeatmap) {
      setIsEnabled(true);
      setHeatmapMode(modeParam);
      setOpacity(opacityParam);
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "BRAVO_HEATMAP_CONFIG") {
        setIsEnabled(Boolean(e.data.enabled));
        if (e.data.mode) setHeatmapMode(e.data.mode);
        if (e.data.opacity !== undefined) setOpacity(e.data.opacity);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams]);

  // Load telemetry actions
  useEffect(() => {
    if (!isEnabled) return;
    const initialActions = getLocalUserActions();
    setActions(initialActions);

    const handleActionLogged = (e: Event) => {
      const custom = e as CustomEvent<UserActionLog>;
      if (custom.detail) {
        setActions((prev) => [custom.detail, ...prev]);
      }
    };

    window.addEventListener("BRAVO_ACTION_LOGGED", handleActionLogged);
    return () => window.removeEventListener("BRAVO_ACTION_LOGGED", handleActionLogged);
  }, [isEnabled]);

  // Track hover movement across the page
  useEffect(() => {
    if (!isEnabled || heatmapMode !== "hover") return;

    const handleMouseMove = (e: MouseEvent) => {
      setHoverPos({ x: e.clientX, y: e.clientY + window.scrollY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isEnabled, heatmapMode]);

  // Scan live DOM elements and measure their exact physical positions
  useEffect(() => {
    if (!isEnabled) return;

    const measureElements = () => {
      const targetSelectors = [
        { selector: "#hero-primary-cta, a[href='#precalificar'], a[href='/formulario']", name: "Revisar mi caso (Hero)" },
        { selector: "#hero-secondary-cta, a[href='/como-funciona']", name: "Conocer cómo funciona" },
        { selector: "input[type='range']", name: "Calculadora de Liquidación" },
        { selector: "a[href*='asesor'], a[href='/contacto']", name: "Hablar con asesor" },
        { selector: "details, .faq-item", name: "Preguntas Frecuentes" },
        { selector: "section:last-of-type a", name: "CTA Cierre Final" },
        { selector: "form button[type='submit'], form button", name: "Botón Formulario" },
      ];

      const found: typeof decorations = [];

      targetSelectors.forEach(({ selector, name }, idx) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, elIdx) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const elId = el.getAttribute("id") || el.getAttribute("data-cta-id") || `${name}-${idx}-${elIdx}`;

            // Count real clicks from telemetry
            const clickCount = actions.filter((a) => {
              const d = (a.details || {}) as Record<string, any>;
              return (
                d.cta_id === elId ||
                d.id === elId ||
                d.placement === elId ||
                (idx === 0 && a.event === "cta_click") ||
                (idx === 2 && a.event === "calculator_interaction")
              );
            }).length;

            found.push({
              id: `${elId}-${idx}`,
              label: (el.textContent || name).trim().substring(0, 24),
              top: rect.top + window.scrollY,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              clicks: clickCount,
            });
          }
        });
      });

      setDecorations(found);
    };

    const timer = setTimeout(measureElements, 250);
    window.addEventListener("resize", measureElements);
    window.addEventListener("scroll", measureElements, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureElements);
      window.removeEventListener("scroll", measureElements);
    };
  }, [isEnabled, pathname, actions]);

  if (!isEnabled) return null;

  const totalClicks = decorations.reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[9999] overflow-hidden select-none"
      style={{ opacity: opacity / 100 }}
    >
      {/* 1. CLICKS HEATMAP LAYER (Clean Outline & Floating Badges) */}
      {heatmapMode === "clicks" && (
        <>
          {decorations.map((d) => {
            const pct = totalClicks > 0 ? Math.round((d.clicks / totalClicks) * 100) : 0;
            const isHighHeat = d.clicks >= 10;
            const isMediumHeat = d.clicks >= 3;

            return (
              <div
                key={d.id}
                className="absolute pointer-events-auto cursor-pointer transition-all"
                style={{
                  top: `${d.top}px`,
                  left: `${d.left}px`,
                  width: `${d.width}px`,
                  height: `${d.height}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  logUserAction("cta_click", {
                    cta_id: d.id,
                    source: "heatmap_inpage_interactive",
                  });
                }}
              >
                {/* Glowing Highlight Box around the Real Button */}
                <div
                  className="w-full h-full rounded-full transition-all duration-300"
                  style={{
                    boxShadow: isHighHeat
                      ? "0 0 0 2px #EF4444, 0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(239, 68, 68, 0.2)"
                      : isMediumHeat
                      ? "0 0 0 2px #F97316, 0 0 16px rgba(249, 115, 22, 0.5), inset 0 0 10px rgba(249, 115, 22, 0.15)"
                      : "0 0 0 2px #5ECBDB, 0 0 14px rgba(94, 203, 219, 0.4), inset 0 0 8px rgba(94, 203, 219, 0.1)",
                    backgroundColor: isHighHeat
                      ? "rgba(239, 68, 68, 0.08)"
                      : isMediumHeat
                      ? "rgba(249, 115, 22, 0.06)"
                      : "rgba(94, 203, 219, 0.05)",
                  }}
                />

                {/* Floating Metric Badge Anchored at Top-Right of Button */}
                <div className="absolute -top-3.5 -right-2.5 flex items-center justify-center">
                  <div
                    className="text-white font-mono text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border shadow-xl flex items-center gap-1 whitespace-nowrap"
                    style={{
                      backgroundColor: isHighHeat ? "#EF4444" : isMediumHeat ? "#F97316" : "#2E1739",
                      borderColor: isHighHeat ? "#FCA5A5" : isMediumHeat ? "#FDBA74" : "#5ECBDB",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{d.clicks} clics</span>
                    {pct > 0 && <span className="opacity-80">({pct}%)</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* 2. SCROLL DEPTH MAP */}
      {heatmapMode === "scroll" && (
        <div className="fixed right-4 top-20 z-[9999] bg-black/90 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 shadow-2xl flex flex-col gap-2.5 w-[240px]">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <span className="text-[12px] font-mono font-extrabold text-[#5ECBDB]">Termómetro de Scroll</span>
            <span className="text-[10px] font-mono text-white/60">En Vivo</span>
          </div>
          <div className="flex flex-col gap-2 text-[11px] font-mono">
            <div className="flex justify-between items-center bg-red-500/30 p-2 rounded-xl border border-red-500/40">
              <span>0% - 25% Hero</span>
              <span className="font-extrabold text-red-300">100% Retención</span>
            </div>
            <div className="flex justify-between items-center bg-orange-500/30 p-2 rounded-xl border border-orange-500/40">
              <span>25% - 50% Calculadora</span>
              <span className="font-extrabold text-orange-300">78% Retención</span>
            </div>
            <div className="flex justify-between items-center bg-yellow-500/30 p-2 rounded-xl border border-yellow-500/40">
              <span>50% - 75% Asesoría</span>
              <span className="font-extrabold text-yellow-300">58% Retención</span>
            </div>
            <div className="flex justify-between items-center bg-blue-500/30 p-2 rounded-xl border border-blue-500/40">
              <span>75% - 100% Cierre</span>
              <span className="font-extrabold text-blue-300">42% Retención</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. HOVER CURSOR GLOW */}
      {heatmapMode === "hover" && hoverPos && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{
            top: `${hoverPos.y}px`,
            left: `${hoverPos.x}px`,
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.7) 0%, rgba(239, 68, 68, 0.3) 50%, transparent 100%)",
            filter: "blur(10px)",
          }}
        />
      )}
    </div>
  );
}

export function LiveInPageHeatmapOverlay() {
  return (
    <Suspense fallback={null}>
      <InPageHeatmapContent />
    </Suspense>
  );
}
