"use client";

import React, { useEffect, useRef } from "react";

interface BravoSuccessMarkProps {
  size?: number;
  className?: string;
}

const C = 226.2;

// 8 sparkles: angle (deg from top), distance, size, color, animation delay/duration
const SPARKLES = [
  { angle: 15,  dist: 0.72, sz: 7,   color: "#5ECBDB", delay: "0s",    dur: "1.9s" },
  { angle: 72,  dist: 0.76, sz: 5,   color: "#AB6CCA", delay: "0.4s",  dur: "2.1s" },
  { angle: 130, dist: 0.70, sz: 8,   color: "#5ECBDB", delay: "0.7s",  dur: "1.7s" },
  { angle: 190, dist: 0.74, sz: 6,   color: "#22C55E", delay: "0.2s",  dur: "2.3s" },
  { angle: 245, dist: 0.72, sz: 5,   color: "#F0C040", delay: "0.9s",  dur: "2.0s" },
  { angle: 300, dist: 0.76, sz: 7,   color: "#AB6CCA", delay: "0.5s",  dur: "1.8s" },
  { angle: 345, dist: 0.68, sz: 4.5, color: "#5ECBDB", delay: "1.1s",  dur: "1.6s" },
  { angle: 100, dist: 0.78, sz: 6,   color: "#22C55E", delay: "0.3s",  dur: "2.2s" },
];

// 4-point star SVG string centered at 0,0
function star4(s: number): string {
  const o = s;
  const i = s * 0.38;
  return `M0,${-o} C${i},${-i} ${i},${-i} ${o},0 C${i},${i} ${i},${i} 0,${o} C${-i},${i} ${-i},${i} ${-o},0 C${-i},${-i} ${-i},${-i} 0,${-o}Z`;
}

export function BravoSuccessMark({ size = 80, className = "" }: BravoSuccessMarkProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{`
        /* ── Outer ring ── */
        @keyframes bsm-ring-rotate {
          from { transform: rotate(-90deg); }
          to   { transform: rotate(270deg); }
        }
        @keyframes bsm-ring-fill {
          0%   { stroke-dashoffset: ${C}; }
          55%  { stroke-dashoffset: 4;   }
          75%  { stroke-dashoffset: 4;   }
          100% { stroke-dashoffset: ${C}; }
        }
        .bsm-ring {
          transform-origin: 40px 40px;
          animation:
            bsm-ring-rotate 2.6s linear     infinite,
            bsm-ring-fill   2.6s ease-in-out infinite;
        }

        /* ── Coin flip ── */
        @keyframes bsm-coin-flip {
          0%   { transform: perspective(200px) rotateY(0deg)   scale(1);    }
          35%  { transform: perspective(200px) rotateY(180deg) scale(0.88); }
          50%  { transform: perspective(200px) rotateY(180deg) scale(0.88); }
          85%  { transform: perspective(200px) rotateY(360deg) scale(1);    }
          100% { transform: perspective(200px) rotateY(360deg) scale(1);    }
        }
        .bsm-coin {
          animation: bsm-coin-flip 2.6s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        /* ── Checkmark draw ── */
        @keyframes bsm-check {
          from { stroke-dashoffset: 32; opacity: 0.3; }
          to   { stroke-dashoffset: 0;  opacity: 1;   }
        }
        .bsm-check {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          animation: bsm-check 0.45s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
        }

        /* ── Sparkle ── */
        @keyframes bsm-sparkle {
          0%   { opacity: 0;   transform: scale(0)    rotate(0deg);   }
          20%  { opacity: 1;   transform: scale(1)    rotate(45deg);  }
          55%  { opacity: 0.85; transform: scale(1.2) rotate(90deg);  }
          80%  { opacity: 0.2; transform: scale(0.5)  rotate(135deg); }
          100% { opacity: 0;   transform: scale(0)    rotate(180deg); }
        }
        .bsm-sparkle {
          position: absolute;
          pointer-events: none;
          animation: bsm-sparkle var(--sp-dur) ease-in-out var(--sp-delay) infinite;
          transform-origin: center center;
        }

        /* ── Ambient glow ── */
        @keyframes bsm-glow {
          0%, 100% { opacity: 0.15; transform: scale(1);    }
          50%      { opacity: 0.35; transform: scale(1.12); }
        }
        .bsm-glow {
          animation: bsm-glow 2.6s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>

      {/* ── Ambient glow (behind everything) ── */}
      <div
        className="bsm-glow absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(94,203,219,0.35) 0%, rgba(91,44,114,0.25) 50%, transparent 70%)",
          margin: -size * 0.15,
          width: size * 1.3,
          height: size * 1.3,
        }}
      />

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
        {/* Track */}
        <circle cx="40" cy="40" r="36" stroke="#DCF5F8" strokeWidth="4" />
        {/* Animated ring */}
        <circle
          className="bsm-ring"
          cx="40" cy="40" r="36"
          stroke="url(#bsm-ringGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>

      {/* ── Coin (inner) ── */}
      <div
        className="bsm-coin absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "center center" }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="bsm-coin" cx="38%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#22A87A" />
              <stop offset="100%" stopColor="#0F6248" />
            </radialGradient>
            <filter id="bsm-gf" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#157A5A" floodOpacity="0.45" />
            </filter>
          </defs>
          <circle cx="28" cy="28" r="26" fill="url(#bsm-coin)" filter="url(#bsm-gf)" />
          <ellipse cx="22" cy="19" rx="9" ry="5" fill="white" fillOpacity="0.16" transform="rotate(-20 22 19)" />
          <path
            className="bsm-check"
            d="M17 28.5L24.5 36L39 21"
            stroke="white" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Sparkles (absolutely positioned HTML divs) ── */}
      {SPARKLES.map((sp, i) => {
        const rad   = ((sp.angle - 90) * Math.PI) / 180; // -90 so 0° = top
        const half  = size / 2;
        const dist  = size * sp.dist;
        const left  = half + dist * Math.cos(rad) - sp.sz;
        const top   = half + dist * Math.sin(rad) - sp.sz;
        return (
          <div
            key={i}
            className="bsm-sparkle"
            style={{
              left,
              top,
              width: sp.sz * 2,
              height: sp.sz * 2,
              "--sp-dur":   sp.dur,
              "--sp-delay": sp.delay,
            } as React.CSSProperties}
          >
            <svg
              width={sp.sz * 2}
              height={sp.sz * 2}
              viewBox={`${-sp.sz} ${-sp.sz} ${sp.sz * 2} ${sp.sz * 2}`}
              overflow="visible"
            >
              <path d={star4(sp.sz)} fill={sp.color} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
