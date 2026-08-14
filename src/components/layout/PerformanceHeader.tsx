"use client";

import React from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function PerformanceHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[--brand-surface] border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-[--container-max] h-[--header-height] flex items-center justify-center md:justify-start">
        <BrandLogo />
        {/* Minimal trust indicators could go here on desktop */}
      </div>
    </header>
  );
}
