import React, { ReactNode } from 'react';

interface AuthFormheaderProps {
  header: string;
  subheader: string;
  icon?: ReactNode;
  showMobileSubHeader?: boolean;
}
const AuthFormheader = ({
  header,
  subheader,
  icon,
  showMobileSubHeader = false,
}: AuthFormheaderProps): JSX.Element => {
  return (
    <div className='mb-5 flex flex-col items-center text-center'>
      <div className='mb-3'>{icon}</div>
      <h1 className='text-base-black-100 font-karma text-[20px] leading-9 sm:text-[24px]'>
        {header}
      </h1>
      <p
        className={`${showMobileSubHeader ? '' : 'hidden'} font-inter text-xs text-gray-600 sm:flex sm:text-[15px]`}
      >
        {subheader}
      </p>
    </div>
  );
};

export default AuthFormheader;
