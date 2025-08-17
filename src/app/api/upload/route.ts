import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 },
    );
  }
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const authorId = formData.get("authorId") as string;
    const category = formData.get("category") as string;

    if (!file || !title || !content || !authorId || !category) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }
  
    // Save image to /public/uploads
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    // const uploadPath = path.join(process.cwd(), "public", "uploads");
    // const filePath = path.join(uploadPath, filename);
    const imageUrl = `/uploads/${filename}`;
    const { url } = await put(imageUrl, file, { access: "public" });

    // await writeFile(filePath, buffer);

    // Create blog post with image and category
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        image: url,
        category, // Add the category field
        authorId,
      },
    });

    return NextResponse.json({
      message: "Blog post created successfully!",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}