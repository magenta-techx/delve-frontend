import SearchGroup from '@/components/landing-page/SearchGroup';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Delve Landing page',
};

export default function HomePage(): JSX.Element {
  return (
    <main className='relative flex flex-col items-center'>
      <div className='relative flex h-[100vh] w-screen flex-col items-center bg-[url("/landingpage/landing-page-hero-image.jpg")] bg-contain bg-no-repeat'>
        <div className='insert-0 absolute h-[89.6vh] w-full bg-black/70'></div>
        <Navbar type='' authFormButtons={false} />

        <div className='absolute top-[27.8rem] flex h-full w-full flex-col items-center'>
          <h1 className='font-karma text-[54px] font-bold text-white'>
            Great experiences start here.
          </h1>
          <p className='-mt-2 font-inter text-[19px] text-white'>
            Delve helps you find reliable vendors who turn plans into beautiful
            memories.
          </p>
          <div className='mt-16'>
            <SearchGroup />
          </div>
        </div>
      </div>
    </main>
  );
}
