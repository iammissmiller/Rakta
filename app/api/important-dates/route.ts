import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toDateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const dates = await prisma.importantDate.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(
    dates.map((d) => ({
      id: d.id,
      date: d.date.toISOString().split("T")[0],
      label: d.label,
    }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { date, label } = (await request.json()) as {
      date: string;
      label: string;
    };

    if (!date || !label?.trim()) {
      return NextResponse.json(
        { error: "date and label are required" },
        { status: 400 }
      );
    }

    const created = await prisma.importantDate.create({
      data: {
        userId: session.user.id,
        date: toDateOnly(date),
        label: label.trim(),
      },
    });

    return NextResponse.json({
      id: created.id,
      date: created.date.toISOString().split("T")[0],
      label: created.label,
    });
  } catch (error) {
    console.error("Important date save error:", error);
    return NextResponse.json(
      { error: "Failed to save date" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // Scoped to this user's id too, so one person can't delete another's row
  // by guessing an id.
  await prisma.importantDate.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
