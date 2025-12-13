import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const InstagramSection = () => {
  const instagramImages = [
    {
      id: 1,
      src: '/landingpage/instagram-slide-1.jpg',
      alt: 'Instagram post 1',
    },
    {
      id: 2,
      src: '/landingpage/instagram-slide-2.jpg',
      alt: 'Instagram post 2',
    },
    {
      id: 3,
      src: '/landingpage/instagram-slide-3.jpg',
      alt: 'Instagram post 3',
    },
    {
      id: 4,
      src: '/landingpage/instagram-slide-4.jpg',
      alt: 'Instagram post 4',
    },
    {
      id: 5,
      src: '/landingpage/instagram-slide-5.jpg',
      alt: 'Instagram post 5',
    },
    {
      id: 6,
      src: '/landingpage/instagram-slide-6.jpg',
      alt: 'Instagram post 6',
    },
  ];

  return (
    <Link
      href='https://instagram.com/delve_ng'
      target='_blank'
      rel='noopener noreferrer'
      className='group relative flex w-full items-center justify-center overflow-hidden xl:grid-cols-6 gap-1.5'
    >
      {instagramImages.map((image) => (
        <div
          key={image.id}
          className='relative w-1/3 xl:w-1/6 flex-shrink-0'
          style={{ aspectRatio: '284 / 217' }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes='(max-width: 768px) 33vw, 16.66vw'
            className='object-cover'
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black/40' />

      {/* White Instagram Logo and Text - Centered */}
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 transition-transform group-hover:scale-105 sm:gap-4'>
        <svg
          width='34'
          height='34'
          className='!size-6 md:!size-9'
          viewBox='0 0 34 34'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M16.6667 25.8333C21.269 25.8333 25 22.1024 25 17.5C25 12.8976 21.269 9.16667 16.6667 9.16667C12.0643 9.16667 8.33333 12.8976 8.33333 17.5C8.33333 22.1024 12.0643 25.8333 16.6667 25.8333ZM16.6667 23.3333C19.8883 23.3333 22.5 20.7217 22.5 17.5C22.5 14.2783 19.8883 11.6667 16.6667 11.6667C13.445 11.6667 10.8333 14.2783 10.8333 17.5C10.8333 20.7217 13.445 23.3333 16.6667 23.3333Z'
            fill='white'
          />
          <path
            d='M26.6667 7.5C26.6667 8.88071 25.5474 10 24.1667 10C22.786 10 21.6667 8.88071 21.6667 7.5C21.6667 6.11929 22.786 5 24.1667 5C25.5474 5 26.6667 6.11929 26.6667 7.5Z'
            fill='white'
          />
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M1.33975 5C0 7.32051 0 10.4359 0 16.6667C0 22.8974 0 26.0128 1.33975 28.3333C2.21743 29.8535 3.47981 31.1159 5 31.9936C7.32051 33.3333 10.4359 33.3333 16.6667 33.3333C22.8974 33.3333 26.0128 33.3333 28.3333 31.9936C29.8535 31.1159 31.1159 29.8535 31.9936 28.3333C33.3333 26.0128 33.3333 22.8974 33.3333 16.6667C33.3333 10.4359 33.3333 7.32051 31.9936 5C31.1159 3.47981 29.8535 2.21743 28.3333 1.33975C26.0128 0 22.8974 0 16.6667 0C10.4359 0 7.32051 0 5 1.33975C3.47981 2.21743 2.21743 3.47981 1.33975 5ZM9.59264 30.6761C11.3014 30.8309 13.5053 30.8333 16.6667 30.8333C19.8281 30.8333 22.032 30.8309 23.7407 30.6761C25.415 30.5243 26.367 30.2421 27.0833 29.8285C28.2235 29.1703 29.1703 28.2235 29.8285 27.0833C30.2421 26.367 30.5243 25.415 30.6761 23.7407C30.8309 22.032 30.8333 19.8281 30.8333 16.6667C30.8333 13.5053 30.8309 11.3014 30.6761 9.59264C30.5243 7.91828 30.2421 6.96634 29.8285 6.25C29.1703 5.10986 28.2235 4.16307 27.0833 3.50481C26.367 3.09123 25.415 2.80902 23.7407 2.65726C22.032 2.5024 19.8281 2.5 16.6667 2.5C13.5053 2.5 11.3014 2.5024 9.59264 2.65726C7.91828 2.80902 6.96634 3.09123 6.25 3.50481C5.10986 4.16307 4.16307 5.10986 3.50481 6.25C3.09123 6.96634 2.80902 7.91828 2.65726 9.59264C2.5024 11.3014 2.5 13.5053 2.5 16.6667C2.5 19.8281 2.5024 22.032 2.65726 23.7407C2.80902 25.415 3.09123 26.367 3.50481 27.0833C4.16307 28.2235 5.10986 29.1703 6.25 29.8285C6.96634 30.2421 7.91828 30.5243 9.59264 30.6761Z'
            fill='white'
          />
        </svg>

        <div className='flex flex-col items-center gap-1'>
          <span className='text-center font-karma text-xl font-medium text-white sm:text-2xl md:text-3xl underline'>
            Instagram
          </span>
        </div>
      </div>
    </Link>
  );
};

export default InstagramSection;
