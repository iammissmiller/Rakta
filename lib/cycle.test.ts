import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCycleInfo, getPregnancyWeek, formatDate } from "./cycle";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

describe("getCycleInfo", () => {
  it("reports day 1 on the first day of a period", () => {
    const info = getCycleInfo(daysAgo(0), 28, 5);
    expect(info.dayInCycle).toBe(1);
    expect(info.isOverdue).toBe(false);
  });

  it("reports the correct day mid-cycle", () => {
    const info = getCycleInfo(daysAgo(10), 28, 5);
    expect(info.dayInCycle).toBe(11);
    expect(info.daysUntilNextPeriod).toBe(18);
  });

  it("flags menstrual, follicular, ovulation, and luteal phases correctly", () => {
    expect(getCycleInfo(daysAgo(2), 28, 5).phase).toBe("menstrual");
    expect(getCycleInfo(daysAgo(8), 28, 5).phase).toBe("follicular");
    expect(getCycleInfo(daysAgo(13), 28, 5).phase).toBe("ovulation");
    expect(getCycleInfo(daysAgo(20), 28, 5).phase).toBe("luteal");
  });

  // Regression test: this used to wrap via `daysSinceLast % cycleLength`,
  // so a 35-day-late period on a 28-day cycle read as "day 8 of a new
  // cycle" instead of being flagged overdue. This must never silently
  // come back.
  it("flags an overdue period instead of wrapping around to a low day number", () => {
    const info = getCycleInfo(daysAgo(35), 28, 5);
    expect(info.isOverdue).toBe(true);
    expect(info.daysOverdue).toBe(8);
    expect(info.dayInCycle).toBe(36); // keeps counting up, never wraps
    expect(info.daysUntilNextPeriod).toBe(0);
  });

  it("is not overdue on the exact last day of the expected cycle", () => {
    const info = getCycleInfo(daysAgo(27), 28, 5);
    expect(info.isOverdue).toBe(false);
  });

  it("becomes overdue the day after the expected cycle length", () => {
    const info = getCycleInfo(daysAgo(28), 28, 5);
    expect(info.isOverdue).toBe(true);
    expect(info.daysOverdue).toBe(1);
  });

  it("respects a custom cycle length", () => {
    const info = getCycleInfo(daysAgo(10), 35, 6);
    expect(info.daysUntilNextPeriod).toBe(25);
    expect(info.isOverdue).toBe(false);
  });
});

describe("getPregnancyWeek", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates week 1 right at the last period date", () => {
    const lmp = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(lmp);
    const { week, trimester } = getPregnancyWeek(lmp.toISOString().split("T")[0]);
    expect(week).toBe(1);
    expect(trimester).toBe(1);
  });

  it("moves into the second trimester at week 14", () => {
    const lmp = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(new Date(lmp.getTime() + 13 * 7 * 86400000));
    const { week, trimester } = getPregnancyWeek(lmp.toISOString().split("T")[0]);
    expect(week).toBe(14);
    expect(trimester).toBe(2);
  });

  it("moves into the third trimester at week 28", () => {
    const lmp = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(new Date(lmp.getTime() + 27 * 7 * 86400000));
    const { week, trimester } = getPregnancyWeek(lmp.toISOString().split("T")[0]);
    expect(week).toBe(28);
    expect(trimester).toBe(3);
  });

  it("caps at week 42 rather than climbing forever", () => {
    const lmp = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(new Date(lmp.getTime() + 60 * 7 * 86400000));
    const { week } = getPregnancyWeek(lmp.toISOString().split("T")[0]);
    expect(week).toBe(42);
  });
});

describe("formatDate", () => {
  it("formats a date in the en-IN day/long-month style", () => {
    expect(formatDate("2026-03-15")).toBe("15 March");
  });
});
