import React from 'react';

const RatingStars = ({ rating }: { rating: number }) => {
  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const fill = Math.max(0, Math.min(1, rating - i));
      stars.push(fill); // fill is a number between 0 and 1 (e.g., 0.7)
    }
    return stars;
  };

  return (
    <div className='flex items-center justify-center gap-1'>
      {getRatingStars(rating).map((fill, index) => (
        <svg
          key={index}
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <linearGradient
              id={`starGradient-${index}`}
              x1='0'
              y1='0'
              x2='100%'
              y2='0'
            >
              <stop offset={`${fill * 100}%`} stopColor='#FBBF24' />
              <stop offset={`${fill * 100}%`} stopColor='#E5E7EB' />
            </linearGradient>
          </defs>
          <path
            d='M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z'
            fill={`url(#starGradient-${index})`}
            stroke='#D1D5DB'
            strokeWidth='0.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;
