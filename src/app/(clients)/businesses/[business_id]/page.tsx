import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BusinessDetailsClient from './BusinessDetailsClient';
import type { ApiEnvelope, BusinessDetail } from '@/types/api';

interface PageProps {
  params: Promise<{ business_id: string }>;
}

// Function to fetch business details on the server
async function getBusinessDetails(
  businessId: string
): Promise<BusinessDetail | null> {
  try {
    const apiUrl =
      process.env['NEXT_PUBLIC_API_BASE_URL'] || 'https://backend.delve.ng';

    const res = await fetch(`${apiUrl}/api/businesses/${businessId}`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data: ApiEnvelope<BusinessDetail> = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching business details:', error);
    return null;
  }
}

// Generate metadata for SEO and Open Graph
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { business_id } = await params;
  const business = await getBusinessDetails(business_id);

  if (!business) {
    return {
      title: 'Business Not Found',
      description: 'The requested business could not be found.',
    };
  }

  const businessName = business.name;
  const description =
    business.description ||
    `Discover ${businessName} - ${business.category?.name || 'Business'} in ${business.state || 'Nigeria'}`;
  const image = business.logo || business.thumbnail || '/default-og-image.png';

  return {
    title: `${businessName}`,
    description: description.slice(0, 160),
    openGraph: {
      title: businessName,
      description: description.slice(0, 160),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: businessName,
        },
      ],
      type: 'website',
      siteName: 'Delve',
    },
    twitter: {
      card: 'summary_large_image',
      title: businessName,
      description: description.slice(0, 160),
      images: [image],
    },
  };
}

export default async function BusinessDetailsPage({ params }: PageProps) {
  const { business_id } = await params;
  const business = await getBusinessDetails(business_id);

  if (!business) {
    notFound();
  }

  return <BusinessDetailsClient business={business} />;
}
