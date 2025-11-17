import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

const AnimatedSquares = () => {
  const [bigIndex, setBigIndex] = useState(1);

  // Custom order: 1,2,4,3,1,...
  const order = [1, 3, 2, 0];
  useEffect(() => {
    const interval = setInterval(() => {
      setBigIndex(prev => {
        const currentIdx = order.indexOf(prev);
        const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % order.length;
        return order[nextIdx] ?? 0;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative grid grid-cols-2 items-center justify-center gap-0.5'>
      {Array.from({ length: 4 }).map((pos, i) => {
        const isBig = i === bigIndex;
        return (
            <div
              key={i}
              className={cn(
                `transition-all duration-500 ease-in-out size-3.5`,
                isBig
                  ? 'scale-[1.15] rounded-sm bg-[#7839EE]'
                  : 'size-3.5 rounded bg-[#0D121C]',
                  i==0  ? 'origin-bottom-right':
                  i==1  ? 'origin-bottom-left':
                  i==2  ? 'origin-top-right':
                  i==3  ? 'origin-top-left':''
              )}
            />
        );
      })}
    </div>
  );
};

export default AnimatedSquares;
