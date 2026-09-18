import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = (await request.json()) as { id: string };
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Clears the connected viewer AND swaps the token, so the link this
    // contact was given no longer works — a fresh one has to be copied and
    // resent if they want to reconnect (or a different person now needs
    // their own invite).
    const contact = await prisma.trustedContact.updateMany({
      where: { id, userId: session.user.id },
      data: { viewerUserId: null, inviteToken: randomUUID() },
    });

    if (contact.count === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const updated = await prisma.trustedContact.findUnique({ where: { id } });
    return NextResponse.json({ inviteToken: updated?.inviteToken });
  } catch (error) {
    console.error("Revoke error:", error);
    return NextResponse.json({ error: "Failed to revoke" }, { status: 500 });
  }
}
