export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface CycleInfo {
  dayInCycle: number;
  phase: CyclePhase;
  daysUntilNextPeriod: number;
  nextPeriodDate: string;
  cycleLength: number;
  periodLength: number;
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
  const dayInCycle = (daysSinceLast % cycleLength) + 1;

  const daysUntilNext = cycleLength - (daysSinceLast % cycleLength);
  const nextPeriod = new Date(today);
  nextPeriod.setDate(today.getDate() + daysUntilNext);

  const ovulationDay = cycleLength - 14;

  let phase: CyclePhase;
  if (dayInCycle <= periodLength) {
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
    daysUntilNextPeriod: daysUntilNext,
    nextPeriodDate: nextPeriod.toISOString().split("T")[0],
    cycleLength,
    periodLength,
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