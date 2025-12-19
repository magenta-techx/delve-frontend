"use client";

import { BaseIcons, type IconsType } from '@/assets/icons/base/Icons';
import UpComingEvents from '@/components/UpComingEvents';
import BlogCards from '@/components/cards/BlogsCard';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { LandingPageNavbar } from '../../misc/components';
import { useAllBlogs } from '../../misc/api';

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

const shareLinks: Array<{ icon: IconsType; label: string }> = [
	{ icon: 'facebook-outlined-black', label: 'Share on Facebook' },
	{ icon: 'linkedin-outlined-black', label: 'Share on LinkedIn' },
	{ icon: 'whatsapp-outlined-black', label: 'Share on WhatsApp' },
	{ icon: 'telegram-outlined-black', label: 'Share on Telegram' },
	{ icon: 'x-outlined-black', label: 'Share on X' },
];

const BlogDetailPage = (): JSX.Element => {
	const { data, isLoading, isError } = useAllBlogs();
	const blogs = data?.data ?? [];
	const blogEntries = blogs.map((blog, index) => ({ blog, originalIndex: index }));
	const featuredBlog = blogEntries[0]?.blog;
	const publishedDate = formatDateLabel(featuredBlog?.created_at);
	const categoryName =
		typeof featuredBlog?.category === 'string'
			? featuredBlog?.category
			: featuredBlog?.category?.name;

	const relatedBlogs =
		blogEntries.length > 1
			? blogEntries.slice(1, 5)
			: blogEntries.slice(0, 4);

	return (
		<main className='flex min-h-screen flex-col items-center bg-white'>
			<LandingPageNavbar />

			<section className='flex w-full justify-center px-4 py-12 sm:px-12 sm:py-20'>
				<div className='w-full max-w-[1160px]'>
					{isLoading && (
						<p className='text-sm text-[#475467] sm:text-base'>Loading blog…</p>
					)}

					{isError && (
						<p className='text-sm text-red-500 sm:text-base'>
							We couldn’t load this blog post. Please try again shortly.
						</p>
					)}

					{!isLoading && !isError && !featuredBlog && (
						<p className='text-sm text-[#475467] sm:text-base'>
							No blog post available yet.
						</p>
					)}

					{featuredBlog && (
						<article className='flex flex-col gap-10'>
							<header className='flex flex-col gap-3'>
								<h1 className='font-karma text-[32px] font-semibold text-[#111827] sm:text-[48px]'>
									{featuredBlog.title}
								</h1>
								<p className='text-sm text-[#475467] sm:text-base'>By Delve Editorial</p>
							</header>

							<div className='relative h-[280px] w-full overflow-hidden rounded-3xl sm:h-[620px]'>
								<Image
									src={featuredBlog.thumbnail || '/blog/blog-image.jpg'}
									alt={featuredBlog.title}
									fill
									className='object-cover'
									sizes='(max-width: 768px) 100vw, 1160px'
									priority
								/>
							</div>

							<div className='flex flex-col gap-12 lg:flex-row lg:items-start'>
								<div className='flex-1 text-base leading-7 text-[#374151]'>
									<div
										className='blog-content flex flex-col gap-6'
										dangerouslySetInnerHTML={{ __html: featuredBlog.content }}
									/>
								</div>

								<aside className='w-full max-w-[280px] rounded-2xl border border-[#E4E7EC] bg-white p-6 text-sm text-[#475467]'>
									<div className='mb-6 border-b border-[#E4E7EC] pb-6'>
										<h2 className='mb-2 text-xs font-semibold tracking-[0.08em] text-[#101828]'>
											(PUBLISHED)
										</h2>
										<p>{publishedDate || 'TBD'}</p>
									</div>
									<div className='mb-6 border-b border-[#E4E7EC] pb-6'>
										<h2 className='mb-2 text-xs font-semibold tracking-[0.08em] text-[#101828]'>
											(CATEGORY)
										</h2>
										<p>{categoryName || 'Uncategorized'}</p>
									</div>
									<div className='flex flex-col gap-3'>
										<p className='text-xs font-semibold uppercase tracking-[0.08em] text-[#101828]'>
											Share
										</p>
										<div className='flex items-center gap-3'>
											{shareLinks.map(item => (
												<Link
													key={item.icon}
													href={'#'}
													aria-label={item.label}
													className='flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E7EC] transition hover:border-[#101828] hover:text-[#101828]'
												>
													<BaseIcons value={item.icon} />
												</Link>
											))}
										</div>
									</div>
								</aside>
							</div>
						</article>
					)}
				</div>
			</section>

			<section className='w-full max-w-[1440px] px-4 pb-12 sm:px-12 sm:pb-20'>
				<h2 className='mb-8 font-inter text-[28px] font-semibold text-[#111827] sm:text-[36px]'>
					Tips, Trends & Vendor Stories
				</h2>
				{blogs.length === 0 && (
					<p className='text-sm text-[#475467] sm:text-base'>
						Browse other stories once they become available.
					</p>
				)}
				{blogs.length > 0 && (
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{relatedBlogs.map(({ blog, originalIndex }) => (
							<BlogCards
								key={blog.id ?? blog.title ?? originalIndex}
								imageUrl={blog.thumbnail}
								header={blog.title}
								description={getExcerpt(blog.content)}
								dateLabel={formatDateLabel(blog.created_at)}
								href={`/blog/${blog.id ?? originalIndex}`}
								containerClassStyle='w-full'
								imageClassStyle='h-[220px] w-full'
							/>
						))}
					</div>
				)}
			</section>

			<div className='w-full'>
				<UpComingEvents />
			</div>
		</main>
	);
};

export default BlogDetailPage;
