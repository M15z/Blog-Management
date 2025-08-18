"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function EditPost() {
  const params = useParams();
  const id = params?.id as string;
  console.log("||||||||||||||||||||||||||||||||||||||");
  console.log(id);
  console.log("||||||||||||||||||||||||||||||||||||||");
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      console.log("||||||||||||||||||||||||||||||||||||||");
      console.log("||||||||||||||| INSIDE USE EFFICT |||||||||||||||||||||||");
      console.log("||||||||||||||||||||||||||||||||||||||");
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${id}`);

        if (response.ok) {
          const blog = await response.json();

          // Set form fields with blog data
          setTitle(blog.title);
          setContent(blog.content);
          setCategory(blog.category);

          // Set preview URL if image exists
          if (blog.image) {
            setPreviewUrl(blog.image);
          }
        } else {
          console.error("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Category options (fixed typo: "histroy" -> "history")
  const categories = [
    { id: "technology", name: "Technology" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "travel", name: "Travel" },
    { id: "food", name: "Food & Cooking" },
    { id: "health", name: "Health & Fitness" },
    { id: "business", name: "Business" },
    { id: "education", name: "Education" },
    { id: "entertainment", name: "Entertainment" },
    { id: "history", name: "History" },
    { id: "other", name: "Other" },
  ];

  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("authorId", userId);

    try {
      const result = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (result.ok) {
        console.log("Blog updated successfully");
        router.push(`/blogs/${id}`); // Redirect to view the edited blog
      } else {
        const error = await result.json();
        alert(`Failed to update blog: ${error.message}`);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  console.log(JSON.stringify(session, null, 2));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <form className="bg-white rounded-lg shadow-sm p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="space-y-8 sm:space-y-12">
            <div className="border-b border-gray-900/10 pb-8 sm:pb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Edit Blog Post
              </h2>

              <div className="space-y-6 sm:space-y-8">
                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-base font-medium text-gray-900 mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors sm:text-lg"
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-base font-medium text-gray-900 mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={6}
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors resize-vertical sm:text-lg"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-base font-medium text-gray-900 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors sm:text-lg"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cover Photo Upload */}
                <div>
                  <label className="block text-base font-medium text-gray-900 mb-2">
                    Cover Photo
                  </label>
                  <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 sm:px-6 sm:py-10 hover:border-gray-400 transition-colors">
                    <div className="text-center max-w-xs sm:max-w-sm">
                      <div className="flex justify-center mb-4">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full max-w-[200px] sm:max-w-[250px] rounded-lg object-cover shadow-sm"
                          />
                        ) : (
                          <PhotoIcon
                            aria-hidden="true"
                            className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                          />
                        )}
                      </div>
                      <div className="flex justify-center text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500 px-2 py-1"
                        >
                          <span>
                            {uploading ? "Uploading..." : previewUrl ? "Change Image" : "Upload an Image"}
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Image Info */}
                {previewUrl && !file && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Current image:</span> This is the existing cover photo for your blog post. Upload a new image to replace it.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6 pt-6">
            <Link href={`/blogs/${id}`}>
              <button 
                type="button" 
                className="w-full sm:w-auto px-4 py-2 text-base font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={uploading || !category || !title.trim() || !content.trim()}
              className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}