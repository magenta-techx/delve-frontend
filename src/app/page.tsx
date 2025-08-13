import type { Metadata } from 'next';
import Link from 'next/link';

import { FeatureCard } from '@/components/FeatureCard';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to the Next.js 15 TypeScript boilerplate with strict TypeScript enforcement',
};

const features = [
  {
    title: 'Next.js 15',
    description: 'Latest Next.js with App Router, Server Components, and modern features.',
    icon: '⚡',
  },
  {
    title: 'Strict TypeScript',
    description: 'Configured with strict TypeScript rules and file extension enforcement.',
    icon: '🔒',
  },
  {
    title: 'Enhanced ESLint',
    description: 'Comprehensive ESLint configuration with best practices and file naming conventions.',
    icon: '🛠️',
  },
  {
    title: 'Tailwind CSS',
    description: 'Pre-configured with Tailwind CSS and custom design system variables.',
    icon: '🎨',
  },
] as const;

export default function HomePage(): JSX.Element {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='z-10 w-full max-w-6xl items-center justify-between text-center'>
        <h1 className='mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent'>
          Next.js 15 TypeScript
        </h1>
        <h2 className='mb-12 text-2xl font-semibold text-muted-foreground'>
          Strict TypeScript Boilerplate with App Router
        </h2>

        <div className='mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

        <div className='flex flex-col items-center gap-4'>
          <Button asChild size='lg'>
            <Link href='/about'>
              Get Started
            </Link>
          </Button>
          <p className='text-sm text-muted-foreground'>
            Built with Next.js 15, TypeScript 5.6, and Tailwind CSS 3.4
          </p>
        </div>
      </div>
    </main>
  );
}
