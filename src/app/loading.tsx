'use client';

import { LogoLoadingIcon } from '@/assets/icons';

export default function Loading(): JSX.Element {
  return (
    <div className='flex min-h-svh items-center justify-center'>
      <LogoLoadingIcon />
    </div>
  );
}
