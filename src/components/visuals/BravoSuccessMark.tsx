"use client";

import React from "react";

interface BravoSuccessMarkProps {
  size?: number;
  className?: string;
}

// Circumference for r=36: 2π×36 ≈ 226.2
const C = 226.2;

export function BravoSuccessMark({ size = 80, className = "" }: BravoSuccessMarkProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{`
        /* ── Outer ring: rotates the SVG circle so the gradient sweeps around ── */
        @keyframes bravo-ring-rotate {
          from { transform: rotate(-90deg); }
          to   { transform: rotate(270deg); }
        }
        /* Outer ring: dashoffset fills then empties — loading feel */
        @keyframes bravo-ring-fill {
          0%   { stroke-dashoffset: ${C}; }
          55%  { stroke-dashoffset: 4; }
          75%  { stroke-dashoffset: 4; }
          100% { stroke-dashoffset: ${C}; }
        }

        .bravo-ring-track {
          transform-origin: 40px 40px;
          animation:
            bravo-ring-rotate 2.6s linear infinite,
            bravo-ring-fill   2.6s ease-in-out infinite;
        }

        /* ── Coin flip: the entire inner div flips on Y axis ── */
        @keyframes bravo-coin-flip {
          0%   { transform: perspective(200px) rotateY(0deg)   scale(1);    }
          35%  { transform: perspective(200px) rotateY(180deg) scale(0.88); }
          50%  { transform: perspective(200px) rotateY(180deg) scale(0.88); }
          85%  { transform: perspective(200px) rotateY(360deg) scale(1);    }
          100% { transform: perspective(200px) rotateY(360deg) scale(1);    }
        }

        .bravo-coin {
          animation: bravo-coin-flip 2.6s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        /* ── Checkmark draw-in on first appear ── */
        @keyframes bravo-check-draw {
          from { stroke-dashoffset: 32; opacity: 0.3; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        .bravo-check {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          animation: bravo-check-draw 0.45s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
        }
      `}</style>

      {/* ── Outer ring SVG ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="absolute inset-0"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="bsm-ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#5B2C72" />
            <stop offset="45%"  stopColor="#5ECBDB" />
            <stop offset="100%" stopColor="#157A5A" />
          </linearGradient>
        </defs>

        {/* Static track */}
        <circle cx="40" cy="40" r="36" stroke="#DCF5F8" strokeWidth="4" />

        {/* Animated progress ring */}
        <circle
          className="bravo-ring-track"
          cx="40"
          cy="40"
          r="36"
          stroke="url(#bsm-ringGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>

      {/* ── Coin (inner circle + checkmark) — CSS 3D flip ── */}
      <div
        className="bravo-coin absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "center center" }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id="bsm-coinFace" cx="38%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#22A87A" />
              <stop offset="100%" stopColor="#0F6248" />
            </radialGradient>
            <filter id="bsm-coinGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#157A5A" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Inner circle */}
          <circle cx="28" cy="28" r="26" fill="url(#bsm-coinFace)" filter="url(#bsm-coinGlow)" />

          {/* Highlight sheen — top-left arc gives 3D coin feel */}
          <ellipse
            cx="22" cy="19"
            rx="9" ry="5"
            fill="white" fillOpacity="0.16"
            transform="rotate(-20 22 19)"
          />

          {/* Checkmark */}
          <path
            className="bravo-check"
            d="M17 28.5L24.5 36L39 21"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
