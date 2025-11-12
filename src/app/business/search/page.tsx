'use client';
import { GraphicsBaseIcons } from '@/assets/graphics/GraphicsBaseIcons';
import { BaseIcons } from '@/assets/icons/base/Icons';
import {
  BusinessCategoryIcons,
  IconsType,
} from '@/assets/icons/business/BusinessCategoriesIcon';
import CancleIcon from '@/assets/icons/CancelIcon';
import { TempBaseIcons } from '@/assets/icons/temporary/Icons';
import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/app/(clients)/misc/components/ListingCard';
import SponsoredCard from '@/components/cards/SponsoredCard';

// import Navbar from '@/components/Navbar';
import NavbarLandingPage from '@/components/navbar/NavbarLandingPage';
import { Button } from '@/components/ui/Button';
import UpComingEvents from '@/components/UpComingEvents';

// import type { Metadata } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

interface statesProps {
  id: number;
  name: string;
}

export default function HomePage(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [states, setStates] = useState<statesProps[]>([]);
  const [categories, setCategories] = useState<statesProps[]>([]);
  const [showMobileNavBar, setShowMobileNavbar] = useState<boolean>(false);
  const CATEGORIES = [
    {
      id: 1,
      text: 'By States',
      headerText: 'All city',
      subCategories: states,
    },
    {
      id: 2,
      headerText: 'Category',
      text: 'Category',
      subCategories: categories,
    },
    {
      id: 3,
      headerText: 'Sponsored ads',
      text: 'Sponsored',
      subCategories: [],
    },
  ];
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
  ];
  // const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/business/business-categories`);
        if (!res.ok) return;

        const data = await res.json();
        console.log('Categories Data: ', data);

        setCategories(data?.data ? [...data.data] : []);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchStates = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/business/business-states`);
        if (!res.ok) return;

        const data = await res.json();
        console.log('State data: ', data);
        setStates(data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    fetchStates();
  }, []);

  return (
    <main className='relative flex flex-col items-center'>
      {/* <Navbar type='blog' authFormButtons={false} /> */}
      <NavbarLandingPage />

      {/* Content  container */}
      <div
        className={`relative flex h-full w-full flex-col gap-10 sm:mt-10 sm:min-h-[70vh] sm:w-[1488px] sm:flex-row sm:justify-end sm:gap-[128px] ${selectedCategory !== 0 ? 'sm:mb-44' : ''}`}
      >
        {/* Side bar  */}

        <div className='flex w-full items-center gap-4 px-4 sm:left-0 sm:w-[208px] sm:flex-col sm:items-start sm:px-0'>
          <button
            className='flex sm:hidden'
            onClick={() => {
              console.log('Clicked');
              setShowMobileNavbar(!showMobileNavBar);
            }}
          >
            <BaseIcons value='filter-outlined-black' />
          </button>

          <h1 className='flex gap-3 font-inter text-[16px] sm:mb-4 sm:text-[24px] sm:font-semibold'>
            Filter <span className='hidden sm:flex'>Search</span>
          </h1>

          <div className='border-1 flex w-full items-center gap-2 rounded-xl border-[1px] border-[#E3E8EF] bg-[#F8FAFC] px-4 py-2 sm:rounded-lg sm:border-none sm:px-2 sm:py-3'>
            <div>
              <BaseIcons value='search-black' />
            </div>
            <input
              className='bg-transparent outline-none'
              placeholder='Search'
            />
          </div>
          <div className='hidden w-full flex-col sm:flex'>
            {CATEGORIES.map(category => {
              return (
                <div
                  key={category.id}
                  className={`max-h-[400px] overflow-y-scroll border-b-[1px] border-[#E3E8EF] pt-5`}
                >
                  <button
                    className='mb-5 flex w-full items-center justify-between font-medium'
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span
                      className={`${category.id === selectedCategory ? 'text-[#697586]' : 'text-black'}`}
                    >
                      {category.text}
                    </span>{' '}
                    {category.id != 3 && (
                      <BaseIcons
                        value={
                          category.id === selectedCategory
                            ? 'arrow-down-black'
                            : 'arrow-right-black'
                        }
                      />
                    )}
                  </button>

                  <div
                    className={`flex flex-col items-start gap-3 ${category.id === selectedCategory && category.subCategories.length ? 'pb-3' : ''}`}
                  >
                    {selectedCategory === category.id &&
                      category.subCategories.map(subCategory => {
                        const icon =
                          category.id === 2
                            ? (subCategory?.name
                                .split(' ')[0]
                                ?.toLowerCase() as IconsType)
                            : 'shopping';
                        return (
                          <button
                            key={subCategory.id}
                            className='flex w-[] items-center gap-1 truncate capitalize'
                          >
                            {category.id === 2 && (
                              <BusinessCategoryIcons value={icon} />
                            )}{' '}
                            {subCategory.name.toLowerCase()}
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content  */}
        <div
          className={`relative w-full sm:w-[1852px] ${selectedCategory === 0 ? 'h-[80vh]' : 'min-h-screen'} sm:min-h-screen`}
        >
          {selectedCategory !== 0 && (
            <div className='flex items-center gap-2 px-4 sm:px-0'>
              <BaseIcons value='stars-primary' />
              <h1 className='text-[18px] font-bold sm:text-2xl'>
                {CATEGORIES[selectedCategory - 1]?.headerText}
              </h1>
            </div>
          )}

          {/* Empty business listings  */}
          {selectedCategory === 0 && (
            <div className='flex min-h-[60vh] w-full flex-col items-center justify-center sm:mt-40 sm:max-h-[40vh] sm:justify-start'>
              <div className='flex flex-col items-center justify-center gap-4 px-20'>
                <div className='flex sm:hidden'>
                  <GraphicsBaseIcons value='empty-business-listing' />
                </div>
                <div className='hidden sm:flex'>
                  <GraphicsBaseIcons value='empty-business-listing-desktop' />
                </div>
                <p className='text-center text-[14px]'>
                  Oops! There are no business listings in this location right
                  now.
                </p>
                <div className='flex w-[120px] sm:hidden'>
                  <Button size='sm' onClick={() => console.log('clicked')}>
                    Explore Listings
                  </Button>
                </div>
              </div>
              <div className='absolute bottom-0 flex h-[80px] w-full items-center justify-between rounded-tl-2xl rounded-tr-2xl bg-[#FBFAFF] px-10 sm:hidden'>
                <TempBaseIcons value='market-primary-solid' />
                <TempBaseIcons value='bookmark-black-solid' />
                <TempBaseIcons value='chat-black-solid' />
                <TempBaseIcons value='bell-black-solid' />
              </div>
            </div>
          )}

          {/* Featured  */}
          {selectedCategory === 1 && (
            <div className='flex min-h-screen flex-col items-center py-5 sm:max-h-[1200px] sm:overflow-y-scroll sm:py-10'>
              {/* Desktop  */}
              <div className='hidden flex-col sm:flex'>
                <div className='flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <BaseIcons value='flame-yellow-small' />
                    <h1 className='text-xl font-bold'>Featured</h1>
                  </div>
                </div>
                <div className='mb-20 mt-5 grid grid-cols-3 gap-5'>
                  {LISTINGS_AROUND.map((listing, key) => {
                    return (
                      <FeaturedListingCard
                        key={key}
                        header={listing.header}
                        desc={listing.desc}
                        imageUrl={listing.imageUrl}
                        logoUrl={listing.logoUrl}
                        address={listing.address}
                        rating={listing.rating}
                        classStyle={'h-[461px] w-[352px]'}
                      />
                    );
                  })}
                </div>
                <div className='-mt-5 mb-20 flex w-full justify-center'>
                  <div className='w-[150px]'>
                    <button className='rounded-md border border-neutral-200 bg-neutral bg-white px-[23px] py-3 text-lg font-medium text-black text-neutral-foreground hover:bg-primary/50'>
                      Show more
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile  */}
              <div className='relative flex w-full flex-col items-center justify-center sm:hidden'>
                <div className='flex w-full justify-between px-4 sm:px-0'>
                  <div className='flex items-center gap-2'>
                    <BaseIcons value='flame-yellow-small' />
                    <h1 className='text-[16px] font-bold'>Featured</h1>
                  </div>
                </div>

                <div className='-mt-16 flex w-[400px] items-center'>
                  <Swiper
                    centerInsufficientSlides={false}
                    scrollbar={false}
                    onSwiper={swiper => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}
                    className='relative h-[370px]'
                    breakpoints={{
                      300: {
                        slidesPerView: 1,
                        spaceBetween: -110,
                      },
                    }}
                  >
                    {LISTINGS_AROUND.map((listing, key) => {
                      return (
                        <SwiperSlide
                          key={key}
                          className='flex items-center justify-center pl-7 pt-10'
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
                              classStyle={'w-[255px] h-[237px]'}
                            />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>

              {/* Explore   */}
              <div className='flex flex-col items-center sm:hidden'>
                <div>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2'>
                      <h1 className='text-[16px] font-bold sm:text-2xl'>
                        Explore
                      </h1>
                    </div>
                  </div>
                  <div className='relative mt-5 grid min-h-screen grid-cols-1 gap-4 sm:gap-10'>
                    {LISTINGS_AROUND.map((listing, key) => {
                      return (
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
                            'sm:h-[477px] sm:w-[370px] w-[352px] h-[237px]'
                          }
                        />
                      );
                    })}
                  </div>
                </div>
                <button className='flex flex-col items-center justify-center px-[38px] py-4 text-lg text-black'>
                  More
                  <BaseIcons value='arrow-long-down-black' />
                </button>
              </div>
            </div>
          )}

          {selectedCategory === 3 && (
            <div className='mt-10 hidden w-full items-center justify-center gap-2 sm:flex'>
              <SponsoredCard
                imageUrl={'/filters/category-filter-1.jpg'}
                href={'/'}
                styleProps='w-[365px] h-[470px]'
              />
              <SponsoredCard
                imageUrl={'/filters/category-filter.jpg'}
                href={'/'}
                styleProps='w-[365px] h-[470px]'
              />
              <SponsoredCard
                imageUrl={'/filters/category-filter-1.jpg'}
                href={'/'}
                styleProps='w-[365px] h-[470px]'
              />
            </div>
          )}
        </div>
      </div>

      {selectedCategory === 0 && (
        <div className='hidden w-full sm:flex sm:h-[217px]'>
          <Image
            src={'/landingpage/second-banner.jpg'}
            alt=''
            width={700}
            height={400}
            className='hidden h-full w-full sm:flex'
            quality={100}
          />

          <Image
            src={'/landingpage/footer-image-mobile-2.jpg'}
            alt=''
            width={700}
            height={400}
            className='flex h-full w-full sm:hidden'
            quality={100}
          />
        </div>
      )}

      {/* Mobile Menu Items  */}
      {showMobileNavBar && (
        <div className='absolute left-0 top-0 z-50 flex h-[100%] w-full flex-col gap-10 bg-white px-5 py-10'>
          <div className='flex items-center justify-between'>
            <h1 className='text-[18px]font-inter flex gap-3 font-extrabold'>
              Filter Search
            </h1>

            <button
              className='flex items-center gap-2 sm:hidden'
              onClick={() => {
                console.log('Clicked');
                setShowMobileNavbar(!showMobileNavBar);
              }}
            >
              <p className='text-sm text-[#697586]'>Cancel</p>
              <CancleIcon />
            </button>
          </div>

          <div className='border-1 flex w-full items-center gap-2 rounded-xl border-[1px] border-[#E3E8EF] bg-[#F8FAFC] px-4 py-2 sm:rounded-lg sm:border-none sm:px-2 sm:py-3'>
            <div>
              <BaseIcons value='search-black' />
            </div>
            <input
              className='bg-transparent outline-none'
              placeholder='Search'
            />
          </div>
          {CATEGORIES.map(category => {
            return (
              <div
                key={category.id}
                className='max-h-[400px] overflow-y-scroll border-b-[1px] border-[#E3E8EF]'
              >
                <button
                  className='mb-5 flex w-full items-center justify-between font-medium'
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className={`text-sm text-[#697586]`}>
                    {category.text}
                  </span>{' '}
                  {category.id != 3 && <BaseIcons value='arrow-down-black' />}
                </button>

                <div
                  className={`flex flex-col items-start gap-3 ${category.id === selectedCategory && category.subCategories.length ? 'pb-3' : ''}`}
                >
                  {category.subCategories.map(subCategory => {
                    const icon =
                      category.id === 2
                        ? (subCategory?.name
                            .split(' ')[0]
                            ?.toLowerCase() as IconsType)
                        : 'shopping';
                    return (
                      <button
                        key={subCategory.id}
                        className='flex w-[] items-center gap-1 truncate capitalize'
                      >
                        {category.id === 2 && (
                          <BusinessCategoryIcons value={icon} />
                        )}{' '}
                        {subCategory.name.toLowerCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCategory !== 0 && (
        <div className='flex w-full sm:hidden'>
          {' '}
          <UpComingEvents />
        </div>
      )}
      {/* Image banner   */}
      {selectedCategory !== 0 && (
        <div className='w-full sm:h-[217px]'>
          <Image
            src={'/landingpage/second-banner.jpg'}
            alt=''
            width={700}
            height={400}
            className='hidden h-full w-full sm:flex'
            quality={100}
          />

          <Image
            src={'/landingpage/footer-image-mobile-2.jpg'}
            alt=''
            width={700}
            height={400}
            className='flex h-full w-full sm:hidden'
            quality={100}
          />
        </div>
      )}

      {selectedCategory !== 0 && <BusinessFooter />}
    </main>
  );
}
