import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: currentUser.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      participants: conv.participants,
      lastMessage: conv.messages[0] || null,
      updatedAt: conv.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { participantId } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                id: currentUser.id,
              },
            },
          },
          {
            participants: {
              some: {
                id: participantId,
              },
            },
          },
        ],
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [
            { id: currentUser.id },
            { id: participantId },
          ],
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}