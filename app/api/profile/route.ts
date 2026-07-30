import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      lifeStage,
      pmosStatus,
      lastPeriodDate,
      cycleLength,
      periodLength,
    } = body;

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        name,
        lifeStage,
        pmosStatus,
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : undefined,
        cycleLength,
        periodLength,
      },
      create: {
        userId: session.user.id,
        name,
        lifeStage,
        pmosStatus,
        lastPeriodDate: lastPeriodDate ? new Date(lastPeriodDate) : undefined,
        cycleLength: cycleLength || 28,
        periodLength: periodLength || 5,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}