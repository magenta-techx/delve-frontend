import Input from '@/components/ui/Input'
import TextArea from '@/components/ui/TextArea'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import CollaborationContact from './CollaborationContact'
import { CollaborationIcons } from '@/assets/icons/business/collaboration/Icons'
import CollaborationPreview from './CollaborationPreview'
import CollaborationAddTeamMember from './CollaborationAddTeamMember'
import Modal from '@/components/ui/Modal'
import CancleIcon from '@/assets/icons/CancelIcon'
import SearchGroup from '@/components/landing-page/savedBusinesses/SearchGroup'
import { Button } from '@/components/ui/Button'
import { BaseIcons } from '@/assets/icons/base/Icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import FeaturedListingCard from '@/components/cards/FeaturedListingCard'

const CollaborationCreationForm = (): JSX.Element => {

    const [addTeamMemberInput, setAddTeamMemberInput] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false);
    const COLLABORATIONCONTACTS = [
        {
            name: "John Maija",
            role: "owner",
            date: "12-04-2025",
            status: 1,
        },
        {
            name: "Ada Okonkwo",
            role: "Contributor",
            date: "12-04-2025",
            status: 0
        },
        {
            name: "Ada Okonkwo",
            role: "Contributor",
            date: "12-04-2025",
            status: 1
        },
        {
            name: "Ada Okonkwo",
            role: "Contributor",
            date: "12-04-2025",
            status: 1
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
    ];
    return (
        <section className='w-full flex justify-between'>
            <div className='sm:w-[624px]'>
                <Formik
                    initialValues={{ group_name: '', description: '' }}
                    //   validationSchema={loginSchema}
                    onSubmit={value => console.log(value)
                    }
                >
                    {({ errors, isSubmitting }) => (
                        <Form className='w-full'>

                            {errors.group_name} {errors.description}

                            {isSubmitting && "Loading"}

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
                        <h1 className='font-semibold mb-4'>Group Members</h1>

                        {/* fixed bar  */}
                        <div className='fixed'>
                            <div className='sm:w-[12px] sm:h-[255px] border-[1px] border-[#EEF2F6] rounded-lg'>
                                <div className='w-full sm:h-[148px] bg-[#F5F3FF] rounded-lg'>
                                </div>
                            </div>
                        </div>

                        {/* List team members  */}
                        <div className='flex flex-col gap-2 mb-4 pl-5'>
                            {COLLABORATIONCONTACTS.map((collaboration, key) => {
                                return <CollaborationContact key={key} status={collaboration.status} name={collaboration.name} date={collaboration.date} role={collaboration.role} styleProps='sm:w-[602px] sm:h-[58px]' />
                            })}
                        </div>
                    </div>

                    {/* Add team members button  */}
                    {addTeamMemberInput ?
                        <CollaborationAddTeamMember setAddTeamMemberInput={() => setAddTeamMemberInput(!addTeamMemberInput)} /> :
                        <button className="sm:h-[48px] sm:w-[195px] border-[1px] border-[#D9D6FE] bg-primary/10 text-primary text-[16px] flex items-center justify-center rounded-lg gap-2" onClick={() => setAddTeamMemberInput(!addTeamMemberInput)}> <p className='text-[14px]'>
                            Add team member</p> <CollaborationIcons value='plus-primary' />
                        </button>}


                </div>


                {/* Group Listings  */}
                <div>
                    <h1 className='font-semibold mb-4'>Group Listings</h1>
                    {/* Add team members button  */}
                    <button className="sm:h-[48px] sm:w-[147px] border-[1px] border-[#D9D6FE] bg-primary/10 text-primary text-[16px] flex items-center justify-center rounded-lg gap-2" onClick={() => {
                        setOpen(true)
                    }} > <p className='text-[14px]'>Add Listing</p> <CollaborationIcons value='plus-primary' />
                    </button>

                    {/* Modal  */}
                    <Modal isOpen={open} onClose={() => setOpen(false)} contentClassName=''>
                        <div className='w-[1232px] relative max-h-[605px] overflow-y-scroll bg-white rounded-xl border-[1px] border-[#EEF2F6] pl-3'>
                            <div className='relative'>
                                {/* fixed bar  */}
                                <div className='fixed pt-5'>
                                    <div className='sm:w-[14px] sm:h-[565px] border-[1px] border-[#EEF2F6] rounded-lg'>
                                        <div className='w-full sm:h-[334px] bg-[#F5F3FF] rounded-lg'>
                                        </div>
                                    </div>
                                </div>
                                <div className='pl-10 relative pr-6 '>
                                    <div className='flex bg-white z-10 fixed items-center justify-between w-[1155px] h-[90px]'>
                                        <h1 className='text-[24px] font-semibold'>Saved Businesses</h1>
                                        <div className='flex items-center gap-6'>
                                            <div className='flex items-center gap-3'>
                                                <span className='text-[#FEC601] font-semibold'> 0 selected </span>
                                                <span className='text-[#E3E8EF]'>|</span>
                                                <button className='text-[#9AA4B2] text-[16px]'>Clear</button>
                                            </div>
                                            <button onClick={() => setOpen(false)}><CancleIcon /></button>
                                        </div>
                                    </div>

                                    <div className='pt-24  max-h-[717px]'>
                                        <div className='flex justify-between items-center'>
                                            <div className="w-[558px]">
                                                <SearchGroup />
                                            </div>
                                            <Button className='w-[89px]'>Done</Button>
                                        </div>

                                        {/* listings  aorund you */}
                                        <div className='mt-10 relative sm:w-full flex w-full flex-col items-center justify-center'>
                                            <div className='flex w-full justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <BaseIcons value='beauty-outlined-primary' />
                                                    <h1 className='text-[16px] font-bold'>
                                                        Beauty & Personal Care
                                                    </h1>
                                                </div>
                                            </div>

                                            <div className=' flex items-center sm:w-[1155px] h-[400px] -mt-5'>
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
                                                    <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[100px] sm:h-[36px] sm:w-[36px] flex justify-center items-center bg-[#F8FAFC] rounded-full'>
                                                        <button className='saved-business-custom-prev rotate-180 transition-transform'>
                                                            <BaseIcons value='arrow-long-right-black' />
                                                        </button>
                                                    </div>

                                                    <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-[100px] sm:h-[36px] sm:w-[36px] flex justify-center items-center bg-[#F8FAFC] rounded-full'>
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
                                        <div className='mt:px-0 relative sm:w-[1155px] flex w-full flex-col items-center justify-center'>
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
            <div className='sm:w-[780px] sm:h-[866px] sm:-mt-14'>
                <CollaborationPreview />
            </div>
        </section>
    )
}

export default CollaborationCreationForm