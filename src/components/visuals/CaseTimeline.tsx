"use client";

import React from "react";

interface CaseTimelineProps {
  className?: string;
}

const stages = [
  {
    name: "Diagnóstico",
    timeframe: "Mes 1",
    desc: "Análisis y presupuesto",
    color: "#2E1739",
    textColor: "#FFFFFF",
    flex: 2,
  },
  {
    name: "Ahorro",
    timeframe: "Meses 2–14",
    desc: "Fondo mensual protegido",
    color: "#5B2C72",
    textColor: "#FFFFFF",
    flex: 3,
  },
  {
    name: "Negociación",
    timeframe: "Meses 15–20",
    desc: "Acuerdo con acreedores",
    color: "#5ECBDB",
    textColor: "#17131F",
    flex: 4,
  },
  {
    name: "Liquidación",
    timeframe: "Meses 21–22",
    desc: "Carta finiquito obtenida",
    color: "#157A5A",
    textColor: "#FFFFFF",
    flex: 2,
  },
];

export function CaseTimeline({ className = "" }: CaseTimelineProps) {
  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-[--color-neutral-ink]">
          Línea de tiempo del programa
        </span>
        <span className="text-[13px] text-[--color-neutral-text-muted] font-medium">
          22 meses totales
        </span>
      </div>

      {/* Desktop Horizontal Bar with Connected Segments & Labels */}
      <div className="hidden md:flex flex-col gap-2">
        <div className="flex h-[12px] rounded-full overflow-hidden w-full bg-[#E7E3EC] p-[1px]">
          {stages.map((stage, idx) => (
            <div
              key={stage.name}
              style={{
                backgroundColor: stage.color,
                flex: stage.flex,
                marginRight: idx < stages.length - 1 ? "2px" : "0",
              }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all"
              title={`${stage.name} (${stage.timeframe})`}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {stages.map((stage) => (
            <div key={stage.name} className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-[14px] font-bold text-[--color-neutral-ink]">
                  {stage.name}
                </span>
              </div>
              <span className="text-[12px] font-medium text-[--color-violet-700] ml-4">
                {stage.timeframe}
              </span>
              <span className="text-[12px] text-[--color-neutral-text-muted] ml-4 leading-tight mt-0.5">
                {stage.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Vertical Connected Timeline */}
      <div className="flex md:hidden flex-col gap-0 pt-1">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          return (
            <div key={stage.name} className="flex items-start gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: stage.color }}
                >
                  {idx + 1}
                </div>
                {!isLast && (
                  <div
                    className="w-[2px] h-[34px] my-1"
                    style={{ backgroundColor: stage.color, opacity: 0.4 }}
                  />
                )}
              </div>

              <div className="pt-0.5 pb-2.5 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-bold text-[--color-neutral-ink]">
                    {stage.name}
                  </span>
                  <span className="text-[12px] font-semibold text-[--color-violet-700]">
                    {stage.timeframe}
                  </span>
                </div>
                <span className="text-[13px] text-[--color-neutral-text-muted] leading-tight">
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
