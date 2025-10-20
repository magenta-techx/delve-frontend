'use client';
import CollaborationPreview from '@/components/business/collaboration/CollaborationPreview';

export default function Page(): JSX.Element {
  return (
    <section className='relative flex flex-col items-center overflow-x-hidden'>
      {/* <div className='relative flex sm:h-[83.5vh] h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'> */}
      {/* New Navbar component  */}
      {/* <div className='sm:hidden flex'> */}
      {/* <NavbarLandingPage /> */}
      {/* </div>  */}
      {/* </div> */}

      <div className='pt-20 sm:h-[866px] sm:w-[1488px]'>
        <CollaborationPreview
          actionBtntext='Exit Group'
          page={'preview'}
          onBtnClick={() => console.log('Exit group')}
        />
      </div>
    </section>
  );
}
