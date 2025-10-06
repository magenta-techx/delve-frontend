import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const SponsoredCard = ({ href, imageUrl, styleProps }: { href: string; imageUrl: string; styleProps?: string }): JSX.Element => {
  return (
    <div className={`relative ${styleProps ? styleProps : 'sm:w-[745px] sm:h-[479px] w-[353px] h-[273px]'}`}>
      <Image src={imageUrl} alt={imageUrl} width={400} height={300} className='h-full w-full object-contain' />
      <Link className='absolute left-0 sm:bottom-0 bottom-[22px] bg-[#BC1B06] sm:w-[184px] w-[132px] h-[56px] flex items-center justify-center text-white' href={href}>View</Link>
    </div>
  )
}

export default SponsoredCard