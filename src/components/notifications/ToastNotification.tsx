'use client';

import CancleIcon from '@/assets/icons/CancelIcon';
import React from 'react';
import { toast, ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastNotificationProps {
  icon: React.ReactNode;
  message: {
    header: string;
    body: string;
  };

  closeToast?: () => void;
}
// Generic ToastNotification component
const ToastNotification = ({
  message,
  icon,
  closeToast,
}: ToastNotificationProps): JSX.Element => {
  return (
    <div
      className={`${message?.header === 'Successfull' ? 'bg-primary-50' : message?.header === 'Error' && 'bg-red-50'} mb-4 flex w-[350px] items-center gap-3 rounded-lg p-5 shadow-md`}
    >
      {/* Dynamic Icon */}
      <div>{icon}</div>

      {/* Message */}
      <div
        className={`${message?.header === 'Successfull' ? 'text-primary' : message?.header === 'Error' ? 'text-red-500' : ''} flex-1 text-sm`}
      >
        <h1 className='font-semibold'>{message?.header}</h1>
        <p className='font-normal'>{message?.body}</p>
      </div>

      {/* Close Button */}
      <button onClick={closeToast}>
        <CancleIcon
          color={`${message?.header === 'Successfull' ? 'text-primary' : message?.header === 'Error' ? 'text-red-500' : ''}`}
        />
      </button>
    </div>
  );
};

// Reusable toast trigger
export const showToastNotification = (
  message: {
    header: string;
    body: string;
  },
  icon: React.ReactNode,
  options?: ToastOptions
): Id => {
  return toast(
    ({ closeToast }) => (
      <ToastNotification
        message={message}
        icon={icon}
        closeToast={closeToast}
      />
    ),
    { ...options, closeButton: false } // disable default close button
  );
};

export default ToastNotification;
