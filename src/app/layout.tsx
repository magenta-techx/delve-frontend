import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

import { Inter, Karma } from 'next/font/google';
import 'swiper/css';

import '@radix-ui/themes/styles.css';

import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import QueryProvider from '@/components/providers/QueryProvider';

import 'swiper/css';
import '@radix-ui/themes/styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const karma = Karma({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-karma',
});

export const metadata: Metadata = {
  title: {
    default: 'Delve',
    template: '%s | Delve',
  },
  description:
    'Discover businesses and services with Delve.ng - your gateway to trusted local enterprises.',
  keywords: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'App Router'],
  // authors: [{ name: 'Your Name' }],
  creator: 'Oni Khalid',
  metadataBase: new URL('https://your-domain.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Delve.ng',
    description:
      'Discover businesses and services with Delve.ng - your gateway to trusted local enterprises.',
    siteName: 'Delve.ng',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delve.ng',
    description:
      'Discover businesses and services with Delve.ng - your gateway to trusted local enterprises.',
    creator: '@onikhalidayo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  return (
    <html lang='en'>
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env['GOOGLE_API_KEY'] || ""}`}
        ></script>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          inter.className,
          karma.variable
        )}
      >
        <SessionProviderWrapper session={session}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
