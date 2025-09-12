'use client';

import React, { useState } from 'react';
import ReactSwitch from 'react-switch';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

const BusinessPricingList = (): JSX.Element => {
  const [monthlyPlan, setMonthlyPlan] = useState(false);
  const redirect = useRouter();
  const PRICING_PLANS = [
    {
      header: 'Feature/Benefits',
      items: [
        'Business Profile visibility',
        'Listing Duration',
        'Listing Features',
        'Photo Uploads',
        'Verification Badge ',
        'Analytics Dashboard',
        'Customer Save to Fav Access',
        'Customer Review',
        'Support and Business Cons.',
      ],
      width: 'w-[250px]',
    },
    {
      header: 'freemium listing',
      items: [
        'Limited visibility in search results',
        'Indefinite',
        'Limited',
        'Limited to 1-6 Images',
        'No badge',
        'Not available',
        'Can be saved by up to 50 users',
        'View only',
        'Email only',
      ],
      width: 'w-[300px]',
      btnText: 'freemium',
    },
    {
      header: `premium listing ${monthlyPlan ? '(54,000/yearly)' : '(5,000/month)'}`,
      items: [
        'Priority Placement in search',
        'Indefinite',
        'Available',
        'Up to 20 uploads',
        'Verification Badge ',
        'Access all insights on visits, clicks etc',
        'No save limit ',
        'Actively collect and respond to reviews',
        ' 24/7 Priority Chat Support',
      ],
      width: 'w-[400px]',
      btnText: 'Premium',
    },
  ];
  const handleSubscription = (plan: string): void => {
    if (plan === 'freemium') {
      redirect.push('/business/introduction');
    }
  };
  return (
    <div className='w-full'>
      {/* Mobile  */}
      <div className='mt-10 flex w-full flex-col justify-center gap-4 px-20 sm:hidden'>
        <div className='flex justify-center'>
          <div className='flex w-[180px] justify-center rounded-3xl border border-gray-300 bg-neutral text-sm'>
            <button
              onClick={() => setMonthlyPlan(true)}
              className={`${monthlyPlan && 'bg-black text-white'} h-full w-[90px] rounded-3xl py-2 text-xs`}
            >
              Monthly
            </button>

            <button
              onClick={() => setMonthlyPlan(false)}
              className={`${!monthlyPlan && 'bg-black text-white'} h-full w-[90px] rounded-3xl py-2 text-xs`}
            >
              Yearly{' '}
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='h-[250px] w-full rounded-md bg-primary p-5 text-white'>
            <h1 className='font-karma text-lg font-medium'>Premuim Plan</h1>
          </div>
          <div className='h-[250px] w-full rounded-md bg-neutral p-5 text-black'>
            <h1 className='font-karma text-lg font-medium'>Freemuim Plan</h1>
          </div>
        </div>
      </div>

      {/* Desktop  */}
      <div className='hidden w-full flex-col items-center justify-center gap-10 sm:flex'>
        <div className='flex items-center gap-5 pl-20 text-sm'>
          <p className={`${!monthlyPlan && 'font-bold text-primary'} w-16`}>
            Monthly
          </p>
          <div className='z-10 h-7 w-14 rounded-2xl p-0 shadow-md'>
            <ReactSwitch
              checked={monthlyPlan}
              offHandleColor='#551FB9'
              onHandleColor='#551FB9'
              offColor='#FFFFFF'
              onColor='#FFFFFF'
              onChange={() => setMonthlyPlan(!monthlyPlan)}
              checkedIcon={false}
              uncheckedIcon={false}
              activeBoxShadow=''
              handleDiameter={20}
            />
          </div>
          <p className={`${monthlyPlan && 'font-bold text-primary'} w-52`}>
            Annually{' '}
            <span
              className={`${monthlyPlan && 'bg-gray-200'} rounded-md px-3 py-1 text-xs`}
            >
              10% off
            </span>
          </p>
        </div>
        <div className='flex h-[642px] w-[950px] justify-between rounded-md border border-[#CDD5DF] pb-20'>
          {PRICING_PLANS.map((plan, key) => {
            return (
              <div key={key} className='w-full rounded-md'>
                <h4
                  className={`${key === 1 ? '-ml-[1px] border-l-[1px] border-r-[1px]' : ''} ${key === 2 ? '-ml-[1px] bg-primary text-white' : 'bg-[#F5F3FF80]'} ${key === 0 ? 'rounded-tl-md' : key === 2 ? 'rounded-tr-md' : ''} ${plan?.width} border-b-[1px] border-[#CDD5DF] py-4 pl-10 font-semibold capitalize text-gray-600`}
                >
                  {plan.header}
                </h4>

                <div
                  className={` ${plan?.width} border-r-[1px] border-[#CDD5DF] ${key === 2 && 'rounded-br-md bg-[#F5F3FF80]'} h-[582px]`}
                >
                  {plan?.items.map((item, key) => {
                    return (
                      <p key={key} className={`py-4 pl-10 text-sm`}>
                        {item}
                      </p>
                    );
                  })}
                  {plan?.btnText && (
                    <div className='mt-10 flex w-full px-10'>
                      <Button
                        variant={`${plan.btnText === 'freemium' ? 'black' : 'default'}`}
                        className='w-[86%] text-xs'
                        onClick={() => handleSubscription(plan.btnText)}
                      >
                        Subscribe to {plan.btnText}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessPricingList;
