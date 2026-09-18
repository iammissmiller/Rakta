import { prisma } from "@/lib/prisma";

export async function fetchUserRecentLogs(userId: string, days: number = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await prisma.cycleLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "desc" },
  });

  if (logs.length === 0) {
    return {
      hasLogs: false,
      message: "No logged entries in this window — the user hasn't tracked anything recently.",
    };
  }

  return {
    hasLogs: true,
    entries: logs.map((l) => ({
      date: l.date.toISOString().split("T")[0],
      flow: l.flow ?? undefined,
      mood: l.mood ?? undefined,
      symptoms: l.symptoms,
      notes: l.notes ?? undefined,
    })),
  };
}
