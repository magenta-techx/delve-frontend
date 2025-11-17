import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useRef, useState, useEffect } from 'react';

export interface CustomPaymentHistoryChartProps {
  paymentHistory: Array<{
    timestamp: string;
    amount_paid: number;
  }>;
  totalSpending: number;
  selectedPeriod:
    | 'all_time'
    | 'this_month'
    | 'last_6_months'
    | 'last_12_months';
}

function formatChartData(
  paymentHistory: CustomPaymentHistoryChartProps['paymentHistory'],
  selectedPeriod: CustomPaymentHistoryChartProps['selectedPeriod']
) {
  if (selectedPeriod === 'this_month') {
    // Group by day
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const allDays: string[] = Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });
    });
    const dataMap = Object.fromEntries(
      paymentHistory.map(p => [
        new Date(p.timestamp).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        }),
        p.amount_paid,
      ])
    );
    return allDays.map(date => ({ date, amount: dataMap[date] || 0 }));
  } else {
    const monthsValue = selectedPeriod === 'last_6_months' ? 6 : 10;
    // For months, get last 10 months
    const now = new Date();
    let months: string[] = [];
    for (let i = monthsValue; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      let key = d.toLocaleDateString('en-GB', {
        month: 'short',
        year:  '2-digit',
      });
      months.push(key);
    }
    const dataMap = Object.fromEntries(
      paymentHistory.map(p => {
        let key = new Date(p.timestamp).toLocaleDateString('en-GB', {
          month: 'short',
          year: '2-digit',
        });
        // if (selectedPeriod === 'all_time') {
        //   key = new Date(p.timestamp).toLocaleDateString('en-GB', {
        //     month: 'short',
        //     year: 'numeric',
        //   });
        // }
        return [key, p.amount_paid];
      })
    );
    return months.map(date => ({ date, amount: dataMap[date] || 0 }));
  }
}

function formatAmount(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
}

export const CustomPaymentHistoryChart: React.FC<
  CustomPaymentHistoryChartProps
> = ({ paymentHistory, totalSpending, selectedPeriod }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<null | {
    left: number;
    top: number;
    value: number;
    date: string;
  }>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const c = containerRef.current;
      console.log(c?.scrollLeft, 'SCROLL LEFT');
      console.log(c?.scrollWidth, 'SCROLL RIGHT');
      console.log(c?.clientWidth, 'CONTAINER WIDTH');
      if (!c) return;
      setShowLeftFade(c.scrollLeft > 0);
      setShowRightFade(c.scrollWidth > c.clientWidth + c.scrollLeft + 1);
    };

    const c = containerRef.current;
    if (c) {
      c.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (c) {
        c.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedPeriod]);

  const chartData = useMemo(
    () => formatChartData(paymentHistory, selectedPeriod),
    [paymentHistory, selectedPeriod]
  );
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  return (
    <div className='overflow-hidden'>
      <div className='relative flex w-full flex-col overflow-hidden [scrollbar-width:none_!important]'>
        <header className='mb-4'>
          <p className='mb-1 text-sm text-[#0F0F0F]'>Total Spendings</p>
          <p className='text-3xl font-bold text-gray-900 md:text-4xl'>
            ₦{totalSpending.toLocaleString()}
          </p>
        </header>
        <section className='relative flex-1 overflow-hidden'>
          {/* Vanishing effect overlays + scroll arrows */}
          <div
            className={`pointer-events-none absolute left-0 top-0 z-20 h-full w-12 transition-opacity duration-200 ${
              showLeftFade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2'>
              <button
                aria-label='scroll-left'
                onClick={() => {
                  const c = containerRef.current;
                  if (!c) return;
                  c.scrollBy({
                    left: -Math.round(c.clientWidth * 0.6),
                    behavior: 'smooth',
                  });
                }}
                className='flex h-8 w-8 items-center justify-center text-primary shadow-sm'
              >
                <ChevronLeft strokeWidth={4} />
              </button>
            </div>
            <div className='to-prurple-300 absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white/70 to-transparent' />
          </div>

          <div
            className={`pointer-events-none absolute right-0 top-0 z-20 h-full w-12 transition-opacity duration-200 ${
              showRightFade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2'>
              <button
                aria-label='scroll-right'
                onClick={() => {
                  const c = containerRef.current;
                  if (!c) return;
                  c.scrollBy({
                    left: Math.round(c.clientWidth * 0.6),
                    behavior: 'smooth',
                  });
                }}
                className='flex h-8 w-8 items-center justify-center'
              >
                <ChevronRight strokeWidth={4} />
              </button>
            </div>
            <div className='absolute right-0 top-0 h-full w-full bg-gradient-to-l from-white/60 to-transparent' />
          </div>
          <div
            ref={containerRef}
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
            className='relative flex h-full flex-1 items-end gap-2 overflow-x-auto overflow-y-hidden pr-2 [scrollbar-width:none_!important]'
          >
            {/* Y Axis */}
            <div
              className='absolute left-0 top-0 flex h-full flex-col justify-between text-xs font-medium text-[#697586]'
              style={{ height: 220 }}
            >
              {[1, 0.75, 0].map((v, i) => (
                <span key={i} style={{ height: 1 }}>
                  ₦{formatAmount(Math.round(maxAmount * v))}
                </span>
              ))}
            </div>
            {/* Bars */}
            <div
              className={cn('ml-10 flex flex-row items-end gap-2 lg:gap-4 min-w-[calc(100%_-_2.5rem)]', selectedPeriod === 'last_6_months' && "lg:justify-between")}
              style={{ height: 220 }}
            >
              {chartData.map((d, idx) => {
                const barHeight =
                  d.amount === 0
                    ? 8
                    : Math.max(24, (d.amount / maxAmount) * 180);
                return (
                  <div
                    key={d.date}
                    className='flex flex-col items-center justify-end'
                    style={{ width: 32 }}
                  >
                    <div
                      className={`w-5 rounded-full transition-all duration-200 md:w-6 ${activeIndex === idx ? 'bg-[#5F2EEA]' : 'bg-[#A78BFA]'} ${d.amount === 0 ? 'opacity-30' : ''}`}
                      style={{
                        height: barHeight,
                        cursor: d.amount > 0 ? 'pointer' : 'default',
                      }}
                      onMouseEnter={e => {
                        setActiveIndex(idx);
                        if (containerRef.current) {
                          const containerRect =
                            containerRef.current.getBoundingClientRect();
                          const barRect = (
                            e.currentTarget as HTMLDivElement
                          ).getBoundingClientRect();
                          const left =
                            barRect.left -
                            containerRect.left +
                            barRect.width / 2;
                          const top = barRect.top - containerRect.top - 8;
                          setTooltip({
                            left,
                            top,
                            value: d.amount,
                            date: d.date,
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setActiveIndex(null);
                        setTooltip(null);
                      }}
                      onTouchStart={e => {
                        setActiveIndex(idx);
                        if (containerRef.current) {
                          const containerRect =
                            containerRef.current.getBoundingClientRect();
                          const touch = (e as React.TouchEvent).touches?.[0];
                          if (!touch) return;
                          const left = touch.clientX - containerRect.left;
                          const barRect = (
                            e.currentTarget as HTMLDivElement
                          ).getBoundingClientRect();
                          const top = barRect.top - containerRect.top - 8;
                          setTooltip({
                            left,
                            top,
                            value: d.amount,
                            date: d.date,
                          });
                        }
                        e.stopPropagation();
                      }}
                      onTouchEnd={() => {
                        setTimeout(() => {
                          setActiveIndex(null);
                          setTooltip(null);
                        }, 2000);
                      }}
                    />
                    <span className='mt-2 whitespace-nowrap text-[0.6rem] font-medium text-[#697586] sm:text-[0.65rem]'>
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
            {tooltip && (
              <div
                className='pointer-events-none absolute z-20 -translate-x-1/2 transform'
                style={{ left: tooltip.left + 8, top: tooltip.top }}
              >
                <div className='rounded-md bg-white px-3 py-1 text-sm text-gray-800 shadow-md'>
                  <div className='font-medium'>
                    ₦{tooltip.value.toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500'>{tooltip.date}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomPaymentHistoryChart;
