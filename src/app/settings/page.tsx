"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );

  // Fetch current user data
  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
      if (session.user.image) {
        setProfileImagePreview(session.user.image);
      }
    }
  }, [session]);

  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "authenticated") {
      alert("You must be signed in to update your profile");
      return;
    }

    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("username", username);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // Update profile in the database
      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const data = await response.json();

      // Update the session with the complete user object
      if (data.user) {
        // This is critical - use the complete structure with all required fields
        await update({
          user: data.user,
        });

        // After updating the session, force a page reload
        alert(
          "Profile updated successfully! Please wait while your changes are applied.",
        );
        window.location.href = window.location.pathname;
      } else {
        alert("Profile updated successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state or not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <form className="bg-white rounded-lg shadow-sm p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="space-y-8 sm:space-y-12">
            <div className="border-b border-gray-900/10 pb-8 sm:pb-12">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Profile Settings
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Username Field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-base sm:text-lg font-medium text-gray-900 mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-3 text-base text-gray-900 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-colors placeholder:text-gray-400 sm:text-lg"
                    />
                  </div>
                </div>

                {/* Profile Photo Field */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-gray-900 mb-4">
                    Profile Photo
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    {/* Profile Image Preview */}
                    <div className="flex-shrink-0">
                      {profileImagePreview ? (
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full ring-4 ring-white shadow-lg">
                          <Image
                            src={profileImagePreview}
                            alt="Profile preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <UserCircleIcon
                          aria-hidden="true"
                          className="h-20 w-20 sm:h-24 sm:w-24 text-gray-300"
                        />
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="profile-image-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors"
                      >
                        {profileImagePreview ? "Change Photo" : "Upload Photo"}
                        <input
                          id="profile-image-upload"
                          name="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-sm text-gray-500">
                        JPG, PNG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Session Info */}
                {session?.user && (
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                      Current Account Info
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base text-gray-600">
                        <span className="font-medium">Email:</span> {session.user.email}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        <span className="font-medium">Account ID:</span> {session.user.id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6 pt-6">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-base font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
