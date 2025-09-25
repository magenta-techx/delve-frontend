import SearchGroup from '@/components/landing-page/SearchGroup';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Delve Landing page',
};



export default function HomePage(): JSX.Element {
  return (
    <main className='flex flex-col relative items-center'>

      <div className='bg-[url("/landingpage/landing-page-hero-image.jpg")] w-screen bg-no-repeat h-[100vh] bg-contain relative flex flex-col items-center'>
        <div className='insert-0 absolute h-[89.6vh] w-full bg-black/70'></div>
        <Navbar type='' authFormButtons={false} />

        <div className='absolute h-full flex flex-col items-center top-[27.8rem] w-full'>
          <h1 className='text-[54px] font-karma font-bold text-white'>Great experiences start here.</h1>
          <p className='text-white text-[19px] -mt-2 font-inter'>Delve helps you find reliable vendors who turn plans into beautiful memories.</p>
          <div className='mt-16'>
            <SearchGroup />
          </div>
        </div>
      </div>
    </main>
  );
}
