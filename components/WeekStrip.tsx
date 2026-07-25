"use client";

interface DayLog {
  mood?: string;
  flow?: string;
  symptoms?: string[];
}

interface WeekStripProps {
  logs: Record<string, DayLog>;
  accent?: string;
}

const MOOD_SYMBOLS: Record<string, string> = {
  Loved: "♥",
  Glowing: "✦",
  Meh: "~",
  Irritable: "↯",
  Tired: "◌",
  Soft: "✿",
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeekStrip({ logs, accent = "#B8000A" }: WeekStripProps) {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return {
      key,
      log: logs[key],
      isToday: i === 6,
      label: DAY_LABELS[d.getDay()],
    };
  });

  return (
    <div className="flex items-end gap-1.5">
      {days.map(({ key, log, isToday, label }) => (
        <div key={key} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="flex aspect-square w-full items-center justify-center rounded-[10px] text-xs"
            style={{
              background: log ? "rgba(184,0,10,0.1)" : "rgba(184,0,10,0.04)",
              border: isToday
                ? "1.5px solid rgba(184,0,10,0.3)"
                : "1px solid rgba(184,0,10,0.1)",
              color: log ? accent : "rgba(184,0,10,0.2)",
            }}
          >
            {log ? MOOD_SYMBOLS[log.mood ?? ""] ?? "♥" : isToday ? "·" : ""}
          </div>
          <div
            className="text-[8px]"
            style={{
              color: isToday ? "var(--color-crimson)" : "var(--color-muted)",
              fontWeight: isToday ? 700 : 400,
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}