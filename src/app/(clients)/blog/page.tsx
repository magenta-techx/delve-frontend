'use client';

import UpComingEvents from '@/components/UpComingEvents';
import BlogCards from '@/components/cards/BlogsCard';
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

const getExcerpt = (html?: string, maxLength = 140): string => {
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
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {blogs.map((blog, index) => {
          const dateLabel = formatDateLabel(blog.created_at);
          const description = getExcerpt(blog.content);
          const href = `/blog/${blog.id ?? index}`;

          return (
            <BlogCards
              key={blog.id ?? blog.title ?? index}
              imageUrl={blog.thumbnail}
              header={blog.title}
              description={description}
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
    <main className='flex min-h-screen flex-col items-center bg-white'>
      <LandingPageNavbar />

      <section className='w-full max-w-[1440px] px-4 py-12 sm:px-12 sm:py-20'>
        <header className='mb-12 max-w-[720px]'>
          <h1 className='mb-4 font-karma text-[28px] font-semibold text-[#111827] sm:text-[48px]'>
            Tips, Trends & Vendor Stories
          </h1>
          <p className='font-inter text-sm text-[#475467] sm:text-lg'>
            Explore expert tips, trending event ideas, beauty routines, and vendor success stories all curated for you.
          </p>
        </header>

        {renderBlogGrid()}
      </section>

      <div className='w-full'>
        <UpComingEvents />
      </div>
    </main>
  );
};

export default BlogPage;