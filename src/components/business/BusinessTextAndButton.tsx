'use client';
import React from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';

interface BusinessTextAndButtonProps {
  text: string;
  textClass?: string;
  buttonText: string;
  width?: string;
  header?: string;
  headerClass?: string;
  link?: string;
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
}
const BusinessTextAndButton = ({
  text,
  textClass = 'sm:text-[14px] sm:mb-8 ',
  buttonText,
  buttonSize = 'default',
  header,
  headerClass,
  link = '',
  width = 'w-[280px]',
}: BusinessTextAndButtonProps): JSX.Element => {
  return (
    <div className={`${width} font-inter text-gray-600`}>
      {header && <h3 className={`${headerClass}`}>{header}</h3>}
      <p className={` ${textClass}`}>{text}</p>
      <div className='w-[52%] text-xs'>
        {' '}
        <Button asChild size={buttonSize}>
          <Link href={link} className='flex h-full items-center'>
            {buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BusinessTextAndButton;
