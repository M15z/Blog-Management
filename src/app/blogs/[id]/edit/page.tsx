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
    { id: "histroy", name: "Histroy" },
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
    formData.append("category", category); // Add category to form data
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
      // 🖼️ create a temporary preview URL
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  console.log(JSON.stringify(session, null, 2));

  if (loading) {
    return <div className="flex justify-center p-12">Loading blog data...</div>;
  }

  return (
    <form className="mt-20 px-50" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="mb-5 text-3xl font-semibold text-gray-900">
            Edit Blog
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-900"
              >
                Content
              </label>
              <div className="mt-2">
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="sm:col-span-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900"
              >
                Category
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
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
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-900"
              >
                Cover Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="flex justify-center text-center">
                    {/* ✅ Show image preview if available */}
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-[50%] rounded-lg object-cover"
                      />
                    ) : (
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto h-12 w-12 text-gray-300"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex justify-center text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                    >
                      <span>
                        {uploading ? "Uploading..." : "Upload an Image"}
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href={`/blogs/${id}`}>
          <button type="button" className="text-sm font-semibold text-gray-900">
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={uploading || !category} // Disable submit if no category selected
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}
