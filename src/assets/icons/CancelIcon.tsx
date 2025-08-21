'use client';
import React from 'react';

interface CancleIconProps {
  color?: string;
}
const CancleIcon = ({
  color = 'text-primary-grey',
}: CancleIconProps): JSX.Element => {
  return (
    <div>
      <svg
        className={`${color}`}
        width='13'
        height='13'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M2.48511 13.5156L13.5149 2.48586'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinejoin='round'
        />
        <path
          d='M13.5149 13.5156L2.48513 2.48586'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  );
};

export default CancleIcon;
