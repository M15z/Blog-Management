import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { otherUserId } = await req.json();
  const me = session.user.id;
  if (!otherUserId || otherUserId === me) return NextResponse.json({ error: "Invalid target" }, { status: 400 });

  const pair = [me, otherUserId].sort();
  const pairKey = `${pair[0]}_${pair[1]}`;

  let convo = await prisma.conversation.findUnique({ where: { pairKey } });
  if (!convo) {
    convo = await prisma.conversation.create({
      data: {
        pairKey,
        participants: {
          create: [{ userId: me }, { userId: otherUserId }],
        },
      },
    });
  }
  return NextResponse.json({ conversationId: convo.id });
}