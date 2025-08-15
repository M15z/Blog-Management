"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Comment } from "./CommentsListing";

interface CommentFormProps {
  blogId: string; // Changed from String to lowercase string
  onCommentAdded: (newComment: Comment) => void; // Added proper typing
}

export default function CommentForm({
  blogId,
  onCommentAdded,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("authorId", userId ?? "");

    try {
      const response = await fetch(`/api/blogs/${blogId}/comment`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newComment = await response.json();
        setComment("");
        // Make sure newComment has the expected structure
        console.log("New comment:", newComment);
        onCommentAdded(newComment);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="mb-2 text-lg font-medium">Add a Comment</h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-md border p-2"
        rows={3}
        placeholder="Write your comment..."
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
