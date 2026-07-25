"use client";

import type { CycleInfo } from "@/lib/cycle";

interface DayLog {
  mood?: string;
  flow?: string;
  symptoms?: string[];
}

interface MiniCalendarProps {
  cycleInfo: CycleInfo | null;
  logs: Record<string, DayLog>;
}

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

export default function MiniCalendar({ cycleInfo, logs }: MiniCalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = today.getDate();

  const nextPeriod = cycleInfo?.nextPeriodDate
    ? new Date(cycleInfo.nextPeriodDate)
    : null;

  const periodDays = new Set<number>();
  if (nextPeriod && nextPeriod.getMonth() === month) {
    for (let i = 0; i < 5; i++) periodDays.add(nextPeriod.getDate() + i);
  }

  const ovDay = nextPeriod
    ? new Date(nextPeriod.getTime() - 14 * 86400000)
    : null;
  const fertileDays = new Set<number>();
  if (ovDay && ovDay.getMonth() === month) {
    for (let i = -2; i <= 1; i++) fertileDays.add(ovDay.getDate() + i);
  }

  const loggedDays = new Set(
    Object.keys(logs)
      .filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
      .map((d) => parseInt(d.split("-")[2]))
  );

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <div className="mb-2.5 font-serif italic text-[13px] font-bold text-ink">
        {monthName}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_NAMES.map((d, i) => (
          <div
            key={i}
            className="py-0.5 text-center text-[9px] font-bold text-muted"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          const isToday = d === todayDate;
          const isPeriod = d !== null && periodDays.has(d);
          const isFertile = d !== null && fertileDays.has(d);
          const isLogged = d !== null && loggedDays.has(d);
          return (
            <div key={i} className="py-0.5 text-center">
              {d && (
                <span
                  className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px]"
                  style={{
                    background: isToday
                      ? "#B8000A"
                      : isPeriod
                      ? "rgba(184,0,10,0.1)"
                      : isFertile
                      ? "rgba(180,150,60,0.1)"
                      : "transparent",
                    color: isToday
                      ? "#fff"
                      : isPeriod
                      ? "#B8000A"
                      : isFertile
                      ? "#7A5010"
                      : "#3A1A10",
                    fontWeight: isToday ? 700 : isPeriod ? 600 : 400,
                    outline:
                      isLogged && !isToday
                        ? "1.5px solid rgba(184,0,10,0.3)"
                        : "none",
                    outlineOffset: "1px",
                  }}
                >
                  {d}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {[
          { color: "#B8000A", label: "Today" },
          { color: "rgba(184,0,10,0.12)", label: "Period", border: true },
          { color: "rgba(180,150,60,0.12)", label: "Fertile" },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px] text-muted">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background: l.color,
                border: l.border ? "1px solid #B8000A" : "none",
              }}
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}