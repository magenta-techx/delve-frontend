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
    // Group by day and sum payments
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
    // Group and sum payments by day
    const grouped: Record<string, number> = {};
    paymentHistory.forEach(p => {
      const key = new Date(p.timestamp).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });
      if (grouped[key]) {
        grouped[key] += p.amount_paid;
      } else {
        grouped[key] = p.amount_paid;
      }
    });
    return allDays.map(date => ({ date, amount: grouped[date] || 0 }));
  } else {
    const monthsValue =
      selectedPeriod === 'last_6_months'
        ? 6
        : selectedPeriod === 'last_12_months'
          ? 12
          : 18;
    const now = new Date();
    let months: string[] = [];
    for (let i = monthsValue; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      let key = d.toLocaleDateString('en-GB', {
        month: 'short',
        year: '2-digit',
      });
      months.push(key);
    }
    // Group and sum payments by month
    const grouped: Record<string, number> = {};
    paymentHistory.forEach(p => {
      let key = new Date(p.timestamp).toLocaleDateString('en-GB', {
        month: 'short',
        year: '2-digit',
      });
      if (grouped[key]) {
        grouped[key] += p.amount_paid;
      } else {
        grouped[key] = p.amount_paid;
      }
    });
    return months.map(date => ({ date, amount: grouped[date] || 0 }));
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const c = containerRef.current;
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

  // Auto-scroll to current day when "this_month" is selected
  useEffect(() => {
    if (selectedPeriod === 'this_month' && containerRef.current) {
      const currentDay = new Date().getDate();
      const barWidth = 32; // width of each bar
      const gap = 8; // gap between bars (gap-2 = 0.5rem = 8px)
      const scrollPosition = (currentDay - 1) * (barWidth + gap) - (containerRef.current.clientWidth / 2) + (barWidth / 2);
      
      // Use setTimeout to ensure DOM has rendered
      setTimeout(() => {
        containerRef.current?.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [selectedPeriod, chartData]);

  return (
    <div className='overflow-hidden'>
      <div className='relative flex w-full flex-col overflow-hidden [scrollbar-width:none_!important]'>
        <header className='mb-4'>
          <p className='mb-1 text-sm text-[#0F0F0F]'>Total Spendings</p>
          <p className='text-3xl font-bold text-gray-900 md:text-4xl'>
            ₦{totalSpending.toLocaleString()}
          </p>
        </header>
        <section ref={sectionRef} className='relative flex-1 overflow-hidden'>
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
          <div className='flex'>
            {/* Sticky Y Axis */}
            <div className='sticky left-0 z-10 flex h-[320px] w-12 flex-shrink-0 flex-col justify-between bg-white pr-2 text-xs font-medium text-[#697586]'>
              {[1.2, 1, 0.75, 0.5, 0.25, 0].map((v, i) => (
                <span key={i} className='whitespace-nowrap'>
                  ₦{formatAmount(Math.round(maxAmount * v))}
                </span>
              ))}
            </div>
            {/* Scrollable Bars Container */}
            <div
              ref={containerRef}
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
              }}
              className='relative flex h-full flex-1 items-end gap-2 overflow-x-auto overflow-y-hidden pr-2 [scrollbar-width:none_!important]'
            >
              {/* Bars */}
              <div
                className={cn(
                  'flex min-w-max flex-row items-end gap-2 lg:gap-4',
                  (selectedPeriod === 'last_6_months' ||
                    selectedPeriod === 'last_12_months') &&
                    'lg:justify-between lg:min-w-full'
                )}
                style={{ height: 320 }}
              >
              {chartData.map((d, idx) => {
                // Calculate bar height based on tick values
                // The chart height is 320px, and ticks go from 1.2 to 0
                // So max bar height should be 320 * (d.amount / (maxAmount * 1.2))
                const barHeight =
                  d.amount === 0
                    ? 8
                    : Math.max(24, (d.amount / (maxAmount * 1.2)) * 320);
                return (
                  <div
                    key={d.date}
                    className='flex flex-col items-center justify-end'
                    style={{ width: 32, height: '100%', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      setActiveIndex(idx);
                      if (sectionRef.current) {
                        const sectionRect =
                          sectionRef.current.getBoundingClientRect();
                        const barElement = e.currentTarget
                          .children[0] as HTMLDivElement;
                        const barRect = barElement.getBoundingClientRect();
                        const left =
                          barRect.left - sectionRect.left + barRect.width / 2;
                        const top = barRect.top - sectionRect.top - 8;
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
                      if (sectionRef.current) {
                        const sectionRect =
                          sectionRef.current.getBoundingClientRect();
                        const touch = (e as React.TouchEvent).touches?.[0];
                        if (!touch) return;
                        const left = touch.clientX - sectionRect.left;
                        const barElement = e.currentTarget
                          .children[0] as HTMLDivElement;
                        const barRect = barElement.getBoundingClientRect();
                        const top = barRect.top - sectionRect.top - 8;
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
                  >
                    <div
                      className={`w-5 rounded-full transition-all duration-200 ${activeIndex === idx ? 'bg-[#7839EE]' : 'bg-[#D9D6FE]'} ${d.amount === 0 ? 'opacity-30' : ''}`}
                      style={{
                        height: barHeight,
                      }}
                    />
                    <span className='mt-2 whitespace-nowrap text-[0.6rem] font-medium text-[#697586] sm:text-[0.65rem]'>
                      {d.date}
                    </span>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
          {tooltip && (
            <div
              className='pointer-events-none absolute z-30 -translate-x-1/2 transform'
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
        </section>
      </div>
    </div>
  );
};

export default CustomPaymentHistoryChart;
