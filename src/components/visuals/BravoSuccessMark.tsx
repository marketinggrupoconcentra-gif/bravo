"use client";

import React from "react";

interface BravoSuccessMarkProps {
  size?: number;
  className?: string;
}

export function BravoSuccessMark({ size = 80, className = "" }: BravoSuccessMarkProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="successPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5B2C72" />
            <stop offset="50%" stop-color="#5ECBDB" />
            <stop offset="100%" stop-color="#157A5A" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#157A5A" flood-opacity="0.2" />
          </filter>
        </defs>

        {/* Outer subtle ring track */}
        <circle cx="40" cy="40" r="36" stroke="#E9F8FA" strokeWidth="4" />

        {/* Progress path finishing circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="url(#successPathGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="226"
          strokeDashoffset="0"
          transform="rotate(-90 40 40)"
        />

        {/* Inner emerald circle */}
        <circle cx="40" cy="40" r="28" fill="#157A5A" filter="url(#glow)" />

        {/* Checkmark */}
        <path
          d="M28 40.5L36 48.5L52 32.5"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
