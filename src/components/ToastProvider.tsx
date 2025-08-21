'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = (): JSX.Element => {
  return (
    // <ToastContainer
    //   position='top-left'
    //   autoClose={false}
    //   hideProgressBar={true}
    //   toastClassName='rounded-lg shadow-md font-inter'
    //   className='text-[12px]'
    //   newestOnTop={false}
    //   closeOnClick
    //   rtl={false}
    //   pauseOnFocusLoss
    //   draggable
    //   pauseOnHover
    //   theme='light'
    //   closeButton={false}
    // />
    <ToastContainer
      position='top-left'
      hideProgressBar={true}
      autoClose={5000}
      toastClassName={() => 'bg-transparent shadow-none p-0'}
    />
  );
};

export default ToastProvider;
