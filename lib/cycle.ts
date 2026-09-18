export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface CycleInfo {
  dayInCycle: number;
  phase: CyclePhase;
  daysUntilNextPeriod: number;
  nextPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  isOverdue: boolean;
  /** How many days past the expected cycle length, 0 if not overdue. */
  daysOverdue: number;
}

export function getCycleInfo(
  lastPeriodDate: string,
  cycleLength: number = 28,
  periodLength: number = 5
): CycleInfo {
  const today = new Date();
  const last = new Date(lastPeriodDate);
  const daysSinceLast = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isOverdue = daysSinceLast >= cycleLength;
  const daysOverdue = isOverdue ? daysSinceLast - cycleLength + 1 : 0;

  // Day-in-cycle counts up from 1 and keeps climbing past cycleLength when
  // overdue, instead of wrapping back to a low number via modulo. Wrapping
  // was the original bug: it made a 35-day-late period look like day 8 of
  // a brand-new cycle instead of flagging it as overdue.
  const dayInCycle = daysSinceLast + 1;

  const daysUntilNextPeriod = isOverdue ? 0 : cycleLength - daysSinceLast;

  // The "expected" next period date, based on the last logged start date.
  // Once overdue this date is in the past — that's intentional, it tells
  // the caller what date was expected rather than guessing a new one.
  const expectedNextPeriod = new Date(last);
  expectedNextPeriod.setDate(last.getDate() + cycleLength);

  const ovulationDay = cycleLength - 14;

  let phase: CyclePhase;
  if (isOverdue) {
    // Past the modeled 4-phase cycle — treat as extended luteal rather
    // than guessing at a phase that assumes a period started on time.
    phase = "luteal";
  } else if (dayInCycle <= periodLength) {
    phase = "menstrual";
  } else if (dayInCycle <= ovulationDay - 2) {
    phase = "follicular";
  } else if (dayInCycle <= ovulationDay + 1) {
    phase = "ovulation";
  } else {
    phase = "luteal";
  }

  return {
    dayInCycle,
    phase,
    daysUntilNextPeriod,
    nextPeriodDate: expectedNextPeriod.toISOString().split("T")[0],
    cycleLength,
    periodLength,
    isOverdue,
    daysOverdue,
  };
}

export interface PhaseData {
  name: string;
  emoji: string;
  color: string;
  days: string;
  desc: string;
  hindiDesc: string;
  tips: string[];
}

export const PHASES: Record<CyclePhase, PhaseData> = {
  menstrual: {
    name: "Menstrual",
    emoji: "🩸",
    color: "#C8364A",
    days: "Day 1–5",
    desc: "Rest. Your body is releasing. Be gentle with yourself.",
    hindiDesc: "Aaram karo. Apna khayal rakho.",
    tips: [
      "Stay hydrated",
      "Light stretching or yoga",
      "Use a heating pad for cramps",
      "Iron-rich foods like spinach and lentils",
    ],
  },
  follicular: {
    name: "Follicular",
    emoji: "🌱",
    color: "#9B6FD4",
    days: "Day 6–13",
    desc: "Energy is rising. Great time to start new things.",
    hindiDesc: "Urja badh rahi hai. Naye kaam shuru karo.",
    tips: [
      "Good time to exercise",
      "Start that project you've been putting off",
      "Social energy is high",
      "Light, fresh foods",
    ],
  },
  ovulation: {
    name: "Ovulation",
    emoji: "✨",
    color: "#E8A030",
    days: "Day 14–16",
    desc: "Peak energy and confidence. You're magnetic right now.",
    hindiDesc: "Sabse zyada urja. Aap best feel kar rahi hain.",
    tips: [
      "High-intensity workouts feel great now",
      "Important conversations go well",
      "Fertile window — plan accordingly",
      "Zinc-rich foods support this phase",
    ],
  },
  luteal: {
    name: "Luteal",
    emoji: "🌙",
    color: "#4A90B8",
    days: "Day 17–28",
    desc: "Wind down. Honour your need for rest and quiet.",
    hindiDesc: "Dhire dhire kam karo. Aaram ki zaroorat hai.",
    tips: [
      "Reduce caffeine to ease PMS",
      "Magnesium helps with mood swings",
      "Journaling and reflection time",
      "Gentle walks over intense workouts",
    ],
  },
};

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

/** Gestational week/trimester from a last-period (LMP) date. Shared by the
 * Tracker and the family invite view so both agree on the same numbers. */
export function getPregnancyWeek(lastPeriodDate: string) {
  const days = Math.floor((Date.now() - new Date(lastPeriodDate).getTime()) / 86400000);
  const week = Math.max(1, Math.min(42, Math.floor(days / 7) + 1));
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  return { week, trimester };
}