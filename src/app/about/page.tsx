import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about this Next.js 15 TypeScript boilerplate',
};

export default function AboutPage(): JSX.Element {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-16'>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold'>About This Boilerplate</h1>
          <p className='text-xl text-muted-foreground'>
            A comprehensive Next.js 15 TypeScript boilerplate with strict enforcement
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Features</h2>
            <ul className='space-y-2 text-muted-foreground'>
              <li>✅ Next.js 15 with App Router</li>
              <li>✅ Strict TypeScript configuration</li>
              <li>✅ ESLint with comprehensive rules</li>
              <li>✅ Prettier with Tailwind plugin</li>
              <li>✅ File extension enforcement</li>
              <li>✅ Path mapping with @ prefix</li>
              <li>✅ VSCode integration</li>
              <li>✅ Modern development workflow</li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Tech Stack</h2>
            <ul className='space-y-2 text-muted-foreground'>
              <li><strong>Framework:</strong> Next.js 15</li>
              <li><strong>Language:</strong> TypeScript 5.6</li>
              <li><strong>Styling:</strong> Tailwind CSS 3.4</li>
              <li><strong>Linting:</strong> ESLint 9</li>
              <li><strong>Formatting:</strong> Prettier 3</li>
              <li><strong>Package Manager:</strong> npm</li>
            </ul>
          </div>
        </div>

        <div className='rounded-lg border bg-muted/50 p-6'>
          <h3 className='mb-4 text-xl font-semibold'>Strict TypeScript Enforcement</h3>
          <p className='mb-4 text-muted-foreground'>
            This boilerplate enforces strict TypeScript usage by:
          </p>
          <ul className='space-y-2 text-sm text-muted-foreground'>
            <li>• Blocking creation of .js and .jsx files via ESLint</li>
            <li>• Requiring explicit function return types</li>
            <li>• Preventing use of &apos;any&apos; types</li>
            <li>• Enforcing consistent file naming conventions</li>
            <li>• Enabling all strict TypeScript compiler options</li>
          </ul>
        </div>

        <div className='text-center'>
          <Button asChild>
            <Link href='/'>
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
