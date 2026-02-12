'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from '@/components/ui';
import PerformanceAreaChart from '@/app/(business)/misc/components/charts/PerformanceAreaChart';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useBusinessPerformance } from '@/app/(clients)/misc/api';
import { cn } from '@/lib/utils';
import {
  BookmarkSelectedIcon,
  MessagesSelectedIcon,
  ReviewsSelectedIcon,
  SolidEyeIcon,
} from '../../misc/components/icons';
import { LogoLoadingIcon } from '@/assets/icons';
import { BusinessPageHeader } from '@/app/(business)/misc/components';

type MetricType =
  | 'conversations'
  | 'reviews'
  | 'profile_visits'
  | 'saved_by_users';

export default function PerformancePage() {
  const { currentBusiness } = useBusinessContext();
  const business_id = currentBusiness?.id ? String(currentBusiness.id) : '';
  const [analyticsType, setAnalyticsType] =
    useState<MetricType>('conversations');

  const [selectedPeriod, setSelectedPeriod] = useState<
    'all_time' | 'this_month' | 'last_6_months' | 'last_12_months'
  >('this_month');

  // Fetch performance data using hook
  const {
    data: businessPerformanceData,
    isLoading,
    isFetching,
  } = useBusinessPerformance({
    business_id,
    filter: selectedPeriod,
    metric: analyticsType,
  });

  const cardsData = [
    {
      title: 'Conversations',
      title_count: businessPerformanceData?.data.totals.total_conversations,
      title_desc: 'Total Message request',
      mobile_title_desc: 'Message request',
      icon: <MessagesSelectedIcon className='text-[#7839EE] max-md:!size-4' />,
      icon_bg: 'bg-[#F5F3FF]',
      subtitle: 'unanswered request',
      subtitle_count: businessPerformanceData?.data.currents.conversations,
      text_class: 'text-[#551FB9]',
    },
    {
      title: 'Feedback',
      title_count: businessPerformanceData?.data.totals.total_reviews,
      title_desc: 'Total Client Reviews',
      mobile_title_desc: 'Client Reviews',
      icon: <ReviewsSelectedIcon className='text-[#FF4405] max-md:!size-4' />,
      icon_bg: 'bg-[#FFF4ED]',
      subtitle: 'New reviews',
      subtitle_count: businessPerformanceData?.data.currents.reviews,
      text_class: 'text-[#FF4405]',
    },
    {
      title: 'Potential clients',
      title_count: businessPerformanceData?.data.totals.total_profile_visits,
      title_desc: 'Total Business Profile Views',
      mobile_title_desc: 'Business Profile Views',
      icon: <SolidEyeIcon className='text-[#FEC601] max-md:!size-4' />,
      icon_bg: 'bg-[#FEFDF0]',
      subtitle: 'New Profile view',
      subtitle_count: businessPerformanceData?.data.currents.profile_visits,
      text_class: 'text-[#E2B104]',
    },
    {
      title: 'Saved by Users',
      title_count: businessPerformanceData?.data.totals.total_business_saves,
      title_desc: 'Total Business Profile Saved',
      mobile_title_desc: 'Business Profile Saved',
      icon: <BookmarkSelectedIcon className='text-[#4CA30D] max-md:!size-4' />,
      icon_bg: 'bg-[#F3FEE7]',
      subtitle: 'New profile save',
      subtitle_count: businessPerformanceData?.data.currents.saved_by_users,
      text_class: 'text-[#4CA30D]',
    },
  ];

  return (
    <div
      className={cn(
        'h-full w-full overflow-y-scroll max-md:pb-16 md:space-y-8'
      )}
    >
      <BusinessPageHeader
        title='Performance'
        description='Effortlessly track your business performance metrics right here.'
      />
      <header>
        <nav className='mb-4 flex items-center gap-2 px-4 lg:gap-3 lg:px-6'>
          {['this_month', 'last_6_months', 'last_12_months', 'all_time'].map(
            period => {
              const p = period as
                | 'all_time'
                | 'this_month'
                | 'last_6_months'
                | 'last_12_months';
              const isActive = selectedPeriod === p;
              return (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(p)}
                  className={`rounded-xl border p-2 font-inter text-[0.625rem] font-normal capitalize tracking-wide transition-colors max-lg:w-max md:px-3 md:text-sm md:text-xs ${
                    isActive
                      ? 'border-[#5F2EEA] bg-[#5F2EEA] text-white'
                      : 'border-[#D9D6FE] text-[#697586]'
                  }`}
                >
                  {period.replace(/_/g, ' ')}
                </button>
              );
            }
          )}
        </nav>
      </header>

      <section className='container grid grid-cols-2 gap-4 px-4 lg:grid-cols-2 lg:px-6 xl:grid-cols-4'>
        {cardsData.map((card, index) => (
          <article
            key={index}
            className='flex flex-col gap-1.5 overflow-x-hidden rounded-2xl border border-[#CDD5DF] bg-card p-2.5 text-card-foreground md:gap-3 md:p-4 lg:px-6'
          >
            <section className='flex items-center gap-2'>
              <div
                className={cn(
                  'flex items-center justify-center',
                  card.icon_bg,
                  'size-7 rounded-full md:size-10'
                )}
              >
                {card.icon}
              </div>
              <div>
                <h3 className='text-xl font-semibold text-[#0F0F0F] md:text-2xl lg:text-3xl'>
                  {card.title_count ?? 0}{' '}
                  <span className='ml-0.5 text-[0.625rem] font-normal text-[#697586] md:ml-1.5 md:text-[0.825rem] md:text-xs'>
                    {card.title}
                    {}
                  </span>
                </h3>
                <p className='text-[0.625rem] text-[#0F0F0F] md:hidden'>
                  {card.mobile_title_desc}
                </p>
                <p className='text-xs text-[#0F0F0F] max-md:hidden'>
                  {card.title_desc}
                </p>
              </div>
            </section>
            <section className={card.text_class}>
              <span className='mr-1 text-sm font-bold'>
                {card.subtitle_count ?? 0}{' '}
              </span>
              <span className='text-[0.65rem] md:text-sm'>{card.subtitle}</span>
            </section>
          </article>
        ))}
      </section>

      {/* Performance Trends Chart Section */}
      <section className='mt-6 px-4 md:mt-8 lg:px-6'>
        <Card className='rounded-2xl border border-[#CDD5DF] bg-card'>
          <CardHeader className='!pb-3'>
            <div className='flex items-center justify-between gap-4'>
              <CardTitle className='text-xs font-normal text-[#697586] md:text-sm'>
                Performance Trends Over Time
              </CardTitle>
              <Select
                value={analyticsType}
                onValueChange={e => setAnalyticsType(e as MetricType)}
              >
                <SelectTrigger className='!h-10 w-max border border-[#EEF2F6] bg-[#F8FAFC] !p-1 text-xs md:w-[150px] md:!p-1.5'>
                  <span className='capitalize text-black max-md:text-[0.625rem]'>
                    {analyticsType.replace(/_/g, ' ')}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className='text-xs' value='profile_visits'>
                    Profile Visits
                  </SelectItem>
                  <SelectItem className='text-xs' value='conversations'>
                    Conversations
                  </SelectItem>
                  <SelectItem className='text-xs' value='reviews'>
                    Reviews
                  </SelectItem>
                  <SelectItem className='text-xs' value='saved_by_users'>
                    Saved by Users
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className='relative'>
            {isLoading || isFetching ? (
              <div className='z-3 absolute left-0 top-0 flex min-h-[40vh] w-full items-center justify-center bg-white/30 backdrop-blur-lg'>
                <LogoLoadingIcon />
              </div>
            ) : (
              <>
                <div className='mb-8 lg:mb-10'>
                  <p className='text-sm font-medium'>
                    Total number of {analyticsType.replace(/_/g, ' ')}
                  </p>

                  <p className='mb-3 mt-1 text-xs text-green-600'>
                    <span className='text-2xl font-bold text-[#0D0D0D] lg:text-4xl'>
                      {analyticsType === 'conversations'
                        ? businessPerformanceData?.data.totals
                            .total_conversations
                        : analyticsType === 'reviews'
                          ? businessPerformanceData?.data.totals.total_reviews
                          : analyticsType === 'profile_visits'
                            ? businessPerformanceData?.data.totals
                                .total_profile_visits
                            : analyticsType === 'saved_by_users'
                              ? businessPerformanceData?.data.totals
                                  .total_business_saves
                              : 0}
                    </span>{' '}
                    This month
                  </p>
                </div>
                {businessPerformanceData?.data?.graph && (
                  <PerformanceAreaChart
                    data={businessPerformanceData.data.graph || []}
                    metric={analyticsType}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
