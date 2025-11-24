import { LogoLoadingIcon } from '@/assets/icons';
import React from 'react';

const LoaderModal = () => {
  return (
    <div className='inset-0 z-[200000] flex items-center justify-center bg-white/50 backdrop-blur-md'>
      <LogoLoadingIcon />
    </div>
  );
};

export default LoaderModal;
