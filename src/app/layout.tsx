import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Next.js 15 TypeScript Boilerplate',
    template: '%s | Next.js 15 TypeScript Boilerplate',
  },
  description: 'A strict TypeScript Next.js 15 boilerplate with App Router and best practices',
  keywords: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'App Router'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL('https://your-domain.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Next.js 15 TypeScript Boilerplate',
    description: 'A strict TypeScript Next.js 15 boilerplate with App Router and best practices',
    siteName: 'Next.js 15 TypeScript Boilerplate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js 15 TypeScript Boilerplate',
    description: 'A strict TypeScript Next.js 15 boilerplate with App Router and best practices',
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

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang='en' className={inter.variable}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        {children}
      </body>
    </html>
  );
}
