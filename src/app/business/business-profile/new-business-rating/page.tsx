import BusinessNewBusinessRating from "@/components/business/business-profile/BusinessNewBusinessRating";

export default function Page(): JSX.Element {
  return (
    <main className='relative flex flex-col items-center overflow-x-hidden h-[100vh] justify-center bg-[#FCFCFD]'>
      {/* <div className='relative flex sm:h-[83.5vh] h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'> */}
      {/* New Navbar component  */}
      {/* <div className='sm:hidden flex'> */}
      {/* <NavbarLandingPage /> */}
      {/* </div>  */}
      {/* </div> */}

      <BusinessNewBusinessRating />
    </main>
  );
}
