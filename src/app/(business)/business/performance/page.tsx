'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import {
  StatCard,
  PerformanceMetrics,
  // PerformanceAreaChart,
} from '@/app/(business)/misc/components';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useBusinessPerformance } from '@/app/(clients)/misc/api';
import { cn } from '@/lib/utils';
import { ChatsIcon } from '@/app/(clients)/misc/icons';

type TimePeriod =
  | 'this_month'
  | 'last_6_months'
  | 'last_12_months'
  | 'all_time';
type MetricType =
  | 'conversations'
  | 'reviews'
  | 'profile_visits'
  | 'saved_by_users';

export default function PerformancePage() {
  const { currentBusiness } = useBusinessContext();
  const business_id = currentBusiness?.id ? String(currentBusiness.id) : '';
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('this_month');
  const [analyticsType, setAnalyticsType] =
    useState<MetricType>('conversations');

  const [selectedPeriod, setSelectedPeriod] = useState<
    'all_time' | 'this_month' | 'last_6_months' | 'last_12_months'
  >('this_month');

  // Fetch performance data using hook
  const fetchOptions = {
    business_id,
    filter: timePeriod,
    metric: analyticsType,
  };
  const { data:businessPerformanceData } = useBusinessPerformance(fetchOptions);

  // Map analyticsType to card colors
  const analyticsMeta = {
    conversations: {
      color: 'text-purple-500',
      fillColor: '#a855f7',
      label: 'Conversations',
      subtitle: 'Total Message request',
      actionLabel: '12 Unanswered request',
    },
    reviews: {
      color: 'text-orange-500',
      fillColor: '#f97316',
      label: 'Feedback',
      subtitle: 'Total Client Reviews',
      actionLabel: '6 New reviews',
    },
    profile_visits: {
      color: 'text-yellow-500',
      fillColor: '#eab308',
      label: 'Potential clients',
      subtitle: 'Total Business Profile Views',
      actionLabel: '29 New Profile view',
    },
    saved_by_users: {
      color: 'text-green-500',
      fillColor: '#22c55e',
      label: 'Saved by Users',
      subtitle: 'Total Business Profile Saved',
      actionLabel: '14 New profile save',
    },
  };

  // Get totals and currents from API
  const totals = businessPerformanceData?.totals || {};
  const currents = businessPerformanceData?.currents || {};

  const cardsData = [
    {
      title: "Conversations",
      title_count: totals.conversations,
      title_desc: "Total Message request",
      // icon: <MessagesSe,
    }
  ]

  return (
    <div className={cn('h-full w-full overflow-y-scroll md:space-y-8')}>
      <header>
        <div className='mb-3 flex items-center p-4 !pb-0 lg:justify-between lg:p-6'>
          <h1 className='font-inter text-xl font-semibold lg:text-3xl'>
            Performance
            <span className='max-w-[30ch] text-balance text-xs font-normal text-[#4B5565] max-lg:block lg:hidden'>
              Effortlessly track your business performance metrics right here.
            </span>
          </h1>
        </div>
        <nav className='flex items-center gap-2 px-4 lg:gap-3 lg:px-6'>
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
                  className={`rounded-xl border px-3 py-2 font-inter text-xs font-normal capitalize tracking-wide transition-colors max-lg:w-max md:px-3 md:text-sm ${
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

      <section className='container grid gap-4 md:grid-cols-2 lg:grid-cols-4'>

      </section>

      <div>
        <h1 className='mb-2 text-3xl font-bold'>Performance Analytics</h1>
        <p className='mb-4 text-muted-foreground'>
          Track your business performance metrics in real time
        </p>

        {/* Stat cards row */}
        <div className='mb-6 grid grid-cols-4 gap-4'>
          <StatCard
            icon='💬'
            value={totals.conversations}
            label={analyticsMeta.conversations.label}
            subtitle={analyticsMeta.conversations.subtitle}
            actionLabel={analyticsMeta.conversations.actionLabel}
            color='purple'
          />
          <StatCard
            icon='🔥'
            value={totals.reviews}
            label={analyticsMeta.reviews.label}
            subtitle={analyticsMeta.reviews.subtitle}
            actionLabel={analyticsMeta.reviews.actionLabel}
            color='orange'
          />
          <StatCard
            icon='⭐'
            value={totals.profile_visits}
            label={analyticsMeta.profile_visits.label}
            subtitle={analyticsMeta.profile_visits.subtitle}
            actionLabel={analyticsMeta.profile_visits.actionLabel}
            color='yellow'
          />
          <StatCard
            icon='🔖'
            value={totals.saved_by_users}
            label={analyticsMeta.saved_by_users.label}
            subtitle={analyticsMeta.saved_by_users.subtitle}
            actionLabel={analyticsMeta.saved_by_users.actionLabel}
            color='green'
          />
        </div>
      </div>

      {/* Time period filters */}
      <div className='flex gap-2'>
        <Button
          variant={timePeriod === 'this_month' ? 'default' : 'outline'}
          onClick={() => setTimePeriod('this_month')}
          className='rounded-full'
        >
          This Month
        </Button>
        <Button
          variant={timePeriod === 'last_6_months' ? 'default' : 'outline'}
          onClick={() => setTimePeriod('last_6_months')}
          className='rounded-full'
        >
          Last 6 Months
        </Button>
        <Button
          variant={timePeriod === 'last_12_months' ? 'default' : 'outline'}
          onClick={() => setTimePeriod('last_12_months')}
          className='rounded-full'
        >
          Last 12 Months
        </Button>
        <Button
          variant={timePeriod === 'all_time' ? 'default' : 'outline'}
          onClick={() => setTimePeriod('all_time')}
          className='rounded-full'
        >
          All Time
        </Button>
      </div>

      {/* Analytics type selector */}
      <div className='flex flex-wrap gap-2'>
        {(
          [
            'conversations',
            'reviews',
            'profile_visits',
            'saved_by_users',
          ] as const
        ).map(type => (
          <Button
            key={type}
            variant={analyticsType === type ? 'default' : 'outline'}
            onClick={() => setAnalyticsType(type)}
            size='sm'
          >
            {analyticsMeta[type].label}
          </Button>
        ))}
      </div>

      {/* Main analytics card */}
      <Card>
        <CardHeader>
          <div className='flex items-end justify-between'>
            <div>
              <div className='flex items-baseline gap-2'>
                <span
                  className={`text-4xl font-bold ${analyticsMeta[analyticsType].color}`}
                >
                  {totals[analyticsType]}
                </span>
                <span className='text-sm font-medium text-green-600'>
                  {timePeriod === 'this_month'
                    ? 'This month'
                    : timePeriod
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <CardTitle className='mt-2'>
                {analyticsMeta[analyticsType].label} Analytics
              </CardTitle>
            </div>
            <div className='text-right'>
              <div className='text-sm text-muted-foreground'>Recent</div>
              <div
                className={`text-xl font-semibold ${analyticsMeta[analyticsType].color}`}
              >
                {currents[analyticsType]} New
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* <PerformanceAreaChart data={chartData} metric={selected} /> */}
        </CardContent>
      </Card>

      {/* Performance metrics cards */}
      <PerformanceMetrics analyticsType={analyticsType} />
    </div>
  );
}
