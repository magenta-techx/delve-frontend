'use client';

import UpComingEvents from '@/components/UpComingEvents';
import BlogCards from '@/app/(clients)/misc/components/BlogsCard';
import Image from 'next/image';
import type { JSX } from 'react';
import { LandingPageNavbar } from '../../misc/components';
import { useAllBlogs } from '../../misc/api';
import { LogoLoadingIcon } from '@/assets/icons';
import type { BlogDetails } from '@/types/api';
import { BlogShare } from './BlogShare';

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

interface BlogDetailsClientProps {
  blog: BlogDetails;
}

const BlogDetailsClient = ({ blog }: BlogDetailsClientProps): JSX.Element => {
  const { data, isLoading, isError } = useAllBlogs();
  const blogs = data?.data ?? [];
  const blogEntries = blogs.map((blogItem, index) => ({
    blog: blogItem,
    originalIndex: index,
  }));

  const publishedDate = formatDateLabel(blog?.created_at);
  const categoryName =
    typeof blog?.category === 'string' ? blog?.category : blog?.category?.name;

  const relatedBlogs =
    blogEntries.length > 1 ? blogEntries.slice(0, 4) : blogEntries;

  // Helper to get blog URL
  const getBlogUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://delve.ng/blog/${blog.id}`;
  };

  if (isLoading) {
    return (
      <div className='flex justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  if (isError) {
    return (
      <p className='text-sm text-red-500 sm:text-base'>
        We couldn&apos;t load related blog posts. Please try again shortly.
      </p>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center bg-white'>
      <LandingPageNavbar />

      <div className='relative flex w-full flex-col px-4 md:px-16 md:backdrop-blur-lg lg:px-24 lg:py-16'>
        <header className='container mx-auto flex items-center justify-between gap-3 max-lg:flex-col'>
          <h1 className='mb-4 text-2xl font-semibold text-[#111827] sm:text-3xl xl:text-4xl'>
            {blog.title}
          </h1>
          <p className='text-sm text-[#475467] sm:text-base'>
            By Delve Editorial
          </p>
        </header>
        <div className='container mx-auto grid-cols-[1fr_minmax(auto,380px)] gap-12 xl:grid'>
          <section className='flex flex-col gap-10'>
            <div className='relative h-[280px] w-full overflow-hidden rounded-xl sm:h-[620px]'>
              <Image
                src={blog.thumbnail || '/blog/blog-image.jpg'}
                alt={blog.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 1160px'
                priority
              />
            </div>

            <div className='max-w-4xl flex-1 text-base leading-7 text-[#374151]'>
              <div
                className='blog-content flex flex-col gap-6'
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </section>
          <section className='space-y-6'>
            <aside className='flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#E4E7EC] bg-white p-6 text-center text-sm text-[#475467]'>
              <h2 className='mb-2 font-inter text-[0.9rem] font-bold text-[#101828]'>
                Introduction
              </h2>
              <div className='relative aspect-[5/4] w-full overflow-hidden rounded-md'>
                <Image
                  src={blog.thumbnail || '/blog/blog-image.jpg'}
                  alt={blog.title}
                  objectFit='cover'
                  fill
                />
              </div>
              <p>{getExcerpt(blog.content) || 'No introduction available.'}</p>
            </aside>
            <aside className='flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#E4E7EC] bg-white p-6 text-center text-sm text-[#475467]'>
              <h2 className='mb-2 font-inter text-[0.9rem] font-bold text-[#101828]'>
                Label & Key words{' '}
              </h2>
              <div className='flex flex-col items-center justify-center gap-2'>
                {blog.labels.map(tag => (
                  <span
                    key={tag}
                    className='mb-2 mr-2 inline-block rounded-full bg-[#F2F4F7] px-3 py-1 text-xs font-medium text-[#475467]'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </aside>
            <aside className='w-full bg-white text-sm text-[#475467]'>
              <div className='mb-4 border-b border-[#E4E7EC] pb-4'>
                <h2 className='mb-2 font-inter text-xs font-bold tracking-[0.08em] text-[#101828]'>
                  (PUBLISHED)
                </h2>
                <p>{publishedDate || 'TBD'}</p>
              </div>
              <div className='mb-4 border-b border-[#E4E7EC] pb-4'>
                <h2 className='mb-2 font-inter text-xs font-bold tracking-[0.08em] text-[#101828]'>
                  (CATEGORY)
                </h2>
                <p>{categoryName || 'Uncategorized'}</p>
              </div>

              {/* Replace the old share section with the new BlogShare component */}
              <BlogShare
                blogTitle={blog.title}
                blogExcerpt={getExcerpt(blog.content, 200)}
                blogUrl={getBlogUrl()}
                blogImage={blog.thumbnail}
              />
            </aside>
          </section>
        </div>

        <section className='container mx-auto mt-24'>
          <h2 className='mb-2 font-karma text-2xl font-semibold text-[#111827] sm:text-3xl xl:text-4xl'>
            Tips, Trends & Vendor Stories
          </h2>
          {blogs.length === 0 && (
            <p className='text-sm text-[#475467] sm:text-base'>
              Browse other stories once they become available.
            </p>
          )}
          {blogs.length > 0 && (
            <div
              className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:auto-cols-auto'
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              }}
            >
              {relatedBlogs.map(({ blog: relatedBlog, originalIndex }) => (
                <BlogCards
                  key={relatedBlog.id ?? relatedBlog.title ?? originalIndex}
                  imageUrl={relatedBlog.thumbnail}
                  header={relatedBlog.title}
                  description={relatedBlog.excerpt}
                  dateLabel={formatDateLabel(relatedBlog.created_at)}
                  href={`/blog/${relatedBlog.id ?? originalIndex}`}
                  containerClassStyle='w-full'
                  imageClassStyle='h-[220px] w-full'
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className='w-full'>
        <UpComingEvents />
      </div>
    </main>
  );
};

export default BlogDetailsClient;
