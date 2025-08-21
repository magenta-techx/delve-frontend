import type { Metadata } from 'next';
import { Inter, Karma } from 'next/font/google';

import '@/styles/globals.css';
import ToastProvider from '@/components/ToastProvider';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import { getServerSession } from 'next-auth';
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
    default: 'Next.js 15 TypeScript Boilerplate',
    template: '%s | Next.js 15 TypeScript Boilerplate',
  },
  description:
    'A strict TypeScript Next.js 15 boilerplate with App Router and best practices',
  keywords: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'App Router'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL('https://your-domain.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Next.js 15 TypeScript Boilerplate',
    description:
      'A strict TypeScript Next.js 15 boilerplate with App Router and best practices',
    siteName: 'Next.js 15 TypeScript Boilerplate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js 15 TypeScript Boilerplate',
    description:
      'A strict TypeScript Next.js 15 boilerplate with App Router and best practices',
    creator: '@yourusername',
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
  const session = await getServerSession();
  return (
    <html lang='en' className={`${inter.variable} ${karma.variable}`}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <SessionProviderWrapper session={session}>
          {children}
          <ToastProvider />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
