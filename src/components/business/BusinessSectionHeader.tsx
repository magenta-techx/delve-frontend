'use client';
import React from 'react';

interface BusinessSectionHeaderProps {
  text: string;
}

const BusinessSectionHeader = ({
  text,
}: BusinessSectionHeaderProps): JSX.Element => {
  return (
    <div className='flex w-full justify-center sm:px-0'>
      <h1 className='mb-10 w-full text-center font-karma text-3xl sm:w-[800px] sm:text-3xl sm:font-semibold'>
        {text}
      </h1>
    </div>
  );
};

export default BusinessSectionHeader;
