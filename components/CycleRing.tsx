"use client";

import type { CyclePhase } from "@/lib/cycle";

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation",
  luteal: "Luteal",
};

const SEGMENTS: { phase: CyclePhase; fraction: number }[] = [
  { phase: "menstrual", fraction: 5 / 28 },
  { phase: "follicular", fraction: 8 / 28 },
  { phase: "ovulation", fraction: 3 / 28 },
  { phase: "luteal", fraction: 12 / 28 },
];

interface CycleRingProps {
  phase?: CyclePhase;
  dayInCycle?: number;
  size?: number;
}

export default function CycleRing({
  phase = "follicular",
  dayInCycle = 1,
  size = 96,
}: CycleRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const strokeW = size * 0.09;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={strokeW}
      />

      {/* Segments */}
      {SEGMENTS.map(({ phase: p, fraction }, i) => {
        const dashLen = fraction * circumference;
        const dashOffset = circumference - offset * circumference;
        const isActive = p === phase;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)"}
            strokeWidth={isActive ? strokeW + 2 : strokeW - 2}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "all 0.5s ease",
            }}
          />
        );
        offset += fraction;
        return el;
      })}

      {/* Phase name */}
      <text
        x={cx}
        y={cy - size * 0.07}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={size * 0.11}
        fontWeight="700"
        fontFamily="Playfair Display, Georgia, serif"
        fontStyle="italic"
      >
        {PHASE_LABELS[phase]}
      </text>

      {/* Day number */}
      <text
        x={cx}
        y={cy + size * 0.1}
        textAnchor="middle"
        fill="rgba(255,255,255,0.9)"
        fontSize={size * 0.14}
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {dayInCycle}
      </text>

      {/* of cycle */}
      <text
        x={cx}
        y={cy + size * 0.25}
        textAnchor="middle"
        fill="rgba(255,255,255,0.55)"
        fontSize={size * 0.08}
        fontFamily="sans-serif"
      >
        of cycle
      </text>
    </svg>
  );
}