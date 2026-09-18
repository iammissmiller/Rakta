import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Normalizes a date to midnight UTC so "2026-09-18" always maps to the same
// row regardless of what time of day the request comes in.
function toDateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const logs = await prisma.cycleLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  // Shape as { "2026-09-18": { date, flow, mood, symptoms, notes }, ... }
  // — matches what the dashboard/tracker already expect, so switching from
  // localStorage to this endpoint doesn't require changing every consumer.
  const byDate: Record<string, unknown> = {};
  for (const log of logs) {
    const key = log.date.toISOString().split("T")[0];
    byDate[key] = {
      date: key,
      flow: log.flow ?? undefined,
      mood: log.mood ?? undefined,
      symptoms: log.symptoms,
      notes: log.notes ?? undefined,
    };
  }

  return NextResponse.json(byDate);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, flow, mood, symptoms, notes } = body as {
      date: string;
      flow?: string;
      mood?: string;
      symptoms?: string[];
      notes?: string;
    };

    if (!date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    const day = toDateOnly(date);

    const log = await prisma.cycleLog.upsert({
      where: { userId_date: { userId: session.user.id, date: day } },
      update: {
        flow: flow ?? undefined,
        mood: mood ?? undefined,
        symptoms: symptoms ?? undefined,
        notes: notes ?? undefined,
      },
      create: {
        userId: session.user.id,
        date: day,
        flow,
        mood,
        symptoms: symptoms ?? [],
        notes,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Log save error:", error);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}
