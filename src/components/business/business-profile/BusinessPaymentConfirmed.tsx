import React from 'react'
import BusinessProfile from './BusinessProfile'

const BusinessPaymentConfirmed = (): JSX.Element => {
  return (
    <BusinessProfile header='Payment confirmed your business is renewed' paragraph='' >
      <p className='text-[16px] font-inter mt-5'>Hi Dora, </p>
      <p className='text-[16px] font-inter mb-10'>We&apos;ve received your payment for Beauty by AD. Your listing has been renewed successfully. Thank you for staying with Delve and continuing to grow with us.</p>
         
      </BusinessProfile>
  )
}
export default BusinessPaymentConfirmed