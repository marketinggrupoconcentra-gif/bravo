"use client";

import React, { useState, useMemo } from "react";
import { CheckIcon } from "@/components/icons/bravo";

interface ColorPalettePickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  onFocusElement?: () => void;
  presetColors?: { name: string; hex: string; desc?: string }[];
}

export const BRAVO_SWATCHES = [
  { name: "Púrpura Bravo", hex: "#5B2C72", desc: "Color primario de marca" },
  { name: "Cian Eléctrico", hex: "#5ECBDB", desc: "Acento de alta luminosidad" },
  { name: "Púrpura Nocturno", hex: "#2E1739", desc: "Fondo oscuro de contraste" },
  { name: "Verde Esmeralda", hex: "#157A5A", desc: "Aprobación y finanzas sanas" },
  { name: "Lila Vibrante", hex: "#AB6CCA", desc: "Gradientes y energía" },
  { name: "Blanco Cálido", hex: "#FAF8FB", desc: "Superficie editorial limpia" },
  { name: "Blanco Puro", hex: "#FFFFFF", desc: "Máxima claridad y contraste" },
  { name: "Gris Grafito", hex: "#17131F", desc: "Tipografía principal" },
  { name: "Ámbar Alerta", hex: "#B54708", desc: "Avisos pedagógicos" },
  { name: "Rubí / Coral", hex: "#B02A24", desc: "Destacados y advertencias" },
];

/**
 * Utility functions to convert HEX to RGB and HSL
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function ColorPalettePicker({
  label,
  value = "#5B2C72",
  onChange,
  onFocusElement,
  presetColors = BRAVO_SWATCHES,
}: ColorPalettePickerProps) {
  const [showRgbTable, setShowRgbTable] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(value) || { r: 91, g: 44, b: 114 }, [value]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const copyToClipboard = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleRgbSliderChange = (channel: "r" | "g" | "b", val: number) => {
    const updated = { ...rgb, [channel]: val };
    const newHex = rgbToHex(updated.r, updated.g, updated.b);
    onChange(newHex);
  };

  return (
    <div className="flex flex-col gap-2.5 p-3.5 bg-[#FAF8FB] rounded-[18px] border border-[#E7E3EC] transition-all">
      {/* Label and Active Swatch */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-[12px] font-bold text-[#17131F] flex items-center gap-1.5">
          <span>{label}</span>
        </label>

        {/* Toggle RGB Table Button */}
        <button
          type="button"
          onClick={() => setShowRgbTable(!showRgbTable)}
          className="text-[11px] font-mono font-bold text-[#5B2C72] hover:text-[#2E1739] cursor-pointer underline flex items-center gap-1"
        >
          <span>{showRgbTable ? "Ocultar tabla RGB" : "Ver tabla RGB / HEX"}</span>
        </button>
      </div>

      {/* Main Color Picker Row: Native Wheel + HEX Input + Swatch preview */}
      <div className="flex items-center gap-2.5">
        {/* Color Input Wheel Box */}
        <div className="relative w-[38px] h-[38px] rounded-xl overflow-hidden border border-[#C9C1D4] shadow-2xs shrink-0 cursor-pointer">
          <input
            type="color"
            value={value.startsWith("#") ? value : "#5B2C72"}
            onFocus={onFocusElement}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute -top-3 -left-3 w-[60px] h-[60px] cursor-pointer border-0 p-0"
          />
        </div>

        {/* HEX Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onFocus={onFocusElement}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="#5B2C72"
            maxLength={7}
            className="w-full p-2 bg-white border border-[#C9C1D4] rounded-lg text-[13px] font-mono font-extrabold text-[#17131F] focus:border-[#5ECBDB] focus:outline-none uppercase"
          />
        </div>

        {/* Quick Swatch Preview Box */}
        <div
          className="w-[38px] h-[38px] rounded-xl border border-black/10 shadow-inner shrink-0"
          style={{ backgroundColor: value }}
          title={`Color activo: ${value}`}
        />
      </div>

      {/* Pre-curated Theme Palette Swatches (1-Click Application) */}
      <div className="flex flex-col gap-1 pt-1">
        <span className="text-[10.5px] font-mono text-[#8A8095] uppercase">
          Paleta predefinida:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presetColors.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => {
                onChange(swatch.hex);
                if (onFocusElement) onFocusElement();
              }}
              className={`group relative w-6 h-6 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                value.toUpperCase() === swatch.hex.toUpperCase()
                  ? "ring-2 ring-[#5ECBDB] scale-110 border-white shadow-xs"
                  : "border-black/15 hover:scale-105"
              }`}
              style={{ backgroundColor: swatch.hex }}
              title={`${swatch.name} (${swatch.hex})`}
            >
              {value.toUpperCase() === swatch.hex.toUpperCase() && (
                <CheckIcon size={12} className={swatch.hex === "#FFFFFF" || swatch.hex === "#FAF8FB" ? "text-black" : "text-white"} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          DETAILED RGB & HSL EQUIVALENCY TABLE & SLIDERS
          ===================================================================== */}
      {showRgbTable && (
        <div className="mt-2 p-3 bg-white rounded-xl border border-[#DDCBE6] shadow-sm flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-1.5">
            <span className="text-[11px] font-mono font-extrabold uppercase text-[#5B2C72]">
              Tabla de Conversión de Color
            </span>
            {copiedFormat && (
              <span className="text-[10.5px] font-mono text-[#157A5A] font-bold animate-pulse">
                ¡Copiado {copiedFormat}!
              </span>
            )}
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* HEX */}
            <div
              onClick={() => copyToClipboard(value, "HEX")}
              className="p-2 bg-[#FAF8FB] hover:bg-[#F5EDF9] border border-[#E7E3EC] rounded-lg cursor-pointer transition-colors flex flex-col items-center"
              title="Clic para copiar HEX"
            >
              <span className="text-[10px] font-mono text-[#8A8095] uppercase">HEX</span>
              <span className="text-[12px] font-mono font-extrabold text-[#17131F] truncate max-w-full">
                {value}
              </span>
            </div>

            {/* RGB */}
            <div
              onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
              className="p-2 bg-[#FAF8FB] hover:bg-[#F5EDF9] border border-[#E7E3EC] rounded-lg cursor-pointer transition-colors flex flex-col items-center"
              title="Clic para copiar RGB"
            >
              <span className="text-[10px] font-mono text-[#8A8095] uppercase">RGB</span>
              <span className="text-[11px] font-mono font-extrabold text-[#17131F] truncate max-w-full">
                {rgb.r}, {rgb.g}, {rgb.b}
              </span>
            </div>

            {/* HSL */}
            <div
              onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
              className="p-2 bg-[#FAF8FB] hover:bg-[#F5EDF9] border border-[#E7E3EC] rounded-lg cursor-pointer transition-colors flex flex-col items-center"
              title="Clic para copiar HSL"
            >
              <span className="text-[10px] font-mono text-[#8A8095] uppercase">HSL</span>
              <span className="text-[11px] font-mono font-extrabold text-[#17131F] truncate max-w-full">
                {hsl.h}°, {hsl.s}%, {hsl.l}%
              </span>
            </div>
          </div>

          {/* Precision RGB Sliders */}
          <div className="flex flex-col gap-2 pt-1 border-t border-[#F0EDF3]">
            <span className="text-[10.5px] font-mono text-[#8A8095] uppercase">
              Ajuste fino de canales RGB:
            </span>

            {/* R channel */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#B02A24] font-bold w-4">R:</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => handleRgbSliderChange("r", parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[#E7E3EC] rounded appearance-none accent-[#B02A24] cursor-pointer"
              />
              <span className="text-[11px] font-mono w-7 text-right">{rgb.r}</span>
            </div>

            {/* G channel */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#157A5A] font-bold w-4">G:</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => handleRgbSliderChange("g", parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[#E7E3EC] rounded appearance-none accent-[#157A5A] cursor-pointer"
              />
              <span className="text-[11px] font-mono w-7 text-right">{rgb.g}</span>
            </div>

            {/* B channel */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#026AA2] font-bold w-4">B:</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => handleRgbSliderChange("b", parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[#E7E3EC] rounded appearance-none accent-[#026AA2] cursor-pointer"
              />
              <span className="text-[11px] font-mono w-7 text-right">{rgb.b}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
