
'use client'
import { GraphicsBaseIcons } from '@/assets/graphics/GraphicsBaseIcons';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { BusinessCategoryIcons, IconsType } from '@/assets/icons/business/BusinessCategoriesIcon';
import CancleIcon from '@/assets/icons/CancelIcon';
import { TempBaseIcons } from '@/assets/icons/temporary/Icons';
import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';
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
    name: string
}


export default function HomePage(): JSX.Element {


    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const [states, setStates] = useState<statesProps[]>([])
    const [categories, setCategories] = useState<statesProps[]>([])
    const [showMobileNavBar, setShowMobileNavbar] = useState<boolean>(false)
    const CATEGORIES = [
        {
            id: 1,
            text: 'By States',
            headerText: 'All city',
            subCategories: states
        },
        {
            id: 2,
            headerText: "Category",
            text: 'Category',
            subCategories: categories
        },
        {
            id: 3,
            headerText: "Sponsored ads",
            text: 'Sponsored',
            subCategories: []
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

    ]
    // const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async (): Promise<void> => {

            try {
                const res = await fetch(`/api/business/business-categories`);
                if (!res.ok) return;

                const data = await res.json();
                console.log("Categories Data: ", data);

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
                console.log("State data: ", data);
                setStates(data?.data)

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
            <div className={`flex sm:gap-[128px] gap-10 flex-col sm:flex-row relative sm:w-[1488px] w-full sm:min-h-[70vh] h-full sm:justify-end sm:mt-10 ${selectedCategory !== 0 ? 'sm:mb-44' : ''}`}>

                {/* Side bar  */}

                <div className='w-full sm:w-[208px] sm:left-0 flex sm:flex-col px-4 sm:px-0 items-center sm:items-start gap-4'>

                    <button className='sm:hidden flex' onClick={() => {
                        console.log("Clicked");
                        setShowMobileNavbar(!showMobileNavBar)
                    }}>
                        <BaseIcons value='filter-outlined-black' />
                    </button>

                    <h1 className='sm:font-semibold sm:text-[24px] text-[16px] sm:mb-4 font-inter flex gap-3'>Filter <span className='hidden sm:flex'>Search</span></h1>

                    <div className='sm:rounded-lg sm:px-2 px-4 flex  w-full items-center gap-2 sm:py-3 py-2 bg-[#F8FAFC] border-1 border-[#E3E8EF] sm:border-none border-[1px] rounded-xl'>
                        <div>
                            <BaseIcons value='search-black' />
                        </div>
                        <input className='outline-none bg-transparent' placeholder='Search' />
                    </div>
                    <div className='sm:flex flex-col hidden w-full'>
                        {CATEGORIES.map((category) => {
                            return (<div key={category.id} className={`border-b-[1px] border-[#E3E8EF] pt-5 max-h-[400px] overflow-y-scroll`}>
                                <button className='font-medium mb-5 flex w-full items-center justify-between' onClick={() => setSelectedCategory(category.id)}>
                                    <span className={`${category.id === selectedCategory ? 'text-[#697586]' : 'text-black'}`}>{category.text}</span> {category.id != 3 && <BaseIcons value={category.id === selectedCategory ? 'arrow-down-black' : 'arrow-right-black'} />}
                                </button>

                                <div className={`flex flex-col gap-3 items-start ${category.id === selectedCategory && category.subCategories.length ? 'pb-3' : ''}`}>
                                    {selectedCategory === category.id && category.subCategories.map((subCategory) => {
                                        const icon = category.id === 2 ?
                                            subCategory?.name.split(' ')[0]
                                                ?.toLowerCase() as IconsType : 'shopping'
                                        return <button key={subCategory.id} className='flex items-center gap-1 truncate w-[] capitalize'>{category.id === 2 && < BusinessCategoryIcons value={icon} />} {subCategory.name.toLowerCase()}</button>
                                    })}
                                </div>
                            </div>
                            )

                        })}
                    </div>
                </div>

                {/* Content  */}
                <div className={`sm:w-[1852px] relative w-full ${selectedCategory === 0 ? 'h-[80vh]' : 'min-h-screen'} sm:min-h-screen`}>
                    {selectedCategory !== 0 && <div className='flex items-center gap-2 sm:px-0 px-4'>
                        <BaseIcons value='stars-primary' />
                        <h1 className='text-[18px] sm:text-2xl font-bold'>{CATEGORIES[selectedCategory - 1]?.headerText}</h1>
                    </div>}


                    {/* Empty business listings  */}
                    {selectedCategory === 0 && <div className=' w-full sm:max-h-[40vh] min-h-[60vh] flex items-center sm:justify-start sm:mt-40 justify-center flex-col'>
                        <div className='flex items-center justify-center flex-col gap-4 px-20'>
                            <div className='sm:hidden flex'>

                                <GraphicsBaseIcons value='empty-business-listing' />
                            </div>
                            <div className='sm:flex hidden'>
                                <GraphicsBaseIcons value='empty-business-listing-desktop' />

                            </div>
                            <p className='text-[14px] text-center'>Oops! There are no business listings in this location right now.</p>
                            <div className='w-[120px] sm:hidden flex'>
                                <Button size='sm' onClick={() => console.log("clicked")
                                }>Explore Listings</Button>
                            </div>
                        </div>
                        <div className='absolute rounded-tr-2xl rounded-tl-2xl bg-[#FBFAFF] h-[80px] w-full bottom-0 sm:hidden flex items-center justify-between px-10'>
                            <TempBaseIcons value='market-primary-solid' />
                            <TempBaseIcons value='bookmark-black-solid' />
                            <TempBaseIcons value='chat-black-solid' />
                            <TempBaseIcons value='bell-black-solid' />
                        </div>
                    </div>}

                    {/* Featured  */}
                    {selectedCategory === 1 && <div className='flex flex-col items-center sm:py-10 py-5 sm:max-h-[1200px] min-h-screen sm:overflow-y-scroll'>

                        {/* Desktop  */}
                        <div className='sm:flex flex-col hidden'>
                            <div className='flex justify-between'>
                                <div className='flex items-center gap-2'>
                                    <BaseIcons value='flame-yellow-small' />
                                    <h1 className='text-xl font-bold'>Featured</h1>
                                </div>

                            </div>
                            <div className='mt-5 grid grid-cols-3 gap-5 mb-20'>
                                {LISTINGS_AROUND.map((listing, key) => {
                                    return (
                                        <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} classStyle={'h-[461px] w-[352px]'} />
                                    )
                                })}
                            </div>
                            <div className='mb-20 flex justify-center w-full  -mt-5'>
                                <div className='w-[150px]'>
                                    <button className='text-black bg-white rounded-md hover:bg-primary/50 px-[23px] font-medium text-lg py-3 bg-neutral text-neutral-foreground border border-neutral-200'>
                                        Show more
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile  */}
                        <div className='w-full flex flex-col sm:hidden items-center justify-center relative '>
                            <div className='flex justify-between w-full px-4 sm:px-0'>
                                <div className='flex items-center gap-2'>
                                    <BaseIcons value='flame-yellow-small' />
                                    <h1 className='text-[16px] font-bold'>Featured</h1>
                                </div>
                            </div>

                            <div className='flex -mt-16 items-center w-[400px]'>
                                <Swiper
                                    centerInsufficientSlides={false}
                                    scrollbar={false}
                                    onSwiper={(swiper) => console.log(swiper)}
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
                                            <SwiperSlide key={key} className='flex pl-7 items-center pt-10 justify-center'>
                                                <div className='w-full flex items-center sm:justify-center -ml-5 sm:-ml-0'>
                                                    <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'w-[255px] h-[237px]'} />

                                                </div>
                                            </SwiperSlide>
                                        )
                                    })}

                                </Swiper>
                            </div>
                        </div>

                        {/* Explore   */}
                        <div className='flex flex-col items-center sm:hidden'>
                            <div>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-2'>

                                        <h1 className='text-[16px] sm:text-2xl font-bold'>Explore</h1>
                                    </div>

                                </div>
                                <div className='mt-5 grid min-h-screen relative grid-cols-1 sm:gap-10 gap-4'>
                                    {LISTINGS_AROUND.map((listing, key) => {
                                        return (
                                            <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'sm:h-[477px] sm:w-[370px] w-[352px] h-[237px]'} />
                                        )
                                    })}
                                </div>
                            </div>
                            <button className='text-black px-[38px] text-lg py-4 flex flex-col items-center justify-center'>
                                More
                                <BaseIcons value='arrow-long-down-black' />
                            </button>
                        </div>
                    </div>}

                    {
                        selectedCategory === 3 && <div className='w-full sm:flex hidden items-center gap-2 mt-10 justify-center'>
                            <SponsoredCard imageUrl={'/filters/category-filter-1.jpg'} href={'/'} styleProps='w-[365px] h-[470px]' />
                            <SponsoredCard imageUrl={'/filters/category-filter.jpg'} href={'/'} styleProps='w-[365px] h-[470px]' />
                            <SponsoredCard imageUrl={'/filters/category-filter-1.jpg'} href={'/'} styleProps='w-[365px] h-[470px]' />
                        </div>
                    }

                </div>

            </div>

            {selectedCategory === 0 && <div className='w-full sm:h-[217px] hidden sm:flex'>
                <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full sm:flex hidden' quality={100} />

                <Image src={'/landingpage/footer-image-mobile-2.jpg'} alt='' width={700} height={400} className='w-full h-full flex sm:hidden' quality={100} />
            </div>}

            {/* Mobile Menu Items  */}
            {
                showMobileNavBar && <div className='absolute w-full px-5 py-10 left-0 h-[100%] z-50 top-0 bg-white flex gap-10 flex-col'>

                    <div className='flex items-center justify-between'>
                        <h1 className='font-extrabold text-[18px]font-inter flex gap-3'>Filter Search</h1>

                        <button className='sm:hidden items-center gap-2 flex' onClick={() => {
                            console.log("Clicked");
                            setShowMobileNavbar(!showMobileNavBar)
                        }}>
                            <p className='text-[#697586] text-sm'>Cancel</p>
                            <CancleIcon />
                        </button>

                    </div>

                    <div className='sm:rounded-lg sm:px-2 px-4 flex  w-full items-center gap-2 sm:py-3 py-2 bg-[#F8FAFC] border-1 border-[#E3E8EF] sm:border-none border-[1px] rounded-xl'>
                        <div>
                            <BaseIcons value='search-black' />
                        </div>
                        <input className='outline-none bg-transparent' placeholder='Search' />
                    </div>
                    {CATEGORIES.map((category) => {
                        return (<div key={category.id} className='border-b-[1px] border-[#E3E8EF] max-h-[400px] overflow-y-scroll'>
                            <button className='font-medium mb-5 flex w-full items-center justify-between' onClick={() => setSelectedCategory(category.id)}>
                                <span className={`text-[#697586] text-sm`}>{category.text}</span> {category.id != 3 && <BaseIcons value='arrow-down-black' />}
                            </button>

                            <div className={`flex flex-col gap-3 items-start ${category.id === selectedCategory && category.subCategories.length ? 'pb-3' : ''}`}>
                                {category.subCategories.map((subCategory) => {
                                    const icon = category.id === 2 ?
                                        subCategory?.name.split(' ')[0]
                                            ?.toLowerCase() as IconsType : 'shopping'
                                    return <button key={subCategory.id} className='flex items-center gap-1 truncate w-[] capitalize'>{category.id === 2 && < BusinessCategoryIcons value={icon} />} {subCategory.name.toLowerCase()}</button>
                                })}
                            </div>
                        </div>
                        )

                    })}
                </div>
            }

            {selectedCategory !== 0 && <div className="sm:hidden flex w-full"> <UpComingEvents /></div>}
            {/* Image banner   */}
            {selectedCategory !== 0 && <div className='w-full sm:h-[217px]'>
                <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full sm:flex hidden' quality={100} />

                <Image src={'/landingpage/footer-image-mobile-2.jpg'} alt='' width={700} height={400} className='w-full h-full flex sm:hidden' quality={100} />
            </div>}

            {selectedCategory !== 0 && <BusinessFooter />}

        </main>
    );
}
