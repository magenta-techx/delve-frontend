'use client';
import React from 'react';
import BusinessTextAndButton from './BusinessTextAndButton';

const BuinessHero = (): JSX.Element => {
  return (
    <div className='flex flex-col items-start w-[1488px] justify-between px-6 pb-6 pt-10 sm:flex-row sm:px-20 sm:pb-20 sm:pt-40'>
      <h1 className='w-[300px] font-karma text-[34px] font-semibold leading-tight sm:w-[650px] sm:text-[58px]'>
        Because Your Business Deserves to Be Seen
      </h1>
      <div className='sm:pr-8'>
        {' '}
        <BusinessTextAndButton
          text=' Reach the right customers, build trust, and get discovered by thousands
        all in one easy-to-use platform.'
          buttonText='Get started now'
          link='/business/get-started'
          width='w-[300px]'
          textClass='text-sm mb-4'
        />
      </div>
    </div>
  );
};

export default BuinessHero;
