import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCycleInfo, getPregnancyWeek } from "@/lib/cycle";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { token } = await params;

  const contact = await prisma.trustedContact.findUnique({ where: { inviteToken: token } });
  if (!contact) {
    return NextResponse.json({ error: "This invite link isn't valid." }, { status: 404 });
  }
  if (!contact.sharing) {
    return NextResponse.json({ error: "Sharing has been paused for this link." }, { status: 403 });
  }

  // First person to open the link with an account claims it. Anyone else
  // trying the same link afterwards is refused — one invite, one viewer.
  if (contact.viewerUserId && contact.viewerUserId !== session.user.id) {
    return NextResponse.json(
      { error: "This invite has already been claimed by someone else." },
      { status: 403 }
    );
  }
  if (!contact.viewerUserId) {
    await prisma.trustedContact.update({
      where: { id: contact.id },
      data: { viewerUserId: session.user.id },
    });
  }

  const profile = await prisma.profile.findUnique({ where: { userId: contact.userId } });
  if (!profile) {
    return NextResponse.json({ ownerName: contact.name, status: "not_set_up" });
  }

  if (profile.lifeStage === "pregnant") {
    if (!profile.lastPeriodDate) {
      return NextResponse.json({ ownerName: profile.name, status: "no_data" });
    }
    const { week, trimester } = getPregnancyWeek(profile.lastPeriodDate.toISOString().split("T")[0]);
    return NextResponse.json({ ownerName: profile.name, status: "pregnancy", week, trimester });
  }

  if (profile.lifeStage === "menopausal") {
    return NextResponse.json({ ownerName: profile.name, status: "menopause" });
  }

  if (!profile.lastPeriodDate) {
    return NextResponse.json({ ownerName: profile.name, status: "no_data" });
  }

  const info = getCycleInfo(
    profile.lastPeriodDate.toISOString().split("T")[0],
    profile.cycleLength,
    profile.periodLength
  );

  return NextResponse.json({
    ownerName: profile.name,
    status: "cycle",
    phase: info.phase,
    dayInCycle: info.dayInCycle,
    isOverdue: info.isOverdue,
    daysOverdue: info.daysOverdue,
    nextPeriodDate: info.nextPeriodDate,
  });
}
