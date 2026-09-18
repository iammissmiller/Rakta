import { prisma } from "@/lib/prisma";
import { getCycleInfo } from "@/lib/cycle";

export async function fetchUserCycleInfo(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile || !profile.lastPeriodDate) {
    return {
      hasData: false,
      message: "No cycle data available yet — user hasn't completed onboarding or logged a period date.",
    };
  }

  const info = getCycleInfo(
    profile.lastPeriodDate.toISOString().split("T")[0],
    profile.cycleLength,
    profile.periodLength
  );

  return {
    hasData: true,
    name: profile.name,
    phase: info.phase,
    dayInCycle: info.dayInCycle,
    daysUntilNextPeriod: info.daysUntilNextPeriod,
    isOverdue: info.isOverdue,
    daysOverdue: info.daysOverdue,
    pmosStatus: profile.pmosStatus,
    lifeStage: profile.lifeStage,
  };
}