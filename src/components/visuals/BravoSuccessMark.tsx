"use client";

import React from "react";

interface BravoSuccessMarkProps {
  size?: number;
  className?: string;
}

const C = 226.2; // Circumference r=36

// 8 sparkle positions (angle in deg, distance from center, size, color, delay)
const SPARKLES = [
  { angle: 15,  dist: 52, s: 5,   color: "#5ECBDB", delay: "0s",    dur: "1.8s" },
  { angle: 72,  dist: 56, s: 3.5, color: "#AB6CCA", delay: "0.35s", dur: "2.1s" },
  { angle: 130, dist: 50, s: 6,   color: "#5ECBDB", delay: "0.6s",  dur: "1.6s" },
  { angle: 190, dist: 54, s: 4,   color: "#22C55E", delay: "0.15s", dur: "2.3s" },
  { angle: 245, dist: 52, s: 3,   color: "#F0C040", delay: "0.8s",  dur: "1.9s" },
  { angle: 300, dist: 56, s: 5.5, color: "#AB6CCA", delay: "0.45s", dur: "2.0s" },
  { angle: 345, dist: 48, s: 3,   color: "#5ECBDB", delay: "1.0s",  dur: "1.7s" },
  { angle: 100, dist: 58, s: 4.5, color: "#22C55E", delay: "0.25s", dur: "2.2s" },
];

// 4-point star path for a given center (cx,cy) and size
function starPath(cx: number, cy: number, s: number): string {
  const o = s;
  const i = s * 0.38;
  return [
    `M ${cx} ${cy - o}`,
    `C ${cx + i} ${cy - i} ${cx + i} ${cy - i} ${cx + o} ${cy}`,
    `C ${cx + i} ${cy + i} ${cx + i} ${cy + i} ${cx} ${cy + o}`,
    `C ${cx - i} ${cy + i} ${cx - i} ${cy + i} ${cx - o} ${cy}`,
    `C ${cx - i} ${cy - i} ${cx - i} ${cy - i} ${cx} ${cy - o} Z`,
  ].join(" ");
}

export function BravoSuccessMark({ size = 80, className = "" }: BravoSuccessMarkProps) {
  const center = size / 2;
  const scale  = size / 80;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{`
        /* ── Outer ring ── */
        @keyframes bravo-ring-rotate {
          from { transform: rotate(-90deg); }
          to   { transform: rotate(270deg); }
        }
        @keyframes bravo-ring-fill {
          0%   { stroke-dashoffset: ${C}; }
          55%  { stroke-dashoffset: 4;   }
          75%  { stroke-dashoffset: 4;   }
          100% { stroke-dashoffset: ${C}; }
        }
        .bravo-ring-track {
          transform-origin: 40px 40px;
          animation:
            bravo-ring-rotate 2.6s linear infinite,
            bravo-ring-fill   2.6s ease-in-out infinite;
        }

        /* ── Coin flip ── */
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

        /* ── Checkmark draw ── */
        @keyframes bravo-check-draw {
          from { stroke-dashoffset: 32; opacity: 0.3; }
          to   { stroke-dashoffset: 0;  opacity: 1;   }
        }
        .bravo-check {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          animation: bravo-check-draw 0.45s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
        }

        /* ── Sparkle twinkle ── */
        @keyframes bravo-sparkle {
          0%   { opacity: 0;   transform: scale(0)   rotate(0deg);   }
          25%  { opacity: 1;   transform: scale(1)   rotate(45deg);  }
          55%  { opacity: 0.9; transform: scale(1.15) rotate(90deg); }
          80%  { opacity: 0.3; transform: scale(0.5) rotate(135deg); }
          100% { opacity: 0;   transform: scale(0)   rotate(180deg); }
        }
        .bravo-sparkle {
          animation: bravo-sparkle var(--dur) ease-in-out var(--delay) infinite;
          transform-origin: var(--cx) var(--cy);
          transform-box: fill-box;
        }

        /* ── Ambient glow pulse ── */
        @keyframes bravo-glow-pulse {
          0%, 100% { opacity: 0.18; r: 38; }
          50%       { opacity: 0.35; r: 44; }
        }
        .bravo-glow-ring {
          animation: bravo-glow-pulse 2.6s ease-in-out infinite;
        }
      `}</style>

      {/* ── Outer ring + sparkles SVG (overflow visible for sparkles outside bounds) ── */}
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

          {/* Radial glow for ambient pulse */}
          <radialGradient id="bsm-glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#5ECBDB" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5B2C72" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* Ambient pulsing glow behind everything */}
        <circle
          className="bravo-glow-ring"
          cx="40" cy="40" r="38"
          fill="url(#bsm-glowGrad)"
        />

        {/* Static track */}
        <circle cx="40" cy="40" r="36" stroke="#DCF5F8" strokeWidth="4" />

        {/* Animated progress ring */}
        <circle
          className="bravo-ring-track"
          cx="40" cy="40" r="36"
          stroke="url(#bsm-ringGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />

        {/* ── Sparkle stars ── */}
        {SPARKLES.map((sp, i) => {
          const rad = (sp.angle * Math.PI) / 180;
          const cx  = 40 + sp.dist * Math.cos(rad);
          const cy  = 40 + sp.dist * Math.sin(rad);
          return (
            <path
              key={i}
              className="bravo-sparkle"
              d={starPath(cx, cy, sp.s)}
              fill={sp.color}
              fillOpacity="0"
              style={{
                "--dur":  sp.dur,
                "--delay": sp.delay,
                "--cx": `${cx}px`,
                "--cy": `${cy}px`,
              } as React.CSSProperties}
            />
          );
        })}
      </svg>

      {/* ── Coin (inner circle + checkmark) ── */}
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

          <circle cx="28" cy="28" r="26" fill="url(#bsm-coinFace)" filter="url(#bsm-coinGlow)" />

          {/* Highlight sheen */}
          <ellipse
            cx="22" cy="19" rx="9" ry="5"
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
