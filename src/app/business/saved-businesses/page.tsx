'use client'
import { BaseIcons } from "@/assets/icons/base/Icons";
import { ExploreBaseIcons } from "@/assets/icons/explore/Icons";
import BusinessFooter from "@/components/business/BusinessFooter";
import FeaturedListingCard from "@/components/cards/FeaturedListingCard";
import SearchGroup from "@/components/landing-page/savedBusinesses/SearchGroup";
import { useRouter } from "next/navigation";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Page(): JSX.Element {

  const router = useRouter()
  const LISTINGS_AROUND = [
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
  ];
  return (
    <main className='relative flex flex-col items-center overflow-x-hidden'>
      {/* <div className='relative flex sm:h-[83.5vh] h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'> */}
      {/* New Navbar component  */}
      {/* <div className='sm:hidden flex'> */}
      {/* <NavbarLandingPage /> */}
      {/* </div>  */}
      {/* </div> */}


      {/* Search  */}
      <div className="sm:w-[1540px] mt-20 z-10">
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-[25px] font-semibold font-inter flex items-center gap-3"><ExploreBaseIcons value="listing-white-and-black-solid" /><p>Saved Businesses</p></h1>
          <button className="sm:h-[52px] sm:w-[167px] border-[1px] border-[#D9D6FE] bg-primary/10 text-primary font-semibold text-[16px] flex items-center justify-center rounded-lg gap-2" onClick={() => router.push('/business/collaboration')}> <BaseIcons value='people-outlined-primary' /><p>Collaboration</p></button>
        </div>
        <div className="mb-16 w-[650px]">
          <SearchGroup searchType="All" />
        </div>
      </div>

      {/* listings  aorund you */}
      <div className='mt:px-0 relative sm:w-[1540px] flex w-full flex-col items-center justify-center'>
        <div className='flex w-full justify-between'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='beauty-outlined-primary' />
            <h1 className='text-[16px] font-bold sm:text-2xl'>
              Beauty & Personal Care
            </h1>
          </div>
        </div>

        <div className='-mt-14 flex w-[393px] items-center sm:w-[1560px]'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: '.beauty-custom-next',
              prevEl: '.beauty-custom-prev',
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}
            scrollbar={false}
            onSwiper={swiper => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            className='relative h-[599px]'
            breakpoints={{

              1024: {
                slidesPerView: 4,
                spaceBetween: 7,
              },
            }}
          >
            <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[57px]'>
              <button className='beauty-custom-prev rotate-180 transition-transform'>
                <BaseIcons value='arrow-long-right-black' />
              </button>
            </div>

            <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-14'>
              <button className='beauty-custom-next rounded-full px-4 py-2'>
                <BaseIcons value='arrow-long-right-black' />
              </button>
            </div>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <SwiperSlide
                  key={key}
                  className='flex items-center justify-center px-10 pt-10'
                >
                  <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                    <FeaturedListingCard
                      key={key}
                      header={listing.header}
                      desc={listing.desc}
                      imageUrl={listing.imageUrl}
                      logoUrl={listing.logoUrl}
                      address={listing.address}
                      rating={listing.rating}
                      group={true}
                      classStyle={
                        'sm:h-[457px] sm:w-[340px] w-[252px] h-[237px]'
                      }
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {/* Events and celebrations  */}
      <div className='mt:px-0 relative sm:w-[1540px] flex w-full flex-col items-center justify-center'>
        <div className='flex w-full justify-between'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='baloon-outlined-primary' />
            <h1 className='text-[16px] font-bold sm:text-2xl'>
              Events & Celebrations
            </h1>
          </div>
        </div>

        <div className='-mt-14 flex w-[393px] items-center sm:w-[1560px]'>
          <Swiper
            centerInsufficientSlides={false}
            // navigation={{
            //   nextEl: '.beauty-custom-next',
            //   prevEl: '.beauty-custom-prev',
            // }}
            // modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}
            scrollbar={false}
            onSwiper={swiper => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            className='relative h-[599px]'
            breakpoints={{

              1024: {
                slidesPerView: 4,
                spaceBetween: 7,
              },
            }}
          >
            {/* <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[57px]'>
              <button className='beauty-custom-prev rotate-180 transition-transform'>
                <BaseIcons value='arrow-long-right-black' />
              </button>
            </div>

            <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-14'>
              <button className='beauty-custom-next rounded-full px-4 py-2'>
                <BaseIcons value='arrow-long-right-black' />
              </button>
            </div> */}
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <SwiperSlide
                  key={key}
                  className='flex items-center justify-center px-10 pt-10'
                >
                  <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                    <FeaturedListingCard
                      key={key}
                      header={listing.header}
                      desc={listing.desc}
                      imageUrl={listing.imageUrl}
                      logoUrl={listing.logoUrl}
                      address={listing.address}
                      rating={listing.rating}
                      group={true}
                      classStyle={
                        'sm:h-[457px] sm:w-[340px] w-[252px] h-[237px]'
                      }
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {/* Fashion & Accessories */}

      <div className='mt:px-0 relative sm:w-[1540px] flex w-full flex-col items-center justify-center'>
        <div className='flex w-full justify-between'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='shirt-outlined-primary' />
            <h1 className='text-[16px] font-bold sm:text-2xl'>
              Fashion & Accessories
            </h1>
          </div>
        </div>

        <div className='-mt-14 flex w-[393px] items-center sm:w-[1560px]'>
          <Swiper
            centerInsufficientSlides={false}
            // navigation={{
            //   nextEl: '.beauty-custom-next',
            //   prevEl: '.beauty-custom-prev',
            // }}
            // modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}
            scrollbar={false}
            onSwiper={swiper => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            className='relative h-[599px]'
            breakpoints={{

              1024: {
                slidesPerView: 4,
                spaceBetween: 7,
              },
            }}
          >
            {/* <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[57px]'>
              <button className='beauty-custom-prev rotate-180 transition-transform'>
                <BaseIcons value='arrow-long-right-black' />
              </button>
            </div>

            <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-14'>
              <button className='beauty-custom-next rounded-full px-4 py-2'>
                <BaseIcons value='arrow-long-right-black' />
              </button>
            </div> */}
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <SwiperSlide
                  key={key}
                  className='flex items-center justify-center px-10 pt-10'
                >
                  <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                    <FeaturedListingCard
                      key={key}
                      header={listing.header}
                      desc={listing.desc}
                      imageUrl={listing.imageUrl}
                      logoUrl={listing.logoUrl}
                      address={listing.address}
                      rating={listing.rating}
                      group={true}
                      classStyle={
                        'sm:h-[457px] sm:w-[340px] w-[252px] h-[237px]'
                      }
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <BusinessFooter />
    </main>
  );
}
