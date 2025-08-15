import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const blogId = id;

    // Check if the user has already liked the blog
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    if (existingLike) {
      // User already liked the blog, so remove the like (unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        message: "Blog unliked successfully",
        liked: false,
      });
    } else {
      // User hasn't liked the blog yet, so create a new like
      await prisma.like.create({
        data: {
          blog: { connect: { id: blogId } },
          user: { connect: { id: userId } },
        },
      });

      return NextResponse.json({
        message: "Blog liked successfully",
        liked: true,
      });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}



// GET handler to check if user has liked a blog and get like count
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const session = await auth();
    const blogId = id;

    // Get total like count for the blog
    const likeCount = await prisma.like.count({
      where: {
        blogId,
      },
    });

    // If user is logged in, check if they've liked the blog
    let userLiked = false;
    if (session && session.user) {
      const userId = session.user.id;
      const like = await prisma.like.findUnique({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });

      userLiked = !!like;
    }

    return NextResponse.json({
      likeCount,
      userLiked,
    });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
