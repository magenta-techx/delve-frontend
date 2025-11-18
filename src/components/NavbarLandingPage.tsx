'use client';

import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import MenuBarIcon from '@/assets/icons/MenuBarIcon';
import Link from 'next/link';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
// import Loader from '../ui/Loader';
import DefaultLogoTextIconWhite from '@/assets/icons/logo/DefaultLogoTextIconWhite';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown';

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

const NavbarLandingPage = ({
  categories,
  // isLoadingcategories,
}: NavbarProps) => {

  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';
  const userIsloggedIn = status === 'authenticated' && Boolean(session?.user);
  const [showMobileMenuItems, setShowMobileMenuItems] =
    useState<boolean>(false);
  // Dropdown state handled by Radix primitives

  const IS_LOGGED_IN_BUTTON = [
    { icon: 'listing' as IconsType, href: '/' },
    { icon: 'saved' as IconsType, href: '/' },
    { icon: 'chat' as IconsType, href: '/' },
    { icon: 'notification' as IconsType, href: '/' },
  ];

  // Top-level links for the dropdown (kept simple)
  const BLOG_LINK = '/blogs';
  const FAQ_LINK = '/faq';
  const PROFILE_SETTINGS_LINK = '/dashboard/settings';

  return (
    <div className='mb-5 w-full sm:bg-black/10 backdrop-blur-sm flex items-center justify-center '>
      {/* bg-black/10 backdrop-blur-sm  */}
      <div className='sm:w-[1640px] flex items-center w-full'>
        <div className='flex w-full items-center justify-between px-5 pt-10 sm:-mb-0 sm:pb-5'>
          <div className='h-full w-full'>
            <div className='hidden sm:flex'>
              <DefaultLogoTextIconWhite />
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
          {userIsloggedIn && !isLoadingSession && (
            <div className='hidden sm:flex'>
              <div className='flex items-center gap-4 text-white'>
                <div className='flex items-center gap-4'>
                  {IS_LOGGED_IN_BUTTON.map((link, key) => (
                    <Link
                      key={key}
                      href={link.href}
                      className='flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF4D] p-2'
                    >
                      <BaseIcons value={link.icon} />
                    </Link>
                  ))}
                </div>
                <BaseIcons value='vertical-line-white' />

                {/* Dropdown trigger */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='flex items-center gap-1 rounded-full px-2 py-1 hover:bg-white/20 !cursor-pointer'>
                      <BaseIcons value='user-logged-in-white' />
                      {session?.user.name && (
                        <p className='ml-1 w-[120px] truncate text-left font-semibold capitalize'>
                          {session?.user.name} BOLA
                        </p>
                      )}
                      <BaseIcons value='arrow-down-white' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-72'>
                    <DropdownMenuLabel>
                      Signed in as
                      <span className='block truncate font-medium text-gray-900'>
                        {session?.user.email ?? session?.user.name}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Listing submenu using categories */}
                    {Array.isArray(categories) && categories.length > 0 && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span className='flex items-center gap-2'>
                            <BaseIcons value='listing' />
                            <span>Listings</span>
                          </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className='w-64'>
                          {categories.slice(0, 12).map((cat) => (
                            <DropdownMenuItem key={cat.id} asChild>
                              <Link href={`/explore?categoryId=${cat.id}`} className='flex w-full items-center gap-2'>
                                <span className='truncate'>{cat.name}</span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={'/explore'} className='text-primary'>Explore all categories</Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    )}

                    <DropdownMenuItem asChild>
                      <Link href={BLOG_LINK}>
                        <span className='flex items-center gap-2'>Blog</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={FAQ_LINK}>
                        <span className='flex items-center gap-2'>FAQ</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={PROFILE_SETTINGS_LINK}>
                        <span className='flex items-center gap-2'>Profile settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); signOut({ callbackUrl: '/' }); }}>
                      <span className='flex w-full items-center gap-2 text-red-600'>
                        <BaseIcons value='logout-black' /> Logout
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarLandingPage;
