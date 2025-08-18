import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const blog = await prisma.blog.findUnique({
      where: { id },
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

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 },
    );
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: id },
      select: { authorId: true },
    });

    if (!blog) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (blog.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this blog" },
        { status: 403 },
      );
    }

    // Delete the comment
    await prisma.blog.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();

  // Get form values
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const authorId = formData.get("authorId") as string;

  // Validate ownership
  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }

  if (blog.authorId !== session.user.id) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  // Handle image if provided
  let imageUrl;
  const file = formData.get("image") as File | null;
  if (file) {
    // Check photo size
    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds limit" },
        { status: 400 },
      );
    }

    // Check photo type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Process image upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadPath, filename);
    imageUrl = `/uploads/${filename}`;

    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 },
      );
    }
  }

  // Update the blog
  const updateData: any = {
    title,
    content,
    category,
  };

  // Only update image if a new one was provided
  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updatedBlog);
}
