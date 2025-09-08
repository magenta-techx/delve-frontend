'use client';
import React from 'react';
import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import Logo from '../ui/Logo';
import NewProductLaunchGraphics from '@/assets/graphics/NewProductLaunchGraphics';
import BusinessTextAndButton from './BusinessTextAndButton';
import Link from 'next/link';
import InstagramIconBlack from '@/assets/icons/business/InstagramIconBlack';
import XIconBlack from '@/assets/icons/business/XIconBlack';

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
          icon: <XIconBlack />,
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
    <div className='flex flex-col items-start gap-5 pb-36 font-inter sm:flex-row sm:gap-14 sm:px-20 sm:pt-16'>
      <div className='flex flex-col gap-0 bg-neutral px-20 sm:gap-3 sm:bg-transparent sm:px-0'>
        <div className='-mb-7 sm:-mb-0'>
          <Logo icon={<DefaultLogoTextIcon />} link='/' />
        </div>
        <div className='flex flex-col gap-5 rounded-md border-gray-200 py-8 sm:flex-row sm:items-center sm:border sm:px-4'>
          <NewProductLaunchGraphics />
          <BusinessTextAndButton
            header='Get discovered by customers.'
            text='Join hundreds of trusted vendors growing their business with delve.'
            buttonText='List your business'
            width='sm:w-[250px] w-full'
            buttonSize='sm'
            textClass='text-[12px] text-black mb-4'
            headerClass='text-sm font-semibold text-black mb-2'
          />
        </div>
      </div>
      <div className='flex flex-col items-start justify-between gap-10 px-20 sm:mt-5 sm:flex-row sm:px-0'>
        {FOOTER_LINKS.map((link, key) => {
          return (
            <div key={key}>
              <h3 className='mb-3 text-sm font-bold'>{link.header}</h3>
              <ul
                className={`flex ${link.id === 4 ? 'gap-5' : 'flex-col gap-3'} text-xs`}
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
    </div>
  );
};

export default BusinessFooter;
