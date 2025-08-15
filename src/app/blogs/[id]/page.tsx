import CommentsLesting from "@/components/CommentsListing";
import DeleteBlogIcon from "@/components/ui/DeleteBlogIcon";
import EditBlogIcon from "@/components/ui/EditBlogIcon";
import LikeButton from "@/components/ui/LikeButton";
import ShareBlogIcon from "@/components/ui/ShareBlogIcon";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const prisma = new PrismaClient();
  const { id } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id: id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true } },
    },
  });
  await prisma.$disconnect();

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-500">This blog post doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const session = await auth();
  const userId = session?.user.id;

  // Enhanced date formatting
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)}w`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-lg md:max-w-xl lg:max-w-2xl bg-white min-h-screen">
        {/* Instagram-style Post */}
        <div className="bg-white">
          
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {blog.author.image ? (
                <img
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-gradient-to-r from-pink-500 to-orange-500 p-0.5"
                  src={blog.author.image}
                  alt={blog.author.name || "Author"}
                />
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm md:text-base ring-2 ring-gray-200">
                  {blog.author.name?.[0] || "A"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-sm md:text-base text-gray-900">{blog.author.name}</span>
                <span className="text-xs md:text-sm text-gray-500">{getTimeAgo(blog.createdAt)}</span>
              </div>
            </div>
            
            {userId === blog.author.id && (
              <div className="flex items-center space-x-2">
                <span className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <EditBlogIcon blogId={id} />
                </span>
                <span className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <DeleteBlogIcon blogId={id} />
                </span>
              </div>
            )}
          </div>

          {/* Post Image */}
          {blog.image && (
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Actions Bar */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-50">
            <div className="flex items-center space-x-4 md:space-x-6">
              <LikeButton blogId={id} initialLikeCount={blog._count.likes} />
              
              {/* Comment Icon */}
              <Link href="#comments" className="hover:text-gray-600 transition-colors">
                <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
              
              {/* Share Icon */}
              <ShareBlogIcon />
            </div>
            
            {/* Bookmark */}
            <button className="hover:text-gray-600 transition-colors">
              <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 md:px-6 py-3 md:py-4 space-y-3 md:space-y-4">
            {/* Category Badge */}
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800">
                {blog.category}
              </span>
            </div>

            {/* Title and Content */}
            <div className="space-y-2 md:space-y-3">
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl text-gray-900 leading-tight">
                {blog.title}
              </h1>
              
              <div className="text-sm md:text-base text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">{blog.author.name}</span>
                <span className="ml-1">{blog.content}</span>
              </div>
            </div>

            {/* Reading time and date */}
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
              <span>{Math.ceil(blog.content.length / 200)} min read</span>
              <span>•</span>
              <time dateTime={blog.createdAt.toISOString()}>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(blog.createdAt))}
              </time>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-100 bg-gray-50" id="comments">
            <div className="p-4 md:p-6">
              <CommentsLesting blogId={id} currentUserId={userId ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}