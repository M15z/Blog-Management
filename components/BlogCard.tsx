// components/BlogCard.tsx
'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import LikeButton from '@/components/ui/LikeButton';
import { useState, useEffect } from 'react';

type Author = {
  id: string;
  name: string;
  image?: string | null;
};

type BlogCardProps = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  category: string;
  createdAt: Date;
  author: Author;
  likeCount: number;
};

export default function BlogCard({
  id,
  title,
  content,
  image,
  category,
  createdAt,
  author,
  likeCount,
}: BlogCardProps) {
  // State for client-side date formatting to prevent hydration mismatch
  const [formattedDate, setFormattedDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFormattedDate(format(new Date(createdAt), 'MMM d, yyyy'));
  }, [createdAt]);

  // Responsive content truncation
  const truncatedContent = content.length > 300 ? content.substring(0, 300) + '...' : content;

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-2/5 relative">
          {image ? (
            <div className="h-56 sm:h-64 lg:h-full lg:min-h-[400px] relative overflow-hidden">
              <Image
                src={image}
                alt={`Cover image for ${title}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          ) : (
            <div className="h-56 sm:h-64 lg:h-full lg:min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="mx-auto h-10 w-10 sm:h-14 sm:w-14 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-base font-medium">No image</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
            <time className="text-base text-gray-500 font-medium" dateTime={isClient ? createdAt.toISOString() : ''}>
              {formattedDate || 'Loading...'}
            </time>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 w-fit">
              {category}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 mb-6">
            <Link href={`/blogs/${id}`} className="group">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2 mb-3 sm:mb-4">
                {title}
              </h2>
            </Link>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3 sm:line-clamp-4">
              {truncatedContent}
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link 
                href={`/blogs/${id}`} 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-base transition-colors duration-200"
              >
                Read more
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <LikeButton blogId={id} initialLikes={likeCount} />
            </div>

            {/* Author */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={`${author.name}'s avatar`}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-base">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="ml-2 text-base font-medium text-gray-700">
                {author.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}