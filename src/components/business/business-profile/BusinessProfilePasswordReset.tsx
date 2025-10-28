import React from 'react'
import BusinessProfile from './BusinessProfile'

const BusinessProfilePasswordReset = ():JSX.Element => {
  return (
    <BusinessProfile header='Password Reset' showGreetings={false} paragraph='You are receiving this email because you have forgotten your password and want to get back into your account through an app.' >
      <p className='mt-5'>Here is your reset code below.</p>
      <h1 className='mt-8 font-semibold text-[28px] font-inter text-center'>678928</h1>
   </BusinessProfile>
  )
}

export default BusinessProfilePasswordReset