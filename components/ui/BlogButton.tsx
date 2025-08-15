"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogButton({
  blogId,
  action,
  className,
}: {
  blogId: string;
  action: string;
  className: string;
}) {
  const router = useRouter();

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Redirect user to the main page
        router.push("/");
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    action === "Delete" ? (
      <button className={className} onClick={() => handleDeleteBlog(blogId)}>
        {action} Blog
      </button>
    ) : (
      <button className={className}>
        <Link href={`/blogs/${blogId}/edit`}>
          {action} Blog
        </Link>
      </button>
    )
  );
}

