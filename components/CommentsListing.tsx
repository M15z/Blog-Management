"use client";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
};

export default function CommentsLesting({
  blogId,
  currentUserId,
}: {
  blogId: string;
  currentUserId: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleCommentAdded = (newComment: Comment) => {
    if (newComment && newComment.id) {
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  const { data: session } = useSession();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}/comment`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.filter((comment: any) => comment && comment.id));
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/blogs/${blogId}/comment/${commentId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId),
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Instagram-style time formatting
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div id="comments" className="space-y-4 md:space-y-6">
      {/* Comments Header */}
      {!isLoading && comments.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 md:text-base">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
          {hasMoreComments && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 md:text-base"
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-3 md:space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-start space-x-3 md:space-x-4"
            >
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 md:h-10 md:w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-16 rounded bg-gray-200 md:h-4 md:w-20"></div>
                  <div className="h-3 w-8 rounded bg-gray-200 md:h-4 md:w-10"></div>
                </div>
                <div className="h-4 w-full rounded bg-gray-200 md:h-5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {displayedComments.map((comment, index) => (
            <div
              key={`comment-${comment.id || index}`}
              className="group flex items-start space-x-3 md:space-x-4"
            >
              {/* Avatar */}
              {comment.author.image ? (
                <img
                  className="h-8 w-8 flex-shrink-0 rounded-full md:h-10 md:w-10"
                  src={comment.author.image || "/default-avatar.png"}
                  alt={comment.author.name || "User"}
                />
              ) : (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-semibold text-white md:h-10 md:w-10 md:text-sm">
                  {comment.author?.name?.[0] || "?"}
                </div>
              )}

              {/* Comment Content */}
              <div className="min-w-0 flex-1">
                <div className="text-sm md:text-base">
                  <span className="mr-2 block font-semibold text-gray-900">
                    {comment.author.name || "Anonymous"}
                  </span>
                  <span className="break-words text-gray-700">
                    {comment.content || ""}
                  </span>
                </div>

                {/* Comment Meta */}
                <div className="mt-1 flex items-center space-x-4 md:mt-2 md:space-x-5">
                  <time
                    className="text-xs text-gray-500 md:text-sm"
                    dateTime={comment.createdAt}
                    title={new Date(comment.createdAt).toLocaleString()}
                  >
                    {getTimeAgo(comment.createdAt || new Date().toISOString())}
                  </time>

                  {/* Delete button for comment author */}
                  {comment.author.id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="block text-xs font-medium text-gray-500 transition-opacity hover:text-red-500 md:block md:hidden md:text-sm md:opacity-0 md:group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Show More/Less Button */}
          {hasMoreComments && showAllComments && (
            <button
              onClick={() => setShowAllComments(false)}
              className="ml-11 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-14 md:text-base"
            >
              Show less
            </button>
          )}
        </div>
      ) : (
        <div className="py-4 text-center md:py-6">
          <p className="text-sm text-gray-500 md:text-base">No comments yet.</p>
          <p className="mt-1 text-xs text-gray-400 md:text-sm">
            Be the first to comment!
          </p>
        </div>
      )}

      {/* Comment Form */}
      <div className="mt-6 border-t border-gray-200 pt-4 md:mt-8 md:pt-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* User Avatar beside comment form */}
          {currentUserId && session?.user?.image ? (
            <img
              className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-gray-100 md:h-10 md:w-10"
              alt="Your profile"
              src={session.user.image}
            />
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-gray-400 to-gray-500 text-xs font-semibold text-white md:h-10 md:w-10 md:text-sm">
              {currentUserId ? session?.user?.name?.[0] || "U" : "?"}
            </div>
          )}
          <div className="flex-1">
            <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      </div>
    </div>
  );
}
