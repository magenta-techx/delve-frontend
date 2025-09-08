'use client';

import React from 'react';

interface BusinessIntroductionFormHeaderProps {
  intro?: string;
  header: string;
  paragraph: string;
}
const BusinessFormHeader = ({
  intro,
  header,
  paragraph,
}: BusinessIntroductionFormHeaderProps): JSX.Element => {
  return (
    <div className='flex flex-col gap-1'>
      <small className='mb-2 font-inter'>{intro}</small>
      <h1 className='font-karma text-2xl font-semibold'>{header}</h1>
      <p className='font-inter text-[14px]'>{paragraph}</p>
    </div>
  );
};

export default BusinessFormHeader;
