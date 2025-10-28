'use client';

import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import MenuBarIcon from '@/assets/icons/MenuBarIcon';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/Button';
import { useSession } from 'next-auth/react';
import ListingUserMenuExtension from '../landing-page/UserMenuExtensions/ListingUserMenuExtension';

import { BaseIcons } from '@/assets/icons/base/Icons';
import Loader from '../ui/Loader';
import { IconsType, NavbarIcons } from '@/assets/icons/navbar/NavbarIcons';
// import DefaultLogoTextIconWhite from '@/assets/icons/logo/DefaultLogoTextIconWhite'; 

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
interface NavbarProps {
    type?: string;
    navbarWidthDeskTop?: string;
    authFormButtons?: boolean;
    isLoadingcategories?: boolean;
    categories?: Category[];
}

const NavbarWhiteBg = ({
    categories,
    isLoadingcategories,
}: NavbarProps): JSX.Element => {
    const USER_MENU_EXTENSIONS: { [key: string]: ReactNode } = {
        listing: <ListingUserMenuExtension categories={categories} />,
        // Add other menu extensions here
    };

    const userIsloggedIn = useSelector(
        (state: RootState) => state.business.userIsLoggedIn
    );

    const { data: session } = useSession();
    const [showMobileMenuItems, setShowMobileMenuItems] =
        useState<boolean>(false);
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
    const [currentUserMenuExtension, setCurrentUserMenuExtension] =
        useState<string>('');

    const IS_LOGGED_IN_BUTTON = [
        { icon: 'shop-solid-black' as IconsType, href: '/' },
        { icon: 'bookmark-add-solid-black' as IconsType, href: '/' },
        { icon: 'message-solid-black' as IconsType, href: '/' },
        { icon: 'notification-solid-black' as IconsType, href: '/' },
    ];

    const USER_MENU_ITEMS = [
        {
            text: 'Home',
            dropDown: false,
            href: '/',
        },
        {
            text: 'listing',
            dropDown: true,
            href: '/',
        },
        {
            text: 'cities',
            dropDown: true,
            href: '/',
        },
        {
            text: 'blog',
            dropDown: false,
            href: '/',
        },
        {
            text: 'FAQ',
            dropDown: false,
            href: '/',
        },
    ];

    const handleUsermMenuExtension = (menu: string): void => {
        setCurrentUserMenuExtension(menu);
        // setShowUserMenu(true);
    };
    return (
        <div className='mb-5 w-full flex items-center justify-center '>
            {/* bg-black/10 backdrop-blur-sm  */}
            <div className='sm:w-[1600px] sm:pr-10 flex items-center w-full'>
                <div className='flex w-full items-center justify-between px-5 pt-10 sm:-mb-0 sm:pb-5'>
                    <div className='h-full w-full'>
                        <div className='hidden sm:flex'>
                            {/* <DefaultLogoTextIconWhite /> */}
                            <DefaultLogoTextIcon />
                        </div>
                        <div className='flex h-[19.22px] w-[80px] items-center justify-center sm:hidden'>
                            <DefaultLogoTextIcon />
                        </div>
                    </div>
                    <div className='flex sm:hidden'>
                        <MenuBarIcon
                            showMobileMenuItems={showMobileMenuItems}
                            setShowMobileMenuItems={setShowMobileMenuItems}
                        />
                    </div>
                </div>

                <div>
                    {/* Logged in user in Landing Page  */}
                    {userIsloggedIn && (
                        <div className='hidden sm:flex'>
                            <div className='flex items-center gap-4 text-white'>
                                <div className='flex items-center gap-4'>
                                    {IS_LOGGED_IN_BUTTON.map((link, key) => {
                                        return (
                                            <Link
                                                key={key}
                                                href={link.href}
                                                className='flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF4D] p-2'
                                            >
                                                <NavbarIcons value={link.icon} />
                                            </Link>
                                        );
                                    })}
                                </div>
                                <BaseIcons value='vertical-line-white' />

                                <div className='flex items-center gap-1'>
                                    <NavbarIcons value='user-settings-solid-black' />
                                    {session?.user.name && (
                                        <p className='ml-1 w-[85px] text-black truncate font-semibold capitalize'>
                                            {session?.user.name}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => {
                                            setCurrentUserMenuExtension('');
                                            setShowUserMenu(!showUserMenu);
                                        }}
                                    >
                                        <NavbarIcons value='caret-down-black' />
                                    </button>
                                </div>
                            </div>


                        </div>
                    )}
                </div>


                {/* user menu  */}
                {showUserMenu && (
                    <div className='absolute right-20 top-20 z-20 flex w-[300px] flex-col gap-4 rounded-lg bg-white font-inter text-black shadow-md'>
                        <div className='mb-3 rounded-tl-lg rounded-tr-lg bg-[#F8FAFC] px-5 py-6'>
                            <Link
                                href={'/business/get-started'}
                                className='flex h-14 w-[180px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white'
                            >
                                <span> List business</span>
                                <BaseIcons value='arrow-diagonal-white' />
                            </Link>
                        </div>
                        <div className='flex flex-col gap-6 px-5 pb-5'>
                            {USER_MENU_ITEMS.map((menu, key) => {
                                return menu.dropDown ? (
                                    <button
                                        key={key}
                                        className='flex items-center gap-2'
                                        onClick={() => handleUsermMenuExtension(menu.text)}
                                    >
                                        <span>{menu.text} </span>{' '}
                                        {menu.dropDown && (
                                            <BaseIcons value='arrow-down-black' />
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        key={key}
                                        href={menu.href}
                                        className='flex items-center gap-2'
                                    >
                                        <span className='capitalize'>{menu.text}</span>
                                    </Link>
                                );
                            })}

                            <Link
                                href={'/'}
                                className='text-md -mt-4 flex items-center gap-1 py-3'
                            >
                                <BaseIcons value='logout-black' />
                                <span> Profile settings</span>
                            </Link>

                            <Button
                                variant='neutral'
                                className='text-md -mt-2 flex items-center gap-1 py-3'
                            >
                                <BaseIcons value='logout-black' />
                                <span> Logout</span>
                            </Button>
                        </div>
                    </div>
                )} </div>


            {USER_MENU_EXTENSIONS[currentUserMenuExtension] && showUserMenu && (
                <div className='absolute left-[10%] top-14 z-20 rounded-lg bg-white px-8 py-6 shadow-lg'>
                    <p className='mb-1'>
                        {' '}
                        Discover a world of businesses and services acrosslifestyle,ellness,
                        fashion, food, tech, and more.
                    </p>
                    <div className='w-[136px] border-b-[1px] border-b-primary'>
                        <Link
                            href={'/explore'}
                            className='flex items-center gap-1 text-primary'
                        >
                            <p>Explore all cities</p>
                            <span className='inline-block -rotate-45'>
                                <BaseIcons value='arrow-diagonal-right-primary' />
                            </span>
                        </Link>
                    </div>
                    {isLoadingcategories ? (
                        <div className='mt-8'>
                            <Loader borderColor='border-primary' />{' '}
                        </div>
                    ) : (
                        USER_MENU_EXTENSIONS[currentUserMenuExtension]
                    )}
                </div>
            )}
        </div>
    );
};

export default NavbarWhiteBg;
