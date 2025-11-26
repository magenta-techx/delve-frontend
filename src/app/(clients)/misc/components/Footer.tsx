'use client';
import React from 'react';
import NewProductLaunchGraphics from '@/assets/graphics/NewProductLaunchGraphics';
import Link from 'next/link';
import InstagramIconBlack from '@/assets/icons/business/InstagramIconBlack';
import XIconBlack from '@/assets/icons/business/XIconBlack';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { Logo } from '@/assets/icons';
import { usePathname } from 'next/navigation';
import { LinkButton } from '@/components/ui';

const Footer = () => {
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
          text: 'List your business',
          href: '/businesses',
        },
        {
          text: 'Privacy Policy',
          href: '/',
        },
        {
          text: 'FAQs',
          href: '/#faqs',
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
          text: 'Beauty',
          href: '/businesses/search?category=Beauty',
        },
        {
          text: 'Fashion',
          href: '/businesses/search?category=Fashion',
        },
        {
          text: 'Health & Wellness',
          href: '/businesses/search?category=Health',
        },
      ],
    },
    {
      id: 3,
      header: 'Popular location',
      links: [
        {
          text: 'Lagos',
          href: '/businesses/search?location=Lagos',
        },
        {
          text: 'Abuja',
          href: '/businesses/search?location=Abuja',
        },
        {
          text: 'Ibadan',
          href: '/businesses/search?location=Ibadan',
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
      ],
    },
  ];

  const pathname = usePathname();
  const PAGES_WITHOUT_NAVBAR = ['/businesses/create-listing', '/chats'];

  if (PAGES_WITHOUT_NAVBAR.some(path => pathname.startsWith(path))) {
    return null;
  }
  return (
    <footer className='w-full border-t font-inter text-[#0F172B] max-md:bg-[#F8FAFC] md:border-[#EBEEF5] md:bg-white'>
      <div className='container mx-auto grid w-full gap-12 pb-6 pt-10 md:px-8 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-start lg:pb-16 lg:pt-14'>
        <aside className='max-md: flex w-full flex-col gap-8 max-md:px-10 sm:px-6 md:max-w-xl'>
          <Link href='/'>
            <Logo textColor='black' className='w-24 max-sm:w-20' />
          </Link>
          <div className='flex flex-col items-start gap-4 overflow-hidden rounded-2xl sm:flex-row sm:items-center sm:gap-5 sm:p-6 lg:border lg:border-[#EBEEF5]'>
            <div className='w-32 sm:mx-0 sm:w-40 md:mx-auto'>
              <NewProductLaunchGraphics />
            </div>
            <div className='flex w-full flex-col items-start gap-2'>
              <h2 className='text-sm font-semibold text-[#0F172B] sm:text-base'>
                Get discovered by customers.
              </h2>
              <p className='text-xs leading-6 text-[#4B5565] sm:text-sm'>
                Join hundreds of trusted vendors growing their business with
                Delve.
              </p>
              <LinkButton
                size='md'
                href='/businesses/create-listing'
                className='mt-5'
              >
                List your business
              </LinkButton>
            </div>
          </div>
        </aside>

        <div className='grid grid-cols-1 gap-10 bg-white pt-6 font-inter max-md:px-10 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-3 lg:gap-12 2xl:grid-cols-4'>
          {FOOTER_LINKS.map(section => (
            <div key={section.id} className='min-w-[150px]'>
              <h3 className='mb-4 text-base font-semibold text-[#0F172B]'>
                {section.header}
              </h3>
              <ul
                className={`flex ${section.id === 4 ? 'items-center gap-4' : 'flex-col gap-3 text-sm text-[#4B5565]'}`}
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

      <div className='flex items-center justify-center border-t border-[#EBEEF5] bg-white'>
        <small className='mx-auto w-full gap-4 p-4 text-center text-xs text-[#4B5565] sm:flex-row sm:px-6 lg:px-10'>
          {new Date().getFullYear()} Delve.ng
        </small>
      </div>
    </footer>
  );
};

export default Footer;
