
'use client'
import { BaseIcons } from '@/assets/icons/base/Icons';
import { BusinessCategoryIcons, IconsType } from '@/assets/icons/business/BusinessCategoriesIcon';
import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';
import SponsoredCard from '@/components/cards/SponsoredCard';

import Navbar from '@/components/Navbar';

// import type { Metadata } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface statesProps {
    id: number;
    name: string
}


export default function HomePage(): JSX.Element {


    const [selectedCategory, setSelectedCategory] = useState<number>(1)
    const [states, setStates] = useState<statesProps[]>([])
    const [categories, setCategories] = useState<statesProps[]>([])
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
            <Navbar type='blog' authFormButtons={false} />


            {/* Content  */}
            <div className='flex gap-[128px] relative w-[1488px] justify-end mt-20 mb-44'>
                <div className='w-[208px] left-0 flex flex-col gap-4'>

                    <h1 className='font-semibold text-[24px] mb-4 font-inter'>Filter Search</h1>

                    <div className='rounded-lg px-2 flex  w-full items-center gap-2 py-3 bg-[#F8FAFC] border-1 border-[#E3E8EF]'>
                        <div>
                            <BaseIcons value='search-black' />
                        </div>
                        <input className='outline-none bg-transparent' placeholder='Search' />
                    </div>
                    <div className=''>
                        {CATEGORIES.map((category) => {


                            return (<div key={category.id} className='border-b-[1px] border-[#E3E8EF] pt-5 max-h-[400px] overflow-y-scroll'>
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
                <div className='w-[1852px]'>
                    <div className='flex items-center gap-2'>
                        <BaseIcons value='stars-primary' />
                        <h1 className='text-2xl font-bold'>{CATEGORIES[selectedCategory - 1]?.headerText}</h1>
                    </div>


                    {/* Featured  */}
                    {selectedCategory === 1 && <div className='flex flex-col items-center py-10 max-h-[1200px] overflow-y-scroll'>
                        <div className='-ml-11'>
                            <div className='flex justify-between'>
                                <div className='flex items-center gap-2'>
                                    <BaseIcons value='flame-yellow-small' />
                                    <h1 className='text-xl font-bold'>Featured</h1>
                                </div>

                            </div>
                            <div className='mt-5 grid grid-cols-3 gap-10 mb-20'>
                                {LISTINGS_AROUND.map((listing, key) => {
                                    return (
                                        <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} classStyle={'h-[400px] w-[320px]'} />
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
                    </div>}

                    {
                        selectedCategory === 3 && <div className='w-full flex items-center gap-2 mt-10 justify-center'>
                            <SponsoredCard imageUrl={'/filters/category-filter-1.jpg'} href={'/'} styleProps='w-[365px] h-[470px]' />
                            <SponsoredCard imageUrl={'/filters/category-filter.jpg'} href={'/'} styleProps='w-[365px] h-[470px]' />
                            <SponsoredCard imageUrl={'/filters/category-filter-1.jpg'} href={'/'} styleProps='w-[365px] h-[470px]' />
                        </div>
                    }
                </div>
            </div>

            {/* Image banner   */}
            <div className='w-full h-[217px]'>
                <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full' quality={100} />
            </div>

            <BusinessFooter />

        </main>
    );
}
