import React from 'react'
import BusinessProfile from './BusinessProfile'

const BusinessFreeTrialEnds = (): JSX.Element => {
    return (
        <BusinessProfile header='Free Trial Ending Soon' paragraph='' >
            <p className='text-[16px] font-inter mt-5'>Hi Dora, </p>
            <p className='text-[16px] font-inter mb-10'>Your 7-day free trial will end in 2 days. Upgrade to Premium now to continue enjoying unlimited features and keep your business visible to more customers.
            </p>
            
        </BusinessProfile>
    )
}
export default BusinessFreeTrialEnds