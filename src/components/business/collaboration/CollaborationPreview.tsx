'use client';
import React from 'react';
import CollaborationContact from './CollaborationContact';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { BaseIcons } from '@/assets/icons/base/Icons';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';

interface CollaborationPreviewProps {
  actionBtntext?: string;
  page?: string;
  onBtnClick?: () => void;
}
const CollaborationPreview = ({
  page,
  actionBtntext = 'Delete',
  onBtnClick,
}: CollaborationPreviewProps): JSX.Element => {
  const COLLABORATIONCONTACTS = [
    {
      name: 'John Maija',
      role: 'owner',
      date: '12-04-2025',
      status: 1,
    },
    {
      name: 'Ada Okonkwo',
      role: 'Contributor',
      date: '12-04-2025',
      status: 0,
    },
    {
      name: 'Ada Okonkwo',
      role: 'Contributor',
      date: '12-04-2025',
      status: 1,
    },
    {
      name: 'Ada Okonkwo',
      role: 'Contributor',
      date: '12-04-2025',
      status: 1,
    },
    {
      name: 'Ada Okonkwo',
      role: 'Contributor',
      date: '12-04-2025',
      status: 1,
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
    <div className='h-full w-full rounded-bl-2xl rounded-br-2xl rounded-tl-[34px] rounded-tr-[34px] border-[1px] border-[#EEF2F6] bg-[#FFFFFF]'>
      {/* Header  */}
      <div className='flex w-full items-center justify-between border-b-[1px] border-[#EEF2F6] px-10 pb-5 pt-7'>
        <h1 className='text-[24px] font-semibold'>Preview</h1>
        <button
          className='text-[16px] text-[#BC1B06]'
          onClick={() => onBtnClick?.()}
        >
          {actionBtntext}
        </button>
      </div>

      <div className={`overflow-y-scroll sm:h-[745px]`}>
        <div className='flex items-start pt-2'>
          <div className='fixed z-10 bg-white pl-4'>
            <div className='rounded-lg border-[1px] border-[#EEF2F6] sm:h-[737px] sm:w-[12px]'>
              <div className='w-full rounded-lg bg-[#F5F3FF] sm:h-[587px]'></div>
            </div>
          </div>
          <div
            className={`flex flex-col gap-8 ${page === 'preview' ? 'pl-1 pr-44' : ''}`}
          >
            <div className='flex flex-col gap-8 pl-10'>
              {/* Group name  */}
              <div className=''>
                <h1 className='mb-3 text-[16px] text-[#9AA4B2]'>Group name</h1>
                <h1 className='text-[18px] font-semibold text-[#0D121C]'>
                  Titi&apos;s wedding
                </h1>
              </div>

              {/* Group description  */}
              <div className=''>
                <h1 className='mb-3 text-[16px] text-[#9AA4B2]'>
                  Group description
                </h1>
                <h1 className='text-[16px] font-medium text-[#0D121C]'>
                  A shared space to plan Ada’s big day from choosing the perfect
                  decorator to finding trusted makeup artists, caterers, and
                  more. Let’s save vendors, share feedback, and make every
                  detail unforgettable together.
                </h1>
              </div>

              {/* Group members  */}
              <div className='w-full'>
                <h1 className='mb-3 text-[16px] text-[#9AA4B2]'>
                  Group members
                </h1>
                {/* List team members  */}
                <div className='mb-4 flex flex-col gap-2 pr-4'>
                  {COLLABORATIONCONTACTS.map((collaboration, key) => {
                    return (
                      <CollaborationContact
                        key={key}
                        status={collaboration.status}
                        name={collaboration.name}
                        date={collaboration.date}
                        role={collaboration.role}
                        styleProps='sm:w-full sm:h-[58px]'
                        neutral={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Group listing  */}
            {page != 'preview' && (
              <div className={`flex w-full flex-col gap-10 pl-4 sm:w-[750px]`}>
                <h1 className='mb-3 pl-8 text-[16px] text-[#9AA4B2]'>
                  Group Listing
                </h1>
                <div className='relative flex w-full flex-col items-center justify-center sm:px-0'>
                  <div className='-pl-24 -mt-[85px] flex w-full items-center'>
                    <Swiper
                      centerInsufficientSlides={false}
                      navigation={{
                        nextEl: '.preview-custom-next',
                        prevEl: '.preview-custom-prev',
                      }}
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      slidesPerView={2}
                      spaceBetween={-80}
                      scrollbar={false}
                      onSwiper={swiper => console.log(swiper)}
                      onSlideChange={() => console.log('slide change')}
                      className='relative h-[410px]'
                    >
                      <div className='absolute top-0 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#F8FAFC] sm:right-14 sm:top-[25px] sm:h-[28px] sm:w-[28px]'>
                        <button className='preview-custom-prev rotate-180 transition-transform'>
                          <BaseIcons value='arrow-long-right-black' />
                        </button>
                      </div>

                      <div className='absolute right-0 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#F8FAFC] sm:top-[25px] sm:h-[28px] sm:w-[28px]'>
                        <button className='preview-custom-next rounded-full px-4 py-2'>
                          <BaseIcons value='arrow-long-right-black' />
                        </button>
                      </div>
                      {LISTINGS_AROUND.map((listing, key) => {
                        return (
                          <SwiperSlide
                            key={key}
                            className='-ml-10 flex items-center justify-center pt-10'
                          >
                            <div className='flex w-full items-center sm:-ml-0 sm:justify-center'>
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
                                  'sm:h-[309px] sm:w-[248px] w-[252px] h-[237px]'
                                }
                              />
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              </div>
            )}

            {/* Preview page Group listing  */}
            {page == 'preview' && (
              <div className={`ml-4 flex w-full flex-col gap-10 sm:w-[1450px]`}>
                <h1 className='mb-3 pl-8 text-[16px] text-[#9AA4B2]'>
                  Group Listing
                </h1>
                <div className='relative flex w-full flex-col items-center justify-center sm:px-0'>
                  <div className='-mt-[85px] flex w-full items-center'>
                    <Swiper
                      centerInsufficientSlides={false}
                      navigation={{
                        nextEl: '.preview-custom-next',
                        prevEl: '.preview-custom-prev',
                      }}
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      slidesPerView={5}
                      spaceBetween={-20}
                      scrollbar={false}
                      onSwiper={swiper => console.log(swiper)}
                      onSlideChange={() => console.log('slide change')}
                      className='relative h-[410px]'
                    >
                      {/* <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[25px] rounded-full sm:h-[28px] sm:w-[28px] flex justify-center items-center bg-[#F8FAFC]'>
                                            <button className='preview-custom-prev rotate-180 transition-transform'>
                                                <BaseIcons value='arrow-long-right-black' />
                                            </button>
                                        </div>

                                        <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-[25px] rounded-full sm:h-[28px] sm:w-[28px] flex justify-center items-center bg-[#F8FAFC]'>
                                            <button className='preview-custom-next rounded-full px-4 py-2'>
                                                <BaseIcons value='arrow-long-right-black' />
                                            </button>
                                        </div> */}
                      {LISTINGS_AROUND.map((listing, key) => {
                        return (
                          <SwiperSlide
                            key={key}
                            className='flex items-center justify-center pt-10'
                          >
                            <div className='flex w-full items-center sm:-ml-0 sm:justify-center'>
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
                                  'sm:h-[309px] sm:w-[228px] w-[252px] h-[237px]'
                                }
                              />
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPreview;
