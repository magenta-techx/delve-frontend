import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import CollaborationContact from './CollaborationContact';
import { CollaborationIcons } from '@/assets/icons/business/collaboration/Icons';
import CollaborationPreview from './CollaborationPreview';
import CollaborationAddTeamMember from './CollaborationAddTeamMember';
import Modal from '@/components/ui/Modal';
import CancleIcon from '@/assets/icons/CancelIcon';
import SearchGroup from '@/components/landing-page/savedBusinesses/SearchGroup';
import { Button } from '@/components/ui/Button';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';

const CollaborationCreationForm = (): JSX.Element => {
  const [addTeamMemberInput, setAddTeamMemberInput] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
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
    <section className='flex w-full justify-between'>
      <div className='sm:w-[624px]'>
        <Formik
          initialValues={{ group_name: '', description: '' }}
          //   validationSchema={loginSchema}
          onSubmit={value => console.log(value)}
        >
          {({ errors, isSubmitting }) => (
            <Form className='w-full'>
              {errors.group_name} {errors.description}
              {isSubmitting && 'Loading'}
              {/* Fields */}
              <div className='mb-2 flex w-full flex-col gap-3'>
                {/* Group Field */}
                <Input
                  name='group_name'
                  type='text'
                  placeholder='Enter group name'
                  label='Group name '
                  //   icon={<CancleIcon />}
                  //   validate={emailValidator}
                />

                {/* Description Field */}
                <TextArea
                  name='description'
                  placeholder='Write a decription'
                  label='Description'
                />
              </div>
            </Form>
          )}
        </Formik>

        {/* Group members  */}
        <div className='mb-10'>
          <div>
            <h1 className='mb-4 font-semibold'>Group Members</h1>

            {/* fixed bar  */}
            <div className='fixed'>
              <div className='rounded-lg border-[1px] border-[#EEF2F6] sm:h-[255px] sm:w-[12px]'>
                <div className='w-full rounded-lg bg-[#F5F3FF] sm:h-[148px]'></div>
              </div>
            </div>

            {/* List team members  */}
            <div className='mb-4 flex flex-col gap-2 pl-5'>
              {COLLABORATIONCONTACTS.map((collaboration, key) => {
                return (
                  <CollaborationContact
                    key={key}
                    status={collaboration.status}
                    name={collaboration.name}
                    date={collaboration.date}
                    role={collaboration.role}
                    styleProps='sm:w-[602px] sm:h-[58px]'
                  />
                );
              })}
            </div>
          </div>

          {/* Add team members button  */}
          {addTeamMemberInput ? (
            <CollaborationAddTeamMember
              setAddTeamMemberInput={() =>
                setAddTeamMemberInput(!addTeamMemberInput)
              }
            />
          ) : (
            <button
              className='flex items-center justify-center gap-2 rounded-lg border-[1px] border-[#D9D6FE] bg-primary/10 text-[16px] text-primary sm:h-[48px] sm:w-[195px]'
              onClick={() => setAddTeamMemberInput(!addTeamMemberInput)}
            >
              {' '}
              <p className='text-[14px]'>Add team member</p>{' '}
              <CollaborationIcons value='plus-primary' />
            </button>
          )}
        </div>

        {/* Group Listings  */}
        <div>
          <h1 className='mb-4 font-semibold'>Group Listings</h1>
          {/* Add team members button  */}
          <button
            className='flex items-center justify-center gap-2 rounded-lg border-[1px] border-[#D9D6FE] bg-primary/10 text-[16px] text-primary sm:h-[48px] sm:w-[147px]'
            onClick={() => {
              setOpen(true);
            }}
          >
            {' '}
            <p className='text-[14px]'>Add Listing</p>{' '}
            <CollaborationIcons value='plus-primary' />
          </button>

          {/* Modal  */}
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            contentClassName=''
          >
            <div className='relative max-h-[605px] w-[1232px] overflow-y-scroll rounded-xl border-[1px] border-[#EEF2F6] bg-white pl-3'>
              <div className='relative'>
                {/* fixed bar  */}
                <div className='fixed pt-5'>
                  <div className='rounded-lg border-[1px] border-[#EEF2F6] sm:h-[565px] sm:w-[14px]'>
                    <div className='w-full rounded-lg bg-[#F5F3FF] sm:h-[334px]'></div>
                  </div>
                </div>
                <div className='relative pl-10 pr-6'>
                  <div className='fixed z-10 flex h-[90px] w-[1155px] items-center justify-between bg-white'>
                    <h1 className='text-[24px] font-semibold'>
                      Saved Businesses
                    </h1>
                    <div className='flex items-center gap-6'>
                      <div className='flex items-center gap-3'>
                        <span className='font-semibold text-[#FEC601]'>
                          {' '}
                          0 selected{' '}
                        </span>
                        <span className='text-[#E3E8EF]'>|</span>
                        <button className='text-[16px] text-[#9AA4B2]'>
                          Clear
                        </button>
                      </div>
                      <button onClick={() => setOpen(false)}>
                        <CancleIcon />
                      </button>
                    </div>
                  </div>

                  <div className='max-h-[717px] pt-24'>
                    <div className='flex items-center justify-between'>
                      <div className='w-[558px]'>
                        <SearchGroup />
                      </div>
                      <Button className='w-[89px]'>Done</Button>
                    </div>

                    {/* listings  aorund you */}
                    <div className='relative mt-10 flex w-full flex-col items-center justify-center sm:w-full'>
                      <div className='flex w-full justify-between'>
                        <div className='flex items-center gap-2'>
                          <BaseIcons value='beauty-outlined-primary' />
                          <h1 className='text-[16px] font-bold'>
                            Beauty & Personal Care
                          </h1>
                        </div>
                      </div>

                      <div className='-mt-5 flex h-[400px] items-center sm:w-[1155px]'>
                        <Swiper
                          centerInsufficientSlides={false}
                          navigation={{
                            nextEl: '.saved-business-custom-next',
                            prevEl: '.saved-business-custom-prev',
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
                          <div className='absolute top-0 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#F8FAFC] sm:right-14 sm:top-[100px] sm:h-[36px] sm:w-[36px]'>
                            <button className='saved-business-custom-prev rotate-180 transition-transform'>
                              <BaseIcons value='arrow-long-right-black' />
                            </button>
                          </div>

                          <div className='absolute right-0 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#F8FAFC] sm:top-[100px] sm:h-[36px] sm:w-[36px]'>
                            <button className='saved-business-custom-next rounded-full px-4 py-2'>
                              <BaseIcons value='arrow-long-right-black' />
                            </button>
                          </div>
                          {LISTINGS_AROUND.map((listing, key) => {
                            return (
                              <SwiperSlide
                                key={key}
                                className='flex items-center justify-center'
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
                                      'sm:h-[309px] sm:w-[249px] w-[252px] h-[237px]'
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
                    <div className='mt:px-0 relative flex w-full flex-col items-center justify-center sm:w-[1155px]'>
                      <div className='flex w-full justify-between'>
                        <div className='flex items-center gap-2'>
                          <BaseIcons value='baloon-outlined-primary' />
                          <h1 className='text-[16px] font-bold'>
                            Events & Celebrations
                          </h1>
                        </div>
                      </div>

                      <div className='-mt-20 flex w-[393px] items-center sm:w-[1155px]'>
                        <Swiper
                          centerInsufficientSlides={false}
                          // navigation={{
                          //   nextEl: '.events-custom-next',
                          //   prevEl: '.events-custom-prev',
                          // }}
                          // modules={[Navigation, Pagination, Scrollbar, A11y]}
                          slidesPerView={4}
                          spaceBetween={7}
                          scrollbar={false}
                          onSwiper={swiper => console.log(swiper)}
                          onSlideChange={() => console.log('slide change')}
                          className='relative h-[499px]'
                          breakpoints={{
                            1024: {
                              slidesPerView: 4,
                              spaceBetween: 7,
                            },
                          }}
                        >
                          {/* <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[57px]'>
                                                        <button className='events-custom-prev rotate-180 transition-transform'>
                                                            <BaseIcons value='arrow-long-right-black' />
                                                        </button>
                                                        </div>

                                                        <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-14'>
                                                        <button className='events-custom-next rounded-full px-4 py-2'>
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
                                      'sm:h-[309px] sm:w-[249px] w-[252px] h-[237px]'
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
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className='sm:-mt-14 sm:h-[866px] sm:w-[780px]'>
        <CollaborationPreview />
      </div>
    </section>
  );
};

export default CollaborationCreationForm;
