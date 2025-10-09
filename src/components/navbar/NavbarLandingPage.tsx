'use client'

import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon'
import MenuBarIcon from '@/assets/icons/MenuBarIcon'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '../ui/Button'
import { useSession } from 'next-auth/react'
import ListingUserMenuExtension from '../landing-page/UserMenuExtensions/ListingUserMenuExtension'

import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
import Loader from '../ui/Loader'
import DefaultLogoTextIconWhite from '@/assets/icons/logo/DefaultLogoTextIconWhite'


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
  categories?: Category[]
}

const NavbarLandingPage = ({ categories, isLoadingcategories }: NavbarProps): JSX.Element => {

  const USER_MENU_EXTENSIONS: { [key: string]: ReactNode } = {
    listing: <ListingUserMenuExtension categories={categories} />,
    // Add other menu extensions here
  };

  const userIsloggedIn = useSelector(
    (state: RootState) => state.business.userIsLoggedIn
  );

  const { data: session } = useSession();
  const [showMobileMenuItems, setShowMobileMenuItems] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [currentUserMenuExtension, setCurrentUserMenuExtension] = useState<string>('');

  const IS_LOGGED_IN_BUTTON = [
    { icon: 'listing' as IconsType, href: '/' },
    { icon: 'saved' as IconsType, href: '/' },
    { icon: 'chat' as IconsType, href: '/' },
    { icon: 'notification' as IconsType, href: '/' },
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
  }
  return (
    <div className='w-full mb-5 '>
      {/* bg-black/10 backdrop-blur-sm  */}
      <div className='flex items-center sm:-mb-0  justify-between w-full px-5 pt-10 sm:pb-5'>
        <div className='h-full w-full'>
          <div className='hidden sm:flex'>
            <DefaultLogoTextIconWhite />
          </div>
          <div className='sm:hidden flex items-center justify-center w-[80px] h-[19.22px]'>
            <DefaultLogoTextIcon />
          </div>

        </div>
        <div className='sm:hidden flex'>
          <MenuBarIcon showMobileMenuItems={showMobileMenuItems} setShowMobileMenuItems={setShowMobileMenuItems} />
        </div>
      </div>


      <div>
        {/* Logged in user in Landing Page  */}
        {userIsloggedIn && (
          <div>
            <div className='flex items-center gap-4 text-white'>
              <div className='flex items-center gap-4'>
                {IS_LOGGED_IN_BUTTON.map((link, key) => {
                  return (
                    <Link
                      key={key}
                      href={link.href}
                      className='flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF4D] p-2'
                    >
                      <BaseIcons value={link.icon} />

                    </Link>
                  );
                })}
              </div>
              <BaseIcons value='vertical-line-white' />

              <div
                className='flex items-center gap-1'

              >
                <BaseIcons value='user-logged-in-white' />
                {session?.user.name && (
                  <p className='ml-1 w-[85px] truncate font-semibold capitalize'>
                    {session?.user.name}
                  </p>
                )}
                <button onClick={() => {

                  setCurrentUserMenuExtension('')
                  setShowUserMenu(!showUserMenu)
                }}>
                  <BaseIcons value='arrow-down-white' />
                </button>
              </div>
            </div>

            {/* user menu  */}
            {showUserMenu && (
              <div className='absolute -right-20 top-20 z-20 flex w-[300px] flex-col gap-4 rounded-lg bg-white font-inter text-black shadow-md'>
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
                      <button key={key} className='flex items-center gap-2' onClick={() => handleUsermMenuExtension(menu.text)}>
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
                    className='text-md flex items-center -mt-2 gap-1 py-3'
                  >
                    <BaseIcons value='logout-black' />
                    <span> Logout</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {USER_MENU_EXTENSIONS[currentUserMenuExtension] && showUserMenu && (
        <div className="absolute top-14 left-[10%] z-20 bg-white py-6 px-8 shadow-lg rounded-lg">
          <p className='mb-1'> Discover a world of businesses and services acrosslifestyle,ellness, fashion, food, tech, and more.</p>
          <div className='border-b-primary border-b-[1px] w-[136px]'>
            <Link href={'/explore'} className="text-primary flex items-center gap-1">
              <p>Explore all cities</p>
              <span className="inline-block -rotate-45">
                <BaseIcons value="arrow-diagonal-right-primary" />
              </span>

            </Link>
          </div>
          {isLoadingcategories ? <div className='mt-8'><Loader borderColor='border-primary' /> </div> : USER_MENU_EXTENSIONS[currentUserMenuExtension]}
        </div>
      )}
    </div>
  )
}

export default NavbarLandingPage