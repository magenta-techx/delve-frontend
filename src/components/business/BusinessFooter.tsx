'use client';
import React from 'react';
import NewProductLaunchGraphics from '@/assets/graphics/NewProductLaunchGraphics';
import Link from 'next/link';
import InstagramIconBlack from '@/assets/icons/business/InstagramIconBlack';
import XIconBlack from '@/assets/icons/business/XIconBlack';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { Logo } from '@/assets/icons';

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
          ariaLabel: 'Visit Delve on Facebook',
        },
        {
          icon: <InstagramIconBlack />,
          href: '/',
          ariaLabel: 'Visit Delve on Instagram',
        },
        {
          icon: <XIconBlack />,
          href: '/',
          ariaLabel: 'Visit Delve on X',
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
    <footer className='w-full border-t border-[#EBEEF5] bg-white font-inter text-[#0F172B]'>
      <div className='mx-auto w-full max-w-screen-xl px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pb-16 lg:pt-14'>
        <div className='grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start'>
          <div className='flex max-w-xl flex-col gap-8'>
            <Link href="/">
              <Logo />
            </Link>
            <div className='overflow-hidden rounded-xl border border-[#EBEEF5] bg-[#F7F7FB] p-6 sm:p-8'>
              <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8'>
                <div className='mx-auto w-32 sm:mx-0 sm:w-40'>
                  <NewProductLaunchGraphics />
                </div>
               
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-12'>
            {FOOTER_LINKS.map(section => (
              <div key={section.id} className='min-w-[150px]'>
                <h3 className='mb-4 text-base font-semibold text-[#0F172B] sm:text-lg'>
                  {section.header}
                </h3>
                <ul
                  className={`flex ${section.id === 4 ? 'items-center gap-4' : 'flex-col gap-3 text-sm text-[#4B5565] sm:text-base'}`}
                >
                  {section.links.map((entry, index) => {
                    if ('text' in entry) {
                      return (
                        <li key={index}>
                          <Link
                            href={entry.href}
                            className='transition-colors hover:text-[#6E44FF]'
                          >
                            {entry.text}
                          </Link>
                        </li>
                      );
                    }
                    if ('icon' in entry) {
                      return (
                        <Link
                          href={entry.href}
                          key={index}
                          className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#EBEEF5] text-[#0F172B] transition-colors hover:border-[#6E44FF] hover:text-[#6E44FF]'
                          aria-label={entry.ariaLabel ?? 'Social link'}
                        >
                          {entry.icon}
                        </Link>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='border-t border-[#EBEEF5] bg-white'>
        <div className='mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-[#4B5565] sm:flex-row sm:px-6 lg:px-10'>
          <p className='order-2 sm:order-1'>2025 Delve.ng</p>
          <div className='order-1 flex items-center gap-2 text-[#A0A8B7] sm:order-2'>
            <span className='h-1 w-1 rounded-full bg-[#A0A8B7]' />
            <span>Built to connect businesses and customers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BusinessFooter;
