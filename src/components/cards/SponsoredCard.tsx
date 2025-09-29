import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const SponsoredCard = ({ href , imageUrl}: { href: string; imageUrl:string}):JSX.Element => {
  return (
      <div className='relative w-[745px] h-[479px]'>
          <Image src={imageUrl} alt={imageUrl} width={400} height={300} className='h-full w-full'/>
          <Link className='absolute left-0 bottom-0 bg-[#BC1B06] w-[184px] h-[56px] flex items-center justify-center text-white' href={href}>View</Link>
    </div>
  )
}

export default SponsoredCard