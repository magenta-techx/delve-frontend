import { BaseIcons } from '@/assets/icons/base/Icons';
import ProfileSettings from '@/components/business/Profile/ProfileSettings';
export default function Page(): JSX.Element {
  return (
    <main className='relative flex flex-col items-center overflow-x-hidden bg-[#FCFCFD]'>
      {/* <div className='relative flex sm:h-[83.5vh] h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'> */}
      {/* New Navbar component  */}
      {/* <div className='sm:hidden flex'> */}
      {/* <NavbarLandingPage /> */}
      {/* </div>  */}
      {/* </div> */}

      <div className='sm:w-[1540px]'>
        <div className='z-10 mt-20'>
          <div className='mb-4 flex w-full items-center justify-between'>
            <h1 className='flex items-center gap-3 font-inter text-[25px] font-semibold'>
              <BaseIcons value='user-logged-in-black' />
              <p>Profile Settings</p>
            </h1>
          </div>
        </div>

        <ProfileSettings />
      </div>
    </main>
  );
}
