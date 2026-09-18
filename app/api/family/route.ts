import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const contacts = await prisma.trustedContact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: { viewer: { select: { email: true } } },
  });

  return NextResponse.json(
    contacts.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      sharing: c.sharing,
      inviteToken: c.inviteToken,
      connected: !!c.viewerUserId,
      viewerEmail: c.viewer?.email ?? null,
    }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { name, phone } = (await request.json()) as { name: string; phone?: string };
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const contact = await prisma.trustedContact.create({
      data: { userId: session.user.id, name: name.trim(), phone: phone?.trim() || null },
    });

    return NextResponse.json({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      sharing: contact.sharing,
      inviteToken: contact.inviteToken,
      connected: false,
      viewerEmail: null,
    });
  } catch (error) {
    console.error("Family contact save error:", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id, sharing } = (await request.json()) as { id: string; sharing: boolean };
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Pauses/resumes sharing without deleting the contact or revoking the
    // connection — the viewer stays linked, they just can't fetch status
    // while sharing is off.
    await prisma.trustedContact.updateMany({
      where: { id, userId: session.user.id },
      data: { sharing },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Family contact update error:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
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

  // Scoped to this user's id, so one person can't delete another's contact
  // row by guessing an id.
  await prisma.trustedContact.deleteMany({ where: { id, userId: session.user.id } });

  return NextResponse.json({ ok: true });
}
