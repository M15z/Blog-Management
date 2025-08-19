import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Pusher from "pusher";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ensure user is a participant
  const membership = await prisma.conversationParticipant.findFirst({
    where: { conversationId: id, userId: session.user.id },
    select: { id: true },
  });
  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    take: 100, // paginate in real apps
  });
  return NextResponse.json(messages);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim())
    return NextResponse.json({ error: "Empty" }, { status: 400 });

  const membership = await prisma.conversationParticipant.findFirst({
    where: { conversationId: id, userId: session.user.id },
    select: { id: true },
  });
  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const msg = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: session.user.id,
      content,
    },
  });

  // TODO: broadcast realtime event
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });
  await pusher.trigger(`conversation-${id}`, "new-message", msg);
  return NextResponse.json(msg, { status: 201 });
}
