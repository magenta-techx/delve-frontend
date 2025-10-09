'use client';

import Link from "next/link";
import CancleIcon from "./CancelIcon";
import { Button } from "@/components/ui/Button";

interface MenuItemsProps {
  showMobileMenuItems?: boolean;
  setShowMobileMenuItems?: (value: boolean) => void
}
const MenuBarIcon = ({ showMobileMenuItems, setShowMobileMenuItems }: MenuItemsProps): JSX.Element => {
  const MOBILE_MENU_ITEMS = [
    {
      text: 'Home',
      href: '/',
    },
    {
      text: 'Listings',
      href: '/',
    },
    {
      text: 'Cities',
      href: '/',
    },
    {
      text: 'Blog',
      href: '/blogs',
    },
    {
      text: 'FAQ',
      href: '/',
    },
  ];

  return (
    <div className="">
      <Button
        onClick={() => {
          console.log('Clicked');
          setShowMobileMenuItems?.(!showMobileMenuItems);
        }}
        variant='ghost'
      >
        {showMobileMenuItems ? <CancleIcon /> : <svg
          width='18'
          height='14'
          viewBox='0 0 18 14'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M17 13H1M17 7H1M17 1H1'
            stroke='#0F0F0F'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>}
      </Button>


      {/* Mobile menu bar  */}
      <div className='sm:hidden '>


        {/* Mobile Menu items  */}
        {showMobileMenuItems && (
          <div className='absolute left-0 z-50 min-h-screen w-full bg-white px-5 pt-4 font-inter'>
            <div className='mb-4 flex flex-col gap-10 border-b-[1px] border-gray-300 pb-4'>
              {MOBILE_MENU_ITEMS.map((menu, key) => {
                return (
                  <Link key={key} href={menu.href} className='font-medium'>
                    {menu.text}
                  </Link>
                );
              })}
            </div>
            <Link href={'/'}>Logout</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBarIcon;
