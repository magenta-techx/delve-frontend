import React from 'react'
import BusinessProfile from './BusinessProfile'

const BusinessNewBusinessRating = (): JSX.Element => {
  return (
    <BusinessProfile header='New business rating⭐' paragraph='' >
      <p className='text-[16px] font-inter mt-5'>Hi Dora, </p>
      <p className='text-[16px] font-inter mb-10'>You&apos;ve received a new review. Log in to your dashboard to see what they had to say and keep engaging with your customers.
  </p>
    </BusinessProfile>
  )
}
export default BusinessNewBusinessRating