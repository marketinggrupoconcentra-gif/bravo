"use client";

import React from "react";

interface Step {
  id: string | number;
  label: string;
  sublabel?: string;
  status: "completed" | "active" | "future";
}

interface BravoProgressPathProps {
  steps?: Step[];
  orientation?: "horizontal" | "vertical" | "auto";
  className?: string;
  currentStep?: number;
}

const defaultSteps: Step[] = [
  { id: 1, label: "Entendimiento", sublabel: "Diagnóstico inicial", status: "completed" },
  { id: 2, label: "Organización", sublabel: "Plan a tu medida", status: "completed" },
  { id: 3, label: "Progreso", sublabel: "Negociación activa", status: "active" },
  { id: 4, label: "Resolución", sublabel: "Liquidación y tranquilidad", status: "future" },
];

export function BravoProgressPath({
  steps = defaultSteps,
  orientation = "auto",
  className = "",
  currentStep,
}: BravoProgressPathProps) {
  // Compute step statuses if currentStep is provided
  const computedSteps = steps.map((step, idx) => {
    if (typeof currentStep === "number") {
      if (idx < currentStep) return { ...step, status: "completed" as const };
      if (idx === currentStep) return { ...step, status: "active" as const };
      return { ...step, status: "future" as const };
    }
    return step;
  });

  const getStepColor = (status: "completed" | "active" | "future", idx: number) => {
    if (status === "future") return "#C7B8D2";
    // Color journey: dark violet -> violet -> cyan -> success green
    const colors = ["#2E1739", "#5B2C72", "#5ECBDB", "#157A5A"];
    return colors[idx] || "#5ECBDB";
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop / Horizontal View */}
      <div
        className={`${
          orientation === "vertical"
            ? "hidden"
            : orientation === "horizontal"
            ? "flex"
            : "hidden md:flex"
        } items-center justify-between relative w-full`}
      >
        {/* Track Line Background */}
        <div className="absolute top-[16px] left-[20px] right-[20px] h-[3px] bg-[#E7E3EC] -z-0" />

        {computedSteps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const color = getStepColor(step.status, idx);

          return (
            <div
              key={step.id}
              className="flex flex-col items-center text-center relative z-10 flex-1 px-2 group"
            >
              {/* Milestone Node */}
              <div
                className={`w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[13px] transition-all duration-300 ${
                  isCompleted
                    ? "bg-[--color-violet-700] text-white shadow-sm"
                    : isActive
                    ? "bg-[--color-cyan-300] text-[--color-neutral-ink] ring-4 ring-[#E9F8FA] shadow-md scale-105"
                    : "bg-white border-2 border-[#DDCBE6] text-[#8A8095]"
                }`}
                style={{
                  backgroundColor: isCompleted ? color : isActive ? "#5ECBDB" : undefined,
                }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>

              {/* Labels */}
              <div className="mt-2.5 flex flex-col">
                <span
                  className={`text-[14px] leading-tight ${
                    isActive
                      ? "font-extrabold text-[--color-neutral-ink]"
                      : isCompleted
                      ? "font-bold text-[--color-neutral-text]"
                      : "font-medium text-[--color-neutral-text-faint]"
                  }`}
                >
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className="text-[12px] text-[--color-neutral-text-muted] mt-0.5">
                    {step.sublabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / Vertical View */}
      <div
        className={`${
          orientation === "horizontal"
            ? "hidden"
            : orientation === "vertical"
            ? "flex"
            : "flex md:hidden"
        } flex-col gap-0 relative`}
      >
        {computedSteps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isLast = idx === computedSteps.length - 1;
          const color = getStepColor(step.status, idx);

          return (
            <div key={step.id} className="flex items-start gap-3.5 relative">
              {/* Indicator Node + Vertical Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 transition-all ${
                    isCompleted
                      ? "bg-[--color-violet-700] text-white"
                      : isActive
                      ? "bg-[--color-cyan-300] text-[--color-neutral-ink] ring-3 ring-[#E9F8FA]"
                      : "bg-white border-2 border-[#DDCBE6] text-[#8A8095]"
                  }`}
                  style={{
                    backgroundColor: isCompleted ? color : isActive ? "#5ECBDB" : undefined,
                  }}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                {!isLast && (
                  <div
                    className="w-[2px] h-[36px] my-1"
                    style={{
                      backgroundColor: isCompleted ? "#AB6CCA" : "#E7E3EC",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pt-1 pb-4">
                <div
                  className={`text-[15px] leading-snug ${
                    isActive
                      ? "font-bold text-[--color-neutral-ink]"
                      : isCompleted
                      ? "font-semibold text-[--color-neutral-text]"
                      : "font-medium text-[--color-neutral-text-muted]"
                  }`}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className="text-[13px] text-[--color-neutral-text-muted] mt-0.5">
                    {step.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
