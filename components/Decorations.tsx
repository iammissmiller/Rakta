import type { CyclePhase } from "@/lib/cycle";

interface SvgStyleProps {
  style?: React.CSSProperties;
}

export function BowSVG({ style }: SvgStyleProps) {
  return (
    <svg style={style} viewBox="0 0 50 30" aria-hidden="true">
      <path d="M25 15 C17 4 2 1 4 10 C6 17 18 17 25 15Z" fill="#B8000A" />
      <path d="M25 15 C33 4 48 1 46 10 C44 17 32 17 25 15Z" fill="#B8000A" />
      <path d="M25 15 C17 26 2 29 4 20 C6 13 18 13 25 15Z" fill="#880008" />
      <path d="M25 15 C33 26 48 29 46 20 C44 13 32 13 25 15Z" fill="#880008" />
      <ellipse cx={25} cy={15} rx={4} ry={4} fill="#E01010" />
      <line x1={23} y1={19} x2={20} y2={29} stroke="#B8000A" strokeWidth={2} strokeLinecap="round" />
      <line x1={27} y1={19} x2={30} y2={29} stroke="#B8000A" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function LipstickMark({ style }: SvgStyleProps) {
  return (
    <svg style={style} viewBox="0 0 28 16" aria-hidden="true">
      <ellipse cx={14} cy={8} rx={13} ry={6} fill="#B8000A" />
      <ellipse cx={8} cy={8} rx={4} ry={6} fill="#B8000A" />
      <ellipse cx={20} cy={8} rx={4} ry={6} fill="#B8000A" />
      <ellipse cx={14} cy={5} rx={5} ry={3} fill="#D42020" />
    </svg>
  );
}

interface FlowerSvgProps {
  size?: number;
  color?: string;
}

export function FlowerSVG({ size = 18, color = "#FFFFFF" }: FlowerSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx={12}
          cy={6.5}
          rx={3.4}
          ry={5.5}
          fill={color}
          opacity={0.92}
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx={12} cy={12} r={2.4} fill="#B8000A" opacity={0.85} />
    </svg>
  );
}

interface PhaseIconProps {
  phase: CyclePhase;
  size?: number;
  color?: string;
}

export function PhaseIcon({ phase, size = 22, color = "#B8000A" }: PhaseIconProps) {
  switch (phase) {
    case "menstrual":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2 C12 2 5 11 5 15.5 C5 19.6 8.1 22 12 22 C15.9 22 19 19.6 19 15.5 C19 11 12 2 12 2Z"
            fill={color}
            opacity={0.85}
          />
        </svg>
      );
    case "follicular":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22 V10" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
          <path d="M12 12 C12 7 7 6 4 7 C5 11 9 13 12 12Z" fill={color} opacity={0.75} />
          <path d="M12 10 C12 5 17 4 20 5 C19 9 15 11 12 10Z" fill={color} opacity={0.85} />
        </svg>
      );
    case "ovulation":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx={12}
              cy={6.5}
              rx={2.6}
              ry={4.6}
              fill={color}
              opacity={0.8}
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
          <circle cx={12} cy={12} r={2.2} fill={color} />
        </svg>
      );
    case "luteal":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 12.5 A8 8 0 1 1 11.5 4 A6.5 6.5 0 0 0 20 12.5Z"
            fill={color}
            opacity={0.85}
          />
        </svg>
      );
  }
}