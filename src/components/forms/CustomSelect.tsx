"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectGroup {
  group: string;
  options: SelectOption[];
}

interface CustomSelectProps {
  groups: SelectGroup[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CustomSelect({
  groups,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  required,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find label for current value
  const selectedLabel = React.useMemo(() => {
    for (const group of groups) {
      const opt = group.options.find((o) => o.value === value);
      if (opt) return opt.label;
    }
    return null;
  }, [groups, value]);

  // Close on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, handleOutsideClick]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden native select for form validation */}
      <select
        required={required}
        value={value}
        onChange={() => {}}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
      >
        <option value="" />
        {groups.flatMap((g) =>
          g.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        )}
      </select>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full min-h-[50px] px-4 pr-10 text-left rounded-[10px] text-[15px] font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2C72] ${
          value
            ? "border-[#5B2C72] text-[#17131F] bg-[#FDFBFE] shadow-[0_0_0_3px_rgba(91,44,114,0.08)]"
            : "border-[#C9C1D4] text-[#8A7E97] bg-white"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel ?? placeholder}
        {/* Chevron */}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5">
          <svg
            className={`w-4 h-4 text-[#5B2C72] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#DDD5E8] rounded-[14px] shadow-[0_8px_32px_rgba(91,44,114,0.18)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {groups.map((group) => (
            <div key={group.group}>
              {/* Group header */}
              <div className="px-4 pt-3 pb-1.5 text-[11.5px] font-extrabold tracking-widest uppercase text-[#5B2C72] bg-[#F9F5FC] border-b border-[#EDE5F5] sticky top-0">
                {group.group}
              </div>
              {/* Options */}
              {group.options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-5 py-2.5 text-[14.5px] transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#F2EBF8] text-[#5B2C72] font-bold"
                        : "text-[#17131F] hover:bg-[#F9F5FC] hover:text-[#5B2C72]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 shrink-0 text-[#5B2C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
