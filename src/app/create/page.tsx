"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function CreatePost() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Category options
  const categories = [
    { id: "technology", name: "Technology" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "travel", name: "Travel" },
    { id: "food", name: "Food & Cooking" },
    { id: "health", name: "Health & Fitness" },
    { id: "business", name: "Business" },
    { id: "education", name: "Education" },
    { id: "entertainment", name: "Entertainment" },
    { id: "history", name: "History" }, // Fixed typo: "histroy" -> "history"
    { id: "other", name: "Other" },
  ];

  const router = useRouter();
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !userId) {
      alert("Missing file or not authenticated.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("authorId", userId);

    try {
      const result = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();
      console.log(data.message);
      router.push("/");
    } catch (error) {
      console.error("Upload failed", error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <form className="bg-white rounded-lg shadow-sm p-6 sm:p-8" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-8 sm:space-y-12">
            <div className="border-b border-gray-900/10 pb-8 sm:pb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Create Blog
              </h2>

              <div className="space-y-6 sm:space-y-8">
                {/* Title Field */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-900 mb-2"
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
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors sm:text-sm"
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-900 mb-2"
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
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors resize-vertical sm:text-sm"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors sm:text-sm"
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6 pt-6">
            <button 
              type="button" 
              className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !category || !title.trim() || !content.trim() || !file}
              className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}