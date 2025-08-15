"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";

interface LikeButtonProps {
  blogId: string;
  initialLikeCount?: number;
  initialUserLiked?: boolean;
}

const LikeButton = ({
  blogId,
  initialLikeCount = 0,
  initialUserLiked = false,
}: LikeButtonProps) => {
  const { data: session, status } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [userLiked, setUserLiked] = useState(initialUserLiked);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial like status when component mounts
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}/like`);
        if (response.ok) {
          const data = await response.json();
          setLikeCount(data.likeCount);
          setUserLiked(data.userLiked);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [blogId]);

  const handleLikeClick: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (status !== "authenticated") {
      // If user is not signed in, redirect to sign-in page or show message
      alert("Please sign in to like blogs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Toggle like status locally based on server response
        setUserLiked(data.liked);
        // Update like count (increment or decrement)
        setLikeCount((prevCount) =>
          data.liked ? prevCount + 1 : prevCount - 1,
        );
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading || status === "loading"}
      className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-900 focus:outline-none"
      aria-label={userLiked ? "Unlike" : "Like"}
    >
      {userLiked ? (
        <HeartIcon className="h-6 w-6 text-red-500" />
      ) : (
        <HeartOutlineIcon className="h-6 w-6" />
      )}
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
