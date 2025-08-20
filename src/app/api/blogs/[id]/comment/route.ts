import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';


export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const comments = await prisma.comment.findMany({
      where: { blogId: id },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Transform for client consumption
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.author.id,
        name: comment.author.name,
        image: comment.author.image,
      },
    }));
    console.log(formattedComments);
    return NextResponse.json(formattedComments);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const blogId = id;
    console.log(blogId);
    const session = await auth();
    const formData = await req.formData();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const comment = formData.get("comment") as string;
    const authorId = formData.get("authorId") as string;

    if (!authorId || !comment) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        authorId,
        blogId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt.toISOString(),
      author: {
        id: newComment.author.id,
        name: newComment.author.name,
        image: newComment.author.image,
      },
    });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
