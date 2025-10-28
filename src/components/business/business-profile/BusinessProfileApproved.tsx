import React from 'react'
import BusinessProfile from './BusinessProfile'
import Link from 'next/link'
import { BusinessProfileIcons } from '@/assets/icons/business-profile/Icons'

const BusinessProfileApproved = ():JSX.Element => {
  return (
      <BusinessProfile header='Your business profile has been Approved' paragraph='Great news! Your business profile has been reviewed and approved. Customers can now discover, connect, and book your services on Delve.' >
          <Link href={'/dashboard'} className='bg-primary mt-10 rounded-md py-3 px-5 text-white text-[14px] w-[182px] flex items-center gap-2'><BusinessProfileIcons value='celebration-confetti-solid' /> <span>View Dashboard</span></Link>
   </BusinessProfile>
  )
}

export default BusinessProfileApproved