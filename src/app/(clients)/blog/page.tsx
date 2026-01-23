'use client';

import UpComingEvents from '@/components/UpComingEvents';
import BlogCards from '@/app/(clients)/misc/components/BlogsCard';
import type { JSX } from 'react';
import { LandingPageNavbar } from '../misc/components';
import { useAllBlogs } from '../misc/api';

const getOrdinal = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  const remainder = day % 10;
  if (remainder === 1) return 'st';
  if (remainder === 2) return 'nd';
  if (remainder === 3) return 'rd';
  return 'th';
};

const formatDateLabel = (dateValue?: string): string => {
  if (!dateValue) return '';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  const day = parsed.getDate();
  const month = parsed.toLocaleString('en-US', { month: 'long' });
  const year = parsed.getFullYear();
  return `${day}${getOrdinal(day)} ${month}, ${year}`;
};

export const getExcerpt = (html?: string, maxLength = 140): string => {
  if (!html) return '';
  const decoded = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (decoded.length <= maxLength) return decoded;
  return `${decoded.slice(0, maxLength).trimEnd()}…`;
};

const BlogPage = (): JSX.Element => {
  const { data, isLoading, isError } = useAllBlogs();
  const blogs = data?.data ?? [];

  const renderBlogGrid = (): JSX.Element => {
    if (isLoading) {
      return (
        <p className='text-center text-sm text-[#475467] sm:text-base'>
          Loading blogs…
        </p>
      );
    }

    if (isError) {
      return (
        <p className='text-center text-sm text-red-500 sm:text-base'>
          We couldn’t load blog posts. Please try again shortly.
        </p>
      );
    }

    if (!blogs.length) {
      return (
        <p className='text-center text-sm text-[#475467] sm:text-base'>
          No blog posts available yet. Check back soon.
        </p>
      );
    }


    
    return (
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:auto-cols-auto"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
      >
        {blogs.map((blog, index) => {
          const dateLabel = formatDateLabel(blog.created_at);
          const href = `/blog/${blog.id ?? index + 1}`;

          return (
            <BlogCards
              key={blog.id ?? blog.title ?? index}
              imageUrl={blog.thumbnail}
              header={blog.title}
              description={blog.excerpt}
              dateLabel={dateLabel}
              href={href}
              containerClassStyle='w-full'
              imageClassStyle='h-[220px] w-full'
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className='flex min-h-screen flex-col items-center bg-white'>
      <LandingPageNavbar />

      <div className='relative flex flex-col w-full px-4 md:px-16 md:backdrop-blur-lg lg:py-16 lg:px-24'>
        <section className='container mx-auto'>
          <header className='mb-12 max-w-[720px]'>
            <h1 className='mb-2 font-karma text-2xl font-semibold text-[#111827] sm:text-3xl xl:text-4xl'>
              Tips, Trends & Vendor Stories
            </h1>
            <p className='font-inter text-sm text-[#475467] sm:text-base'>
              Explore expert tips, trending event ideas, beauty routines, and
              vendor success stories all curated for you.
            </p>
          </header>

          {renderBlogGrid()}
        </section>
      </div>

      <div className='w-full'>
        <UpComingEvents />
      </div>
    </div>
  );
};

export default BlogPage;
