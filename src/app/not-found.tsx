import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export default function NotFound(): JSX.Element {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='text-center'>
        <h1 className='mb-4 text-6xl font-bold text-muted-foreground'>404</h1>
        <h2 className='mb-4 text-2xl font-semibold'>Page Not Found</h2>
        <p className='mb-8 text-muted-foreground'>
          The page you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href='/'>
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
