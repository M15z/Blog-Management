// app/blogs/page.tsx
import BlogListing from "@/components/BlogsListing";
import { PrismaClient } from "@prisma/client";

// This function runs on the server
async function getBlogs() {
  const prisma = new PrismaClient();

  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    // Transform for client consumption and serialize dates
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      createdAt: blog.createdAt.toISOString(),
      author: {
        ...blog.author,
        name: blog.author.name ?? "",
      },
      likeCount: blog._count.likes,
    }));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function Page() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* BlogListing is a client component that wraps both our filter and grid */}
        <BlogListing initialBlogs={blogs} />
      </div>
    </div>
  );
}