// components/BlogsListing.tsx
'use client';

import { useState } from 'react';
import CategoryFilter from '@/components/ui/CategoryFilter';
import BlogCard from '@/components/BlogCard';

// Define types for the blog post
type Author = {
  id: string;
  name: string;
  image?: string | null;
};

type BlogPost = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  category: string;
  createdAt: string; // ISO string format
  author: Author;
  likeCount: number;
};

type BlogListingProps = {
  initialBlogs: BlogPost[];
};

export default function BlogListing({ initialBlogs }: BlogListingProps) {
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(initialBlogs);

  // Get unique categories and their counts
  const categoryCounts: {[key: string]: number} = {};
  initialBlogs.forEach(blog => {
    categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
  });
  
  const uniqueCategories = [...new Set(initialBlogs.map(blog => blog.category))];

  // Function to filter blogs based on selected categories
  const filterBlogs = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredBlogs([]);
    } else {
      setFilteredBlogs(
        initialBlogs.filter(blog => selectedCategories.includes(blog.category))
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="text-center py-4 sm:py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
          Our Blog
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Discover insights, stories, and knowledge from our community
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-4 sm:px-0">
        <CategoryFilter 
          categories={uniqueCategories} 
          categoryCounts={categoryCounts}
          onFilterChange={filterBlogs} 
        />
      </div>

      {/* Blog List */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            content={blog.content}
            image={blog.image}
            category={blog.category}
            createdAt={new Date(blog.createdAt)}
            author={blog.author}
            likeCount={blog.likeCount}
          />
        ))}
      </div>
      
      {filteredBlogs.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="mx-auto max-w-md">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 24c4.21 0 7.813 2.602 9.288 6.286" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg sm:text-xl font-medium mb-2">
              No blog posts found
            </p>
            <p className="text-gray-400 text-sm sm:text-base">
              Try selecting different categories to see more posts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}