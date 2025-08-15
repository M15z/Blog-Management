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
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div id="comments" className="space-y-4 md:space-y-6">
      {/* Comments Header */}
      {!isLoading && comments.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm md:text-base font-semibold text-gray-900">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
          {hasMoreComments && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm md:text-base text-gray-500 hover:text-gray-700 font-medium"
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
            <div key={i} className="flex items-start space-x-3 md:space-x-4 animate-pulse">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-8 md:w-10"></div>
                </div>
                <div className="h-4 md:h-5 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {displayedComments.map((comment, index) => (
            <div
              key={`comment-${comment.id || index}`}
              className="flex items-start space-x-3 md:space-x-4 group"
            >
              {/* Avatar */}
              {comment.author.image ? (
                <img
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full flex-shrink-0"
                  src={comment.author.image || "/default-avatar.png"}
                  alt={comment.author.name || "User"}
                />
              ) : (
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0">
                  {comment.author?.name?.[0] || "?"}
                </div>
              )}
              
              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-base">
                  <span className="font-semibold text-gray-900 mr-2">
                    {comment.author.name || "Anonymous"}
                  </span>
                  <span className="text-gray-700 break-words">
                    {comment.content || ""}
                  </span>
                </div>
                
                {/* Comment Meta */}
                <div className="flex items-center space-x-4 md:space-x-5 mt-1 md:mt-2">
                  <time 
                    className="text-xs md:text-sm text-gray-500"
                    dateTime={comment.createdAt}
                    title={new Date(comment.createdAt).toLocaleString()}
                  >
                    {getTimeAgo(comment.createdAt || new Date().toISOString())}
                  </time>
                  
                  {/* Delete button for comment author */}
                  {comment.author.id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs md:text-sm text-gray-500 hover:text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
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
              className="text-sm md:text-base text-gray-500 hover:text-gray-700 font-medium ml-11 md:ml-14"
            >
              Show less
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-4 md:py-6">
          <p className="text-sm md:text-base text-gray-500">No comments yet.</p>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Be the first to comment!</p>
        </div>
      )}

      {/* Comment Form */}
      <div className="border-t border-gray-200 pt-4 md:pt-6 mt-6 md:mt-8">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* User Avatar beside comment form */}
          {currentUserId && session?.user?.image ? (
            <img 
              className="h-8 w-8 md:h-10 md:w-10 rounded-full flex-shrink-0 object-cover ring-2 ring-gray-100" 
              alt="Your profile" 
              src={session.user.image} 
            />
          ) : (
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0">
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