'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo, useState } from 'react';
// dialog not used in this page
import { useBusinessCampaignAnalytics } from '@/app/(clients)/misc/api/business';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { LogoLoadingIcon } from '@/assets/icons';
import { CreateAdPromoForm } from '../../misc/components';
import { cn } from '@/lib/utils';
import { CustomPaymentHistoryChart } from '../../misc/components/charts';

export default function PromotionsPage() {
  const [selectedView, setSelectedView] = useState<'advert' | 'promotion'>(
    'promotion'
  );

  //   this_month: Returns payments from the start of the current month to now
  // last_6_months: Returns payments from the last 180 days (6 * 30)
  // last_12_months: Returns payments from the last 360 days (12 * 30)
  // all_time (default): Returns all payment history without date filtering
  const [selectedPeriod, setSelectedPeriod] = useState<
    'all_time' | 'this_month' | 'last_6_months' | 'last_12_months'
  >('this_month');
  const [formOpen, setFormOpen] = useState(false);
  const { currentBusiness, isLoading, refetchBusinesses } =
    useBusinessContext();
  const businessId = currentBusiness?.id;
  const { data: advertAnalyticsData, isLoading: advertAnalyticsLoading } =
    useBusinessCampaignAnalytics({
      businessId,
      requested_metric: 'advert',
      filter_method: selectedPeriod,
    });
  const { data: promotionAnalyticsData, isLoading: promotionAnalyticsLoading } =
    useBusinessCampaignAnalytics({
      businessId,
      requested_metric: 'promotion',
      filter_method: selectedPeriod,
    });

  const hasActiveCampaign = useMemo(
    () =>
      (advertAnalyticsData?.data?.active_campaign &&
        Object.keys(advertAnalyticsData?.data.active_campaign).length > 0) ||
      (promotionAnalyticsData?.data?.active_campaign &&
        Object.keys(promotionAnalyticsData?.data.active_campaign).length > 0),
    [
      advertAnalyticsData?.data?.active_campaign,
      promotionAnalyticsData?.data?.active_campaign,
      advertAnalyticsLoading,
      promotionAnalyticsLoading,
    ]
  );

  // Show form modal if no active campaign
  const showFormModal = !hasActiveCampaign || formOpen;
  const shouldSHowDashboard = hasActiveCampaign && !showFormModal;
  const selectedAnalyticsData =
    selectedView === 'advert' ? advertAnalyticsData : promotionAnalyticsData;
  const {
    totalSpending,
    totalViews,
    totalClicks,
    daysLeft,
    paymentHistory,
    dailyMetrics,
  } = useMemo(() => {
    const data = selectedAnalyticsData?.data;
    return {
      totalSpending: data?.total_spending || 0,
      totalViews:
        data?.performance_metrics?.summary_metrics?.total_impressions || 0,
      totalClicks:
        data?.performance_metrics?.summary_metrics?.total_clicks || 0,
      daysLeft: data?.performance_metrics?.summary_metrics?.days_left || 0,
      paymentHistory: data?.payment_history || [],
      dailyMetrics: data?.performance_metrics?.daily_metrics || [],
    };
  }, [selectedAnalyticsData]);

  if (isLoading || advertAnalyticsLoading || promotionAnalyticsLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  if (showFormModal) {
    return <CreateAdPromoForm initialTab={selectedView} />;
  }

  return (
    <div className={cn('h-full w-full space-y-3 overflow-hidden md:space-y-6')}>
      {/* Header */}
      <header className='flex items-center p-4 !pb-0 lg:justify-between lg:p-6'>
        <h1 className='font-inter text-xl font-semibold lg:text-3xl'>
          Promotions and Adverts
          <span className='max-w-[30ch] text-balance text-xs font-normal text-[#4B5565] max-lg:block lg:hidden'>
            Effortlessly handle your promotions and adverts right here.
          </span>
        </h1>
      </header>

      {hasActiveCampaign && (
        <>
          <nav className='flex items-center gap-2 px-4 lg:gap-3 lg:px-6'>
            {['this_month', 'last_6_months', 'last_12_months', 'all_time'].map(
              period => {
                const isActive = selectedPeriod === period;
                return (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period as any)}
                    className={`rounded-xl border px-3 py-2 font-inter text-xs font-normal capitalize tracking-wide transition-colors max-lg:w-max md:px-4 md:text-sm ${
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
          <section className='grid gap-5 px-4 lg:grid-cols-[1fr,minmax(auto,300px)] lg:items-stretch lg:gap-6 lg:px-8 xl:grid-cols-[1fr,minmax(auto,470px)]'>
            <article className='flex flex-col gap-5 overflow-x-hidden rounded-2xl border border-[#CDD5DF] bg-card p-4 text-card-foreground lg:px-6'>
              {/* Payment History Chart */}
              <CustomPaymentHistoryChart
                paymentHistory={paymentHistory}
                totalSpending={totalSpending}
                selectedPeriod={selectedPeriod}
              />
            </article>
            <article className='flex flex-col gap-5 overflow-x-hidden rounded-2xl p-4 text-card-foreground lg:px-6 bg-[#7839EE]'>
              SPACEEEEEEEEEEE
            </article>
          </section>

          {/* Active Campaign Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* ...render active campaign card from analyticsData... */}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Promotion Duration
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div>
                  <p className='text-2xl font-bold'>{daysLeft} Days Left</p>
                  <p className='text-xs text-gray-500'>Duration</p>
                </div>
                <div className='h-2 w-full rounded-full bg-yellow-100'>
                  <div
                    className='h-2 rounded-full bg-yellow-400'
                    style={{
                      width: `${Math.max(0, Math.min(100, (daysLeft / 14) * 100))}%`,
                    }}
                  ></div>
                </div>
                <p className='text-xs text-gray-500'>
                  Created on the 16th of July
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Views
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div>
                  <p className='text-2xl font-bold'>
                    {totalViews.toLocaleString()}
                  </p>
                  <p className='text-xs text-gray-500'>Views</p>
                </div>
                <div className='flex h-10 items-center justify-center'>
                  <div className='flex w-full items-end justify-between gap-1'>
                    {[30, 45, 35, 50, 60, 55, 70].map((height, i) => (
                      <div
                        key={i}
                        className='flex-1 rounded-sm bg-orange-200'
                        style={{
                          height: `${(height / 70) * 100}%`,
                          minHeight: '4px',
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Clicks & Engagements
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div>
                  <p className='text-2xl font-bold'>
                    {totalClicks.toLocaleString()}
                  </p>
                  <p className='text-xs text-gray-500'>Interactions</p>
                </div>
                <div className='flex h-10 items-center justify-center'>
                  <div className='flex w-full items-end justify-between gap-1'>
                    {[25, 40, 30, 45, 55, 50, 65].map((height, i) => (
                      <div
                        key={i}
                        className='flex-1 rounded-sm bg-green-200'
                        style={{
                          height: `${(height / 70) * 100}%`,
                          minHeight: '4px',
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Performance Trends Over Time</CardTitle>
                <select className='rounded-lg border border-gray-200 px-3 py-1 text-sm'>
                  <option>Views</option>
                  <option>Clicks</option>
                  <option>Engagements</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-4'>
                <p className='text-3xl font-bold'>Total number of views</p>
                <p className='mt-1 text-sm font-medium text-green-600'>
                  {totalViews.toLocaleString()} This month
                </p>
              </div>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart
                  data={dailyMetrics.map(m => ({
                    date: m.date,
                    views: m.daily_views,
                  }))}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={value => `${value.toLocaleString()} views`}
                  />
                  <Line
                    type='monotone'
                    dataKey='views'
                    stroke='#8b5cf6'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  //       {/* Spending Analytics */}
  //       <Card>
  //         <CardHeader>
  //           <div className="flex items-center justify-between">
  //             <CardTitle>Total Spendings</CardTitle>
  //             <div className="flex gap-2">
  //               {["This Month", "Last 6 Months", "Last 12 Months", "All Time"].map((label) => (
  //                 <button
  //                   key={label}
  //                   className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-purple-600 border border-gray-200 rounded-full hover:border-purple-300"
  //                 >
  //                   {label}
  //                 </button>
  //               ))}
  //             </div>
  //           </div>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="mb-6">
  //             <p className="text-4xl font-bold text-gray-900">₦{totalSpending.toLocaleString()}</p>
  //             <p className="text-sm text-gray-500 mt-1">Total spent this month</p>
  //           </div>
  //           <ResponsiveContainer width="100%" height={300}>
  //             <BarChart data={spendingData}>
  //               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  //               <XAxis dataKey="date" tick={{ fontSize: 12 }} />
  //               <YAxis tick={{ fontSize: 12 }} />
  //               <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
  //               <Bar dataKey="amount" fill="#9333ea" radius={[4, 4, 0, 0]} />
  //             </BarChart>
  //           </ResponsiveContainer>
  //         </CardContent>
  //       </Card>

  //       {/* Performance Metrics */}
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //         <Card>
  //           <CardHeader className="pb-3">
  //             <CardTitle className="text-sm font-medium text-gray-600">Promotion Duration</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-3">
  //             <div>
  //               <p className="text-2xl font-bold">14 Days</p>
  //               <p className="text-xs text-gray-500">Duration</p>
  //             </div>
  //             <div className="w-full bg-yellow-100 rounded-full h-2">
  //               <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "65%" }}></div>
  //             </div>
  //             <p className="text-xs text-gray-500">Created on the 16th of July</p>
  //           </CardContent>
  //         </Card>

  //         <Card>
  //           <CardHeader className="pb-3">
  //             <CardTitle className="text-sm font-medium text-gray-600">Views</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-3">
  //             <div>
  //               <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
  //               <p className="text-xs text-gray-500">Views</p>
  //             </div>
  //             <div className="h-10 flex items-center justify-center">
  //               <div className="w-full flex items-end justify-between gap-1">
  //                 {[30, 45, 35, 50, 60, 55, 70].map((height, i) => (
  //                   <div
  //                     key={i}
  //                     className="flex-1 bg-orange-200 rounded-sm"
  //                     style={{ height: `${(height / 70) * 100}%`, minHeight: "4px" }}
  //                   ></div>
  //                 ))}
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>

  //         <Card>
  //           <CardHeader className="pb-3">
  //             <CardTitle className="text-sm font-medium text-gray-600">Clicks & Engagements</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-3">
  //             <div>
  //               <p className="text-2xl font-bold">420</p>
  //               <p className="text-xs text-gray-500">Interactions</p>
  //             </div>
  //             <div className="h-10 flex items-center justify-center">
  //               <div className="w-full flex items-end justify-between gap-1">
  //                 {[25, 40, 30, 45, 55, 50, 65].map((height, i) => (
  //                   <div
  //                     key={i}
  //                     className="flex-1 bg-green-200 rounded-sm"
  //                     style={{ height: `${(height / 70) * 100}%`, minHeight: "4px" }}
  //                   ></div>
  //                 ))}
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>

  //       {/* Performance Trends */}
  //       <Card>
  //         <CardHeader>
  //           <div className="flex items-center justify-between">
  //             <CardTitle>Advert Performance Trends Over Time</CardTitle>
  //             <select className="px-3 py-1 text-sm border border-gray-200 rounded-lg">
  //               <option>Views</option>
  //               <option>Clicks</option>
  //               <option>Engagements</option>
  //             </select>
  //           </div>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="mb-4">
  //             <p className="text-3xl font-bold">Total number of views</p>
  //             <p className="text-sm text-green-600 font-medium mt-1">{totalViews.toLocaleString()} This month</p>
  //           </div>
  //           <ResponsiveContainer width="100%" height={300}>
  //             <LineChart data={viewsData}>
  //               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
  //               <XAxis dataKey="date" tick={{ fontSize: 12 }} />
  //               <YAxis tick={{ fontSize: 12 }} />
  //               <Tooltip formatter={(value) => `${value.toLocaleString()} views`} />
  //               <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} dot={false} />
  //             </LineChart>
  //           </ResponsiveContainer>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
}
