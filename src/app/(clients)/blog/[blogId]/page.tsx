import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ApiEnvelope, BlogDetails } from '@/types/api';
import BlogDetailsClient from './BlogDetailsClient';

interface PageProps {
  params: Promise<{ blogId: string }>;
}

// Function to fetch blog details on the server
async function getBlogs(blogId: string): Promise<BlogDetails | null> {
  try {
    const apiUrl =
      process.env['NEXT_PUBLIC_API_BASE_URL'] || 'https://backend.delve.ng';
    console.log('scess compiling url', `${apiUrl}/api/blog/${blogId}`);
    const res = await fetch(`${apiUrl}/api/blog/${blogId}`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data: ApiEnvelope<BlogDetails> = await res.json();
    console.log('fetched blog data:', data);
    return data.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return null;
  }
}

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

// Generate metadata for SEO and Open Graph
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { blogId } = await params;
  const blog = await getBlogs(blogId);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog could not be found.',
    };
  }

  const blogTitle = blog.title;
  const description = getExcerpt(blog.content);
  const image = blog.thumbnail || '/default-og-image.png';

  return {
    title: `${blogTitle} | Delve`,
    description: description.slice(0, 160), // Limit to 160 characters
    openGraph: {
      title: blogTitle,
      description: description.slice(0, 160),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blogTitle,
        },
      ],
      type: 'website',
      siteName: 'Delve',
    },
    twitter: {
      card: 'summary_large_image',
      title: blogTitle,
      description: description.slice(0, 160),
      images: [image],
    },
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { blogId } = await params;
  const blog = await getBlogs(blogId);

  if (!blog) {
    notFound();
  }

  return <BlogDetailsClient blog={blog} />;
}
