import React from 'react'
import BusinessProfile from './BusinessProfile'
import Link from 'next/link'

const BusinessPaymentAttemptFailed = (): JSX.Element => {
  return (
      <BusinessProfile header='Payment Attempt Failed' paragraph='Our recent charge attempts were unsuccessful.This usually happens when the registered payment method has insufficient balance or has expired. As a result, your Delve Pro subscription has ended.' >
          <p className='text-[16px] font-inter my-5'> You can still enjoy Delve, but Pro features like Advanced Insights, Growth Metrics, and Smart Engagement Tools are currently unavailable.</p>
          <p className='text-[16px] font-inter mt-5 mb-10'> Don’t worry, your projects, insights, and saved data are safely stored and will be fully restored once you resubscribe.</p>
         
          <Link href={'/dashboard'} className='bg-primary rounded-md py-3 px-5 text-white text-[14px] w-[135px] text-center'> Resubscribe</Link>
      </BusinessProfile>
  )
}

export default BusinessPaymentAttemptFailed



