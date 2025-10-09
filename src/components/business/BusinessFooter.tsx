'use client';
import React from 'react';
import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import Logo from '../ui/Logo';
import NewProductLaunchGraphics from '@/assets/graphics/NewProductLaunchGraphics';
import BusinessTextAndButton from './BusinessTextAndButton';
import Link from 'next/link';
import InstagramIconBlack from '@/assets/icons/business/InstagramIconBlack';
import XIconBlack from '@/assets/icons/business/XIconBlack';
import { BaseIcons } from '@/assets/icons/base/Icons';

const BusinessFooter = (): JSX.Element => {
  const FOOTER_LINKS = [
    {
      id: 1,
      header: 'Quick Links',
      links: [
        {
          text: 'About Us',
          href: '/',
        },
        {
          text: 'Browse Vendors',
          href: '/',
        },
        {
          text: 'List your business',
          href: '/',
        },
        {
          text: 'Privacy Policy',
          href: '/',
        },
        {
          text: 'Frequently asked questions',
          href: '/',
        },
        {
          text: 'Terms of use',
          href: '/',
        },
      ],
    },
    {
      id: 2,
      header: 'Popular category',
      links: [
        {
          text: 'Food',
          href: '/',
        },
        {
          text: 'Fashion',
          href: '/',
        },
        {
          text: 'Wellness',
          href: '/',
        },
      ],
    },
    {
      id: 3,
      header: 'Popular location',
      links: [
        {
          text: 'Lagos',
          href: '/',
        },
        {
          text: 'Abuja',
          href: '/',
        },
        {
          text: 'Ibadan',
          href: '/',
        },
      ],
    },
    {
      id: 4,
      header: 'Connect with us',
      links: [
        {
          icon: <BaseIcons value='facebook-black' />,
          href: '/',
        },
        {
          icon: <InstagramIconBlack />,
          href: '/',
        },
        {
          icon: <XIconBlack />,
          href: '/',
        },

        // {

        //  icon
        // },
        // {

        //  icon
        // },
      ],
    },
  ];
  return (
    <div className='flex w-full flex-col items-center justify-center gap-5 pb-0 font-inter sm:flex-row sm:gap-[170px] sm:px-44 sm:pb-36 sm:pt-24'>
      <div className='flex flex-col gap-0 bg-neutral px-4 sm:gap-3 sm:bg-transparent sm:px-0'>
        <div className='-mb-7 sm:-mb-0'>
          <Logo icon={<DefaultLogoTextIcon />} link='/' />
        </div>
        <div className='flex flex-col gap-5 rounded-md border-gray-200 py-8 sm:w-[483px] sm:flex-row sm:items-center sm:border sm:px-4'>
          <NewProductLaunchGraphics />
          <BusinessTextAndButton
            header='Get discovered by customers.'
            text='Join hundreds of trusted vendors growing their business with delve.'
            buttonText='List your business'
            width='sm:w-[280px] w-full'
            buttonSize='lg'
            btnClassName='lg:text-xs'
            textClass='text-[15px] text-black mb-4'
            headerClass='text-[18px] font-semibold text-black mb-2'
          />
        </div>
      </div>
      <div className='mb-20 flex w-full flex-col items-start justify-between gap-10 px-4 sm:mt-5 sm:flex-row sm:gap-24 sm:px-0'>
        {FOOTER_LINKS.map((link, key) => {
          return (
            <div key={key} className='w-full sm:w-[200px]'>
              <h3 className='mb-3 text-[16px] font-bold sm:text-[18px]'>
                {link.header}
              </h3>
              <ul
                className={`flex ${link.id === 4 ? 'gap-5' : 'flex-col gap-3'} text-[16px]`}
              >
                {link.links.map((subLink, key) => {
                  if ('text' in subLink) {
                    return (
                      <li key={key}>
                        <Link href={subLink.href}>{subLink.text}</Link>
                      </li>
                    );
                  } else if ('icon' in subLink) {
                    return (
                      <Link href={subLink.href} key={key} className=''>
                        {subLink.icon}
                      </Link>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className='mb-4 flex items-center justify-center text-xs sm:hidden'>
        <p>2025 Delve.ng</p>
      </div>
    </div>
  );
};

export default BusinessFooter;
