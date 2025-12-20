import React, { useId, useMemo } from 'react';

const STARS_TOTAL = 5;

const RatingStarsSquare = ({ rating }: { rating: number }) => {
    const idPrefix = useId();

    const starFills = useMemo(
        () =>
            Array.from({ length: STARS_TOTAL }, (_, starIndex) =>
                Math.max(0, Math.min(1, rating - starIndex)),
            ),
        [rating],
    );

    return (
        <div className='flex items-center justify-center gap-1'>
            {starFills.map((fillAmount, starIndex) => {
                const gradientId = `${idPrefix}-rating-star-${starIndex}`;
                const offset = `${fillAmount * 100}%`;

                return (
                    <svg
                        key={gradientId}
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <defs>
                            <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='0'>
                                <stop offset='0%' stopColor='white' />
                                <stop offset={offset} stopColor='white' />
                                <stop offset={offset} stopColor='#E5E7EB' />
                                <stop offset='100%' stopColor='#E5E7EB' />
                            </linearGradient>
                        </defs>
                        <path d='M16 0H0V16H16V0Z' fill='#FEC601' />
                        <path
                            d='M8.00039 10.4818L10.4337 9.8651L11.4504 12.9984L8.00039 10.4818ZM13.6004 6.43177H9.31706L8.00039 2.39844L6.68373 6.43177H2.40039L5.86706 8.93177L4.55039 12.9651L8.01706 10.4651L10.1504 8.93177L13.6004 6.43177Z'
                            fill={`url(#${gradientId})`}
                        />
                    </svg>
                );
            })}
        </div>
    );
};

export default RatingStarsSquare;
