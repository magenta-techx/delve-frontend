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
    <div className='flex items-center justify-center gap-0.5'>
      {getRatingStars(rating).map((fill, index) => (
        <svg
          key={index}
          width='24'
          height='24'
          className='size-5 sm:size-6 lg:size-7'
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
          {/* <path
            d='M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z'
            fill={`url(#starGradient-${index})`}
            stroke='#D1D5DB'
            strokeWidth='0.2'
            strokeLinecap='round'
            strokeLinejoin='round'
            /> */}

          <path
            d='M8.17198 1.23543C8.3269 0.921523 8.77453 0.921523 8.92945 1.23543L10.935 5.29903C10.9965 5.42368 11.1154 5.51008 11.253 5.53007L15.7374 6.1817C16.0838 6.23203 16.2221 6.65775 15.9715 6.90209L12.7265 10.0652C12.627 10.1622 12.5815 10.302 12.605 10.439L13.3711 14.9053C13.4302 15.2503 13.0681 15.5134 12.7583 15.3505L8.74725 13.2418C8.62421 13.1771 8.47722 13.1771 8.35418 13.2418L4.34317 15.3505C4.03332 15.5134 3.67119 15.2503 3.73036 14.9053L4.4964 10.439C4.5199 10.302 4.47447 10.1622 4.37493 10.0652L1.12996 6.90209C0.879288 6.65775 1.01761 6.23203 1.36403 6.1817L5.84847 5.53007C5.98604 5.51008 6.10495 5.42368 6.16647 5.29903L8.17198 1.23543Z'
            fill={`url(#starGradient-${index})`}
            stroke='transparent'
            strokeWidth='0'
            strokeLinejoin='round'
          />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;
