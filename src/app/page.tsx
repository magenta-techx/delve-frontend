'use client'
import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
import BusinessFooter from '@/components/business/BusinessFooter';
import BlogCard from '@/components/cards/BlogCard';
import CategoryCard from '@/components/cards/CategoryCard';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';
// import LocationCard from '@/components/cards/LocationCard';
import SponsoredCard from '@/components/cards/SponsoredCard';
import Faqs from '@/components/Faqs';
import SearchGroup from '@/components/landing-page/SearchGroup';
import SectionHeader from '@/components/landing-page/SectionHeader';
import ThisWeeksTrends from '@/components/landing-page/ThisWeeksTrends';
import Navbar from '@/components/Navbar';
// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useEffect, useState } from 'react';
import NavbarLandingPage from '@/components/navbar/NavbarLandingPage';


// export const metadata: Metadata = {
//   title: 'Home',
//   description: 'Delve Landing page',
// };

export default function HomePage(): JSX.Element {
  const FEATURED_LISTINGS = [
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

  ]
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

  ]

  // const LOACTIONS = [
  //   { name: 'Lagos', imageUrl: '/landingpage/lagos.png' },
  //   { name: 'Abuja', imageUrl: '/landingpage/lagos.png' },
  //   { name: 'Ibadan', imageUrl: '/landingpage/lagos.png' },
  //   { name: 'Port-harcourt', imageUrl: '/landingpage/lagos.png' },
  // ]

  const SPONSORED_LIST = [
    {
      imageUrl: '/landingpage/sponsored-2.jpg',
      href: '/'

    },
    {
      imageUrl: '/landingpage/sponsored-1.jpg',
      href: '/'

    },
    {
      imageUrl: '/landingpage/sponsored-2.jpg',
      href: '/'

    },
    {
      imageUrl: '/landingpage/sponsored-1.jpg',
      href: '/'

    }
  ]

  const STATS = [
    {
      count: '72+',
      desc: 'Business visits'
    },
    {
      count: '612+',
      desc: 'Message sent'
    },
    {
      count: '72+',
      desc: 'Business rating'
    },
  ]

  const CATEGORIES: {
    icon: IconsType,
    title: string
    hoverIcon: IconsType,
  }[] = [


      {
        icon: 'beauty-white',
      title: 'beauty',
      hoverIcon: 'beauty-outlined-black'
      },

      {
        icon: 'clothing-white',
        title: 'clothing & fashion',
        hoverIcon: 'clothing-outlined-black'
      },
      {
        icon: 'events-white',
        title: 'event',
        hoverIcon: 'events-outlined-black'
      },
      {
        icon: 'food-white',
        title: 'food & drinks',
        hoverIcon: 'food-outlined-black'
      },
      {
        icon: 'housing-white',
        title: 'housing & Accommmodation',
        hoverIcon: 'housing-outlined-black'
      },
      {
        icon: 'housing-white',
        title: 'housing & Accommmodation',
        hoverIcon: 'events-outlined-black'
      },
      {
        icon: 'housing-white',
        title: 'housing & Accommmodation',
        hoverIcon: 'events-outlined-black'
      },
      {
        icon: 'housing-white',
        title: 'housing & Accommmodation',
        hoverIcon: 'events-outlined-black'
      },
      {
        icon: 'housing-white',
        title: 'housing & Accommmodation',
        hoverIcon: 'events-outlined-black'
      },
      {
        icon: 'housing-white',
        title: 'housing & Accommmodation',
        hoverIcon: 'events-outlined-black'
      },

    ]

  interface Category {
    id: number;
    icon_name: string;
    name: string;
    categories: SubCategory[];
    subcategories: SubCategory[];
  }

  interface SubCategory {
    id: number;
    name: string; // backend sends plain strings
    subcategories?: SubCategory[];
  }

  const [isLoadingcategories, setIsloadingCategories] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      setIsloadingCategories(true);
      try {
        const res = await fetch(`/api/business/business-categories?is_nav=true`);
        if (!res.ok) return setIsloadingCategories(false);

        const data = await res.json();
        setCategories(data?.data ? [...data.data].reverse() : []);
      } catch (error) {
        console.error(error);
      }

      setIsloadingCategories(false);
    };

    fetchCategories();
  }, []);

  return (
    <main className='relative flex flex-col items-center overflow-x-hidden'>
      <div className='relative flex h-[83.6vh] w-screen flex-col items-center sm:bg-[url("/landingpage/landing-page-hero-image.jpg")] bg-cover bg-no-repeat'>
        {/* New Navbar component  */}
        <NavbarLandingPage />

        {/* Mobile hero  */}
        <div className='sm:hidden flex h-[756px] rounded-2xl w-full bg-[url("/landingpage/landing-pagemobile-hero.jpg")]'>
        </div>

        {/* Desktop Hero  */}
        <div className='insert-0 flex absolute sm:h-[83.6vh] rounded-2xl sm:rounded-none h-[75.5vh] sm:top-0 top-[80px] w-full bg-black/70'></div>
        <div className='w-full hidden sm:flex'>
          <Navbar type='' authFormButtons={false} navbarWidthDeskTop='w-full' categories={categories} isLoadingcategories={isLoadingcategories} />
        </div>

        {/* Hero section  */}
        <div className='absolute sm:top-[27.8rem] top-[26rem] flex h-full w-full flex-col items-center'>
          <h1 className='font-karma sm:text-[54px] text-[26px] font-bold text-white'>
            Great experiences start here.
          </h1>
          <p className='sm:-mt-2 font-inter sm:text-[19px] text-[14px] px-14 text-center text-white'>
            Delve helps you find reliable vendors who turn plans into beautiful
            memories.
          </p>
          <div className='mt-16'>
            <SearchGroup searchType='Category' />
          </div>
        </div>

      </div>


      <div className=' w-full flex flex-col items-center sm:py-20 pt-10'>

        <SectionHeader iconValue='category-yellow' header='Whatever you’re looking for, find it here.' paragraph='category' />

        {/* Category  */}
        <div className='mt-10 flex items-center gap-14 mb-20 sm:w-[1485px] w-full px-2 sm:px-0'>

          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={5}
            breakpoints={{
              300: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}

            scrollbar={false}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            // className='h-[700px] bg-green-300'
            className='sm:h-[300px] flex items-center justify-center w-full pt-10'
          >
            <div className="absolute hidden sm:flex top-36 left-0 z-10 -translate-y-1/2">
              <button className="custom-prev transition-transform rotate-180">
                <BaseIcons value='arrow-right-line-curve-black' />
              </button>
            </div>
            <div className="absolute top-36 hidden sm:flex right-0 z-10 -translate-y-1/2">
              <button className="custom-next">
                <BaseIcons value='arrow-right-line-curve-black' />
              </button>
            </div>
            {CATEGORIES.map((category, key) => {
              return (
                <SwiperSlide key={key} className=' flex items-center sm:pt-10 pt-5 justify-center'>
                  <div className='w-full flex items-center justify-center'>
                    {/* Overlay icon */}
                    <CategoryCard title={category.title} icon={category.icon} hoverIcon={category.hoverIcon} />
                  </div>
                </SwiperSlide>
              )
            })}



          </Swiper>
        </div>
      </div>




      {/* featured listings  */}
      <div className='bg-[#FFF4ED] w-full flex flex-col items-center sm:py-20 py-7'>
        <SectionHeader iconValue='listing-yellow' header='Trusted by dozens of happy clients. ' paragraph='Featured Listing' />


        <div className='w-full flex items-center justify-center relative'>

          <div className='mt-10 flex items-center gap-10 mb-20 sm:w-[1490px] w-full'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: ".FeaturedListingCard-next",
              prevEl: ".FeaturedListingCard-prev",
            }}
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}

            slidesPerView={3}
              spaceBetween={10}

            scrollbar={false}
            onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              className='relative'
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: -50,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: -45,
                },
              }}
          >
              <div className="absolute sm:flex hidden top-1/2 z-50 -translate-y-1/2">
                <button className="FeaturedListingCard-prev transition-transform rotate-180">
                  <BaseIcons value='arrow-right-line-curve-black' />
              </button>
            </div>
              <div className="absolute sm:flex hidden top-1/2 right-0 z-40 -translate-y-1/2">
                <button className="FeaturedListingCard-next">
                  <BaseIcons value='arrow-right-line-curve-black' />
              </button>
            </div>
            {FEATURED_LISTINGS.map((listing, key) => {
              return (
                <SwiperSlide key={key} className='flex px-10 items-center pt-10 justify-center'>
                  <div className='w-full flex items-center justify-center'>
                    <FeaturedListingCard header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} classStyle={'sm:h-[548px] sm:w-[412px] w-[306px] h-[401px]'} />
                  </div>
                </SwiperSlide>
              )
            })}

          </Swiper>
        </div>
        </div>


        {/* Serch By location  */}
        {/* <div className='mb-10'>

          <h1 className='text-2xl font-bold'>Search by location</h1>

          <div className=' flex items-center gap-10 mb-20 sm:w-[1490px] w-full'>
            <Swiper
              centerInsufficientSlides={false}

              slidesPerView={4}
              spaceBetween={10}

              scrollbar={false}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              className='relative'
              breakpoints={{
                300: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
              }}
            >

              {LOACTIONS.map((location, key) => {

                return (<SwiperSlide key={key} className='bg-green-300 flex items-center sm:pt-10 pt-5 justify-center'>

                  <LocationCard key={key} name={location.name} imageUrl={location.imageUrl} />

                </SwiperSlide>)
            })}

            </Swiper>

          </div>


        </div> */}

        {/* Sponsored picks  */}
        <div className='relative'>
          <SectionHeader iconValue='listing-yellow' header='Sponsored Picks' paragraph='Spotlight' />

          <h1 className='text-2xl font-bold mt-10 -mb-16 hidden sm:flex'>Hot deals and events you don’t want to miss</h1>
          <div className='flex items-center gap-3 sm:px-0 px-4'>
            <Swiper
              centerInsufficientSlides={false}
              navigation={{
                nextEl: ".sponsored-next",
                prevEl: ".sponsored-prev",
              }}
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={10}
              slidesPerView={2}
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
              }}


              scrollbar={false}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              // className='h-[700px] bg-green-300'
              className='sm:h-[589px] h-full pb-20 flex items-center justify-center sm:w-[1485px] w-[354px] sm:mt-0 -mt-5'
            >
              <div className="absolute z-10 sm:top-[57px] top-16 sm:right-14  -translate-y-1/2">
                <button className="sponsored-prev transition-transform rotate-180">
                  <BaseIcons value='arrow-right-solid-black' />
                </button>
              </div>
              {/* <div className="absolute left-0 sm:left-32 z-10 sm:top-14 top-16 -translate-y-1/2">
                <button className="sponsored-prev transition-transform rotate-180">
                  <BaseIcons value='arrow-right-solid-black' />
                </button>
              </div> */}
              <div className="absolute right-0 z-10 sm:top-14 top-16 -mt-[2px] -translate-y-1/2">
                <button className="sponsored-next px-4 py-2 rounded-full">
                  <BaseIcons value='arrow-right-solid-black' />
                </button>
              </div>
              {SPONSORED_LIST.map((sponsored, key) => {
                return <SwiperSlide key={key} className='flex items-center pt-20 justify-center'>
                  <div className='w-full flex items-center justify-center'>
                    <SponsoredCard key={key} imageUrl={sponsored.imageUrl} href={sponsored.href} />
                  </div>
                </SwiperSlide>
              })}
            </Swiper>
          </div>

        </div>
      </div>



      {/* Stats  */}
      <div className='py-14 flex flex-col items-center'>
        <div className='flex items-center sm:gap-72 gap-6 sm:mb-40 mb-20'>
          {STATS.map((stat, key) => {
            return <div key={key} className='flex flex-col items-center'>
              <h1 className='font-karma font-semibold sm:text-[48px] text-[30px] sm:-mb-5'>{stat.count}</h1>
              <small className='text-[#697586]'>{stat.desc}</small>
            </div>
          })}

        </div>


        <div className='w-full flex flex-col items-center justify-center relative mt:px-0 px-4'>
          <div className='flex justify-between w-full px-4 sm:px-0'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='stars-primary' />
              <h1 className='sm:text-2xl text-[16px] font-bold'>Listings around you</h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase sm:text-[16px] text-[12px]'>See all listings</Link>
            </div>
          </div>

          <div className='flex sm:-mt-0 -mt-4 items-center mb-20 sm:w-[1560px] w-[393px]'>
            <Swiper
              centerInsufficientSlides={false}

              // modules={[Navigation, Pagination, Scrollbar, A11y]}
              slidesPerView={4}
              spaceBetween={7}

              scrollbar={false}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              className='relative'
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: -100,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 7,
                },
              }}
            >

              {LISTINGS_AROUND.map((listing, key) => {
                return (
                  <SwiperSlide key={key} className='flex px-10 items-center pt-10 justify-center'>
                    <div className='w-full flex items-center sm:justify-center -ml-5 sm:-ml-0'>
                      <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'sm:h-[427px] sm:w-[340px] w-[252px] h-[237px]'} />
                    </div>
                  </SwiperSlide>
                )
              })}

            </Swiper>
          </div>
        </div>
      </div>

      {/* Tips, trends, vendor stories  */}
      <div className='sm:mb-32 mb-20 sm:px-0 px-4 -mt-20 sm:-mt-0'>
        <h1 className='sm:text-[52px] text-[24px] font-semibold font-karma'>Tips, Trends & Vendor Stories</h1>
        <p className='sm:text-[18px] text-[13px] font-inter mb-10'>Explore expert tips, trending event ideas, beauty routines, and vendor success stories all curated for you.</p>

        <div className='flex items-center gap-10'>
          <BlogCard imageUrl={'/landingpage/stories-1.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-full h-[422px] sm:w-[816px] sm:h-[740px]' imageClassStyle='sm:w-[752px] sm:h-[440px] w-full' />
          <BlogCard imageUrl={'/landingpage/stories-2.jpg'} header='Skipping Sunscreen' containerClassStyle='w-[647px] sm:flex hidden h-[740px]' imageClassStyle='w-[583px] h-[440px] ' />
        </div>

      </div>

      {/* This weeks trends  */}
      <div className="sm:mb-10 mb-44 py-10 sm:py-0 sm:w-[2000px] w-full">
        <ThisWeeksTrends />
      </div>

      {/* FAQS  */}
      <div className='sm:py-32 pb-20 sm:w-[1244px] w-full '>
        <Faqs />
      </div>

      <div className='w-full sm:h-[543px] sm:mt-32 mb-1'>
        <Image src={'/landingpage/first-banner.jpg'} alt='' width={700} height={400} className='w-full sm:flex hidden h-full' quality={100} />
        <Image src={'/landingpage/footer-image-mobile-1.jpg'} alt='' width={700} height={400} className='w-full h-full flex sm:hidden' quality={100} />
      </div>
      <div className='w-full sm:h-[217px] mb-10 sm:mb-0'>
        <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full sm:flex hidden' quality={100} />
        <Image src={'/landingpage/footer-image-mobile-2.jpg'} alt='' width={700} height={400} className='w-full h-full flex sm:hidden' quality={100} />
      </div>

      <BusinessFooter />

    </main>
  );
}
