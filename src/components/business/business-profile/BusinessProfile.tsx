import React from 'react';
import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import Link from 'next/link';


interface BusinessProfileProps {
    header?: string;
    paragraph?: string;
    showGreetings?: boolean;
    children?: React.ReactNode;
}
const BusinessProfile = ({ header, paragraph, showGreetings = true, children }: BusinessProfileProps): JSX.Element => {
    return <div className='rounded-xl w-[757px] h-auto pb-10 border-[1px] border-[#E3E8EF] '>
        <div className='w-full rounded-tl-xl rounded-tr-xl bg-primary h-[12px]'></div>

        <div className='px-8 '>
            <div className='pb-24 border-b-[1px] border-[#CDD5DF] mb-4'>
                <DefaultLogoTextIcon />
                {/* <BusinessFormHeader header='Your business profile has been Approved' paragraph='Great news! Your business profile has been reviewed and approved. Customers can now discover, connect, and book your services on Delve.' /> */}
                <h1 className='text-[32px] mt-14 mb-5 font-karma font-medium'>{header}</h1>
                <p className='text-[16px] font-inter'>{paragraph}</p>

                <div>{children}</div>


            </div>
            {showGreetings && <div className='text-[16px]'>
                <p className='mb-5'>Having trouble with your account? <Link href={'/'} className='text-primary underline'>Contact support</Link></p>
                <p className='text-[#697586] mb-5'>Best,</p>
                <p className='text-[#697586]'>~Delve team</p>
            </div>}
            {!showGreetings && <div className='text-[16px]'>
                <p className=''>Copy the code above an use it to reset your password.</p>
            </div>}

        </div>
    </div>;
};

export default BusinessProfile;



