"use client";

import { useState } from "react";
import type { CycleInfo } from "@/lib/cycle";

interface DayLog {
  mood?: string;
  flow?: string;
  symptoms?: string[];
  notes?: string;
}

interface ImportantDate {
  id: string;
  date: string; // "YYYY-MM-DD"
  label: string;
}

interface TrackerCalendarProps {
  cycleInfo: CycleInfo | null;
  logs: Record<string, DayLog>;
  importantDates: ImportantDate[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  /** "cycle" shows period/fertile bands; "symptom" (pregnancy/menopause) just shows logs + important dates. */
  mode: "cycle" | "symptom";
}

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function TrackerCalendar({
  cycleInfo,
  logs,
  importantDates,
  selectedDate,
  onSelectDate,
  mode,
}: TrackerCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const periodDays = new Set<number>();
  const fertileDays = new Set<number>();
  if (mode === "cycle" && cycleInfo) {
    const nextPeriod = new Date(cycleInfo.nextPeriodDate);
    if (nextPeriod.getFullYear() === viewYear && nextPeriod.getMonth() === viewMonth) {
      for (let i = 0; i < cycleInfo.periodLength; i++) {
        periodDays.add(nextPeriod.getDate() + i);
      }
    }
    const ovDay = new Date(nextPeriod.getTime() - 14 * 86400000);
    if (ovDay.getFullYear() === viewYear && ovDay.getMonth() === viewMonth) {
      for (let i = -2; i <= 1; i++) fertileDays.add(ovDay.getDate() + i);
    }
  }

  const importantByDay = new Map<number, ImportantDate[]>();
  for (const d of importantDates) {
    const [y, m, day] = d.date.split("-").map(Number);
    if (y === viewYear && m - 1 === viewMonth) {
      importantByDay.set(day, [...(importantByDay.get(day) ?? []), d]);
    }
  }

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() =>
            viewMonth === 0
              ? (setViewYear((y) => y - 1), setViewMonth(11))
              : setViewMonth((m) => m - 1)
          }
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-crimson hover:bg-crimson/5"
        >
          ←
        </button>
        <div className="font-serif text-lg italic font-bold text-ink">{monthName}</div>
        <button
          onClick={() =>
            viewMonth === 11
              ? (setViewYear((y) => y + 1), setViewMonth(0))
              : setViewMonth((m) => m + 1)
          }
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-crimson hover:bg-crimson/5"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="py-1 text-center text-[11px] font-bold text-muted">
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={i} />;

          const key = toKey(viewYear, viewMonth, d);
          const isToday =
            viewYear === today.getFullYear() &&
            viewMonth === today.getMonth() &&
            d === today.getDate();
          const isSelected = key === selectedDate;
          const isPeriod = periodDays.has(d);
          const isFertile = fertileDays.has(d);
          const isLogged = !!logs[key];
          const dayImportant = importantByDay.get(d);
          const isClash = !!dayImportant && isPeriod;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(key)}
              className="relative flex flex-col items-center gap-0.5 py-1"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-[13px]"
                style={{
                  background: isSelected
                    ? "#B8000A"
                    : isClash
                    ? "rgba(230,140,0,0.16)"
                    : isPeriod
                    ? "rgba(184,0,10,0.1)"
                    : isFertile
                    ? "rgba(180,150,60,0.12)"
                    : isToday
                    ? "rgba(184,0,10,0.06)"
                    : "transparent",
                  color: isSelected
                    ? "#fff"
                    : isClash
                    ? "#A66200"
                    : isPeriod
                    ? "#B8000A"
                    : isFertile
                    ? "#7A5010"
                    : "#3A1A10",
                  fontWeight: isSelected || isToday ? 700 : 400,
                  border: isToday && !isSelected ? "1.5px solid rgba(184,0,10,0.4)" : "none",
                  outline: isLogged && !isSelected ? "1.5px solid rgba(184,0,10,0.35)" : "none",
                  outlineOffset: 1,
                }}
              >
                {d}
              </span>
              {dayImportant && (
                <span
                  title={dayImportant.map((x) => x.label).join(", ")}
                  style={{ fontSize: 7, color: isClash ? "#A66200" : "#7A5010" }}
                >
                  ●
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {(mode === "cycle"
          ? [
              { color: "#B8000A", label: "Today", outline: true },
              { color: "rgba(184,0,10,0.12)", label: "Period" },
              { color: "rgba(180,150,60,0.14)", label: "Fertile" },
              { color: "rgba(230,140,0,0.2)", label: "Clash" },
            ]
          : [
              { color: "#B8000A", label: "Today", outline: true },
              { color: "rgba(230,140,0,0.2)", label: "Important date" },
            ]
        ).map((l, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: l.color,
                border: l.outline ? "1.5px solid #B8000A" : "none",
              }}
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
