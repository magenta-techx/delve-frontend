/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui';
import {
  type ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
// dialog not used in this page
import { useBusinessCampaignAnalytics } from '@/app/(clients)/misc/api/business';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { CaretDown, LogoLoadingIcon } from '@/assets/icons';
import {
  CampaignAreaChart,
  CreateAdPromoForm,
  PaymentHistoryChart,
  BusinessPageHeader,
} from '../../misc/components';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';
import Image from 'next/image';
import { EmptySavedBusinessesIcon } from '@/app/(clients)/misc/icons';
import { useUpdateSponsoredAd } from '@/app/(clients)/misc/api/sponsored';
import { toast } from 'sonner';

export default function PromotionsPage() {
  const [selectedView, setSelectedView] = useState<'advert' | 'promotion'>(
    'promotion'
  );

  const [selectedPeriod, setSelectedPeriod] = useState<
    'all_time' | 'this_month' | 'last_6_months' | 'last_12_months'
  >('this_month');

  const [selectedGraphView, setSelectedGraphView] = useState<
    'views' | 'clicks'
  >('views');

  const [createCampaignFormState, setCreateCampaignFormState] = useState({
    isOpen: false,
    isExtension: false,
    isCloseable: false,
    showTabs: true,
  });
  const advertImageInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: updateSponsoredAd, isPending: _isUpdatingAdvertImage } =
    useUpdateSponsoredAd();
  const { currentBusiness, isLoading } = useBusinessContext();
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
  const hasActivePromoCampaign = useMemo(
    () =>
      promotionAnalyticsData?.data?.active_campaign &&
      Object.keys(promotionAnalyticsData?.data.active_campaign).length > 0,
    [promotionAnalyticsData?.data?.active_campaign, promotionAnalyticsLoading]
  );

  const hasActiveAdvertCampaign = useMemo(
    () =>
      advertAnalyticsData?.data?.performance_metrics &&
      Object.keys(advertAnalyticsData?.data.performance_metrics).length > 0,
    [advertAnalyticsData?.data?.performance_metrics, advertAnalyticsLoading]
  );

  const activeAdvertCampaign = advertAnalyticsData?.data?.active_campaign as
    | Record<string, unknown>
    | undefined;
  const activeAdvertId =
    (activeAdvertCampaign?.['advertisement_id'] as
      | number
      | string
      | undefined) ??
    (activeAdvertCampaign?.['id'] as number | string | undefined) ??
    (activeAdvertCampaign?.['advert_id'] as number | string | undefined) ??
    (activeAdvertCampaign?.['campaign_id'] as number | string | undefined) ??
    null;

  const handleAdvertImageFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      const inputEl = event.target;

      if (!file) return;

      if (!activeAdvertId) {
        toast.error('Unable to update advert image right now.');
        inputEl.value = '';
        return;
      }

      updateSponsoredAd(
        { advertisementId: activeAdvertId, image: file },
        {
          onSuccess: () => {
            toast.success('Advert image updated');
          },
          onError: error => {
            const description =
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred';
            toast.error('Failed to update advert image', { description });
          },
          onSettled: () => {
            inputEl.value = '';
          },
        }
      );
    },
    [activeAdvertId, updateSponsoredAd]
  );

  const hasActiveCampaign = useMemo(
    () =>
      (advertAnalyticsData?.data?.active_campaign &&
        Object.keys(advertAnalyticsData?.data.active_campaign).length > 0) ||
      (advertAnalyticsData?.data?.performance_metrics &&
        Object.keys(advertAnalyticsData?.data.performance_metrics).length >
          0) ||
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
  const showFormModal = !hasActiveCampaign || createCampaignFormState.isOpen;
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
    return (
      <CreateAdPromoForm
        initialTab={selectedView}
        closeForm={() =>
          setCreateCampaignFormState(prev => ({ ...prev, isOpen: false }))
        }
        {...createCampaignFormState}
      />
    );
  }

  return (
    <div
      className={cn(
        'h-full w-full overflow-y-scroll max-md:pb-16 md:space-y-8'
      )}
    >
      <BusinessPageHeader
        title='Promotions and Adverts'
        description='Effortlessly handle your promotions and adverts right here.'
      />
      {/* Header */}
      <header>
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

      {hasActiveCampaign && (
        <>
          <section className='grid gap-5 px-4 lg:grid-cols-[1fr,minmax(auto,300px)] lg:items-stretch lg:gap-6 lg:px-8 xl:grid-cols-[1fr,minmax(auto,470px)]'>
            <article className='flex flex-col gap-5 overflow-x-hidden rounded-2xl border border-[#CDD5DF] bg-card p-4 text-card-foreground lg:px-6'>
              {/* Payment History Chart */}
              <PaymentHistoryChart
                paymentHistory={paymentHistory}
                totalSpending={totalSpending}
                selectedPeriod={selectedPeriod}
              />
            </article>
            <article className='flex grid-rows-[auto,1fr,max-content] flex-col gap-5 overflow-x-hidden rounded-2xl bg-[#7839EE] p-4 text-white lg:grid lg:p-6'>
              <header className='flex items-center justify-between'>
                <h1 className='font-inter font-semibold text-white lg:text-lg'>
                  Your Active Campaigns
                </h1>

                <DropdownMenu>
                  <DropdownMenuTrigger className='inline-flex w-max items-center justify-between rounded-lg border-2 border-[#C3B5FD] bg-[#FFFFFF] px-2 py-2 text-left text-xs font-medium text-[#0F0F0F]'>
                    {selectedView === 'advert' ? 'Adverts' : 'Promotions'}
                    <CaretDown className='ml-2 h-4 w-4' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='!min-w-20 !max-w-40'>
                    <div className='flex flex-col'>
                      <DropdownMenuItem
                        className='!p-1 text-xs'
                        onClick={() => setSelectedView('advert')}
                      >
                        {selectedView === 'advert' && (
                          <Check className='mr-2 h-4 w-4 text-green-500' />
                        )}
                        Adverts
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='!p-1 text-xs'
                        onClick={() => setSelectedView('promotion')}
                      >
                        {selectedView === 'promotion' && (
                          <Check className='mr-2 h-4 w-4 text-green-500' />
                        )}
                        Promotions
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              {}
              <section className='relative rounded-2xl border border-white p-1'>
                <input
                  ref={advertImageInputRef}
                  type='file'
                  accept='image/png,image/jpeg,image/jpg'
                  className='hidden'
                  onChange={handleAdvertImageFileChange}
                />
                {selectedView === 'advert' ? (
                  <>
                    {hasActiveAdvertCampaign ? (
                      <div
                        className='relative h-full overflow-hidden rounded-2xl bg-[#0F172A]/30'
                        // style={{ aspectRatio: '16 / 9' }}
                      >
                        <Image
                          src={
                            advertAnalyticsData?.data.performance_metrics
                              .summary_metrics?.image || '/default-image.png'
                          }
                          alt='Advert Campaign Thumbnail'
                          className='object-cover'
                          fill
                          objectFit='cover'
                        />
                      </div>
                    ) : (
                      <div>
                        <EmptyState
                          title='No Active Advert Campaign'
                          description='You currently have no active advert campaigns. Create one to start reaching a wider audience and boosting your business visibility.'
                          className='h-48'
                          titleClassName='text-white text-lg font-semibold'
                          descriptionClassName='!text-white'
                          actions={
                            <Button
                              onClick={() =>
                                setCreateCampaignFormState({
                                  ...createCampaignFormState,
                                  isOpen: true,
                                  isCloseable: true,
                                  isExtension: false,
                                })
                              }
                            >
                              Create Advert Campaign
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <article className='relative size-full overflow-hidden rounded-2xl'>
                    {hasActivePromoCampaign ? (
                      <Image
                        src={
                          promotionAnalyticsData?.data.active_campaign?.[
                            'thumbnail'
                          ]
                        }
                        alt='Promotion Campaign Thumbnail'
                        className='rounded-xl object-cover text-[0.6rem]'
                        fill
                        objectFit='cover'
                      />
                    ) : (
                      <div className='flex flex-col items-center'>
                        <EmptyState
                          title='No Active Promotion Campaign'
                          description='You currently have no active promotion campaigns. Create one to start reaching a wider audience and boosting your business visibility.'
                          className='h-48'
                          titleClassName='text-white text-lg font-semibold'
                          descriptionClassName='!text-white'
                          actions={
                            <Button
                              onClick={() =>
                                setCreateCampaignFormState({
                                  ...createCampaignFormState,
                                  isOpen: true,
                                  isCloseable: true,
                                  isExtension: false,
                                })
                              }
                            >
                              Create Promotion Campaign
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </article>
                )}
              </section>

              <footer className='flex items-center justify-between'>
                <span className='rounded-xl border border-[#9AA4B2] bg-[#0000002E] px-4 py-1.5 text-sm font-light'>
                  <span className='mr-2 text-[0.9rem] font-semibold'>
                    {
                      selectedAnalyticsData?.data.performance_metrics
                        .summary_metrics?.total_impressions
                    }
                  </span>
                  {(selectedView === 'advert' && hasActiveAdvertCampaign) ||
                  (selectedView === 'promotion' && hasActivePromoCampaign)
                    ? 'Engagements'
                    : 'No Active Campaign'}
                </span>
                <span className='flex w-max items-center rounded-xl border border-[#9AA4B2] bg-[#0000002E] px-4 py-1.5 text-sm font-light'>
                  <span className='mr-2 flex items-center text-[0.9rem] font-semibold'>
                    <Circle
                      className={cn(
                        'mr-1 inline-block size-3',
                        (selectedView === 'advert' &&
                          hasActiveAdvertCampaign) ||
                          (selectedView === 'promotion' &&
                            hasActivePromoCampaign)
                          ? 'animate-pulse fill-[#D0F8AB] text-[#D0F8AB]'
                          : 'fill-[#ee2e2e] text-[#e42222]'
                      )}
                    />

                    {(selectedView === 'advert' && hasActiveAdvertCampaign) ||
                    (selectedView === 'promotion' && hasActivePromoCampaign)
                      ? ' Live Now'
                      : 'Inactive'}
                  </span>
                  {
                    selectedAnalyticsData?.data.performance_metrics
                      .summary_metrics?.days_left
                  }{' '}
                  {(selectedView === 'advert' && hasActiveAdvertCampaign) ||
                    (selectedView === 'promotion' &&
                      hasActivePromoCampaign &&
                      'days left')}
                </span>
              </footer>
            </article>
          </section>

          <section className='px-4 lg:px-6'>
            <header className='mb-6 mt-16 flex justify-between gap-y-2.5 max-md:flex-col md:mt-12 md:items-center'>
              <div>
                <div className='flex gap-2'>
                  <h3 className='font-inter font-semibold text-black lg:text-lg'>
                    Promotion Performance Metrics
                  </h3>

                  <DropdownMenu>
                    <DropdownMenuTrigger className='inline-flex w-max items-center justify-between rounded-lg bg-[#FDE272] px-2 py-1.5 text-left text-xs font-medium text-[#0F0F0F]'>
                      {selectedView === 'advert' ? 'Adverts' : 'Promos'}
                      <CaretDown className='ml-2 h-4 w-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='!min-w-20 !max-w-40'>
                      <div className='flex flex-col'>
                        <DropdownMenuItem
                          className='!p-1 text-xs'
                          onClick={() => setSelectedView('advert')}
                        >
                          {selectedView === 'advert' && (
                            <Check className='mr-2 h-4 w-4 text-green-500' />
                          )}
                          Adverts
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='!p-1 text-xs'
                          onClick={() => setSelectedView('promotion')}
                        >
                          {selectedView === 'promotion' && (
                            <Check className='mr-2 h-4 w-4 text-green-500' />
                          )}
                          Promotions
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className='rounded-full bg-[#F5F3FF] text-[0.6rem] font-light'></div>
              </div>

              <Button
                onClick={() =>
                  setCreateCampaignFormState({
                    ...createCampaignFormState,
                    isOpen: true,
                    isCloseable: true,
                    isExtension:
                      selectedView === 'advert'
                        ? !!hasActiveAdvertCampaign
                        : !!hasActivePromoCampaign,
                    showTabs: !hasActiveCampaign,
                  })
                }
                size='dynamic_lg'
              >
                {selectedView === 'advert' ? (
                  <>
                    {hasActiveAdvertCampaign
                      ? 'Extend Campaign Duration'
                      : 'Create Advert'}
                  </>
                ) : (
                  <>
                    {hasActivePromoCampaign
                      ? 'Extend Campaign Duration'
                      : 'Create Promotion'}
                  </>
                )}
              </Button>
            </header>

            {/* Performance Metrics */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-6'>
              <Card className='!flex flex-col !border border-[#EEF2F6] bg-[#FEFDF0]'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-gray-600 lg:text-base'>
                    Promotion Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-1 flex-col space-y-3'>
                  <div className='mt-auto h-4 w-full rounded-full bg-[#FFF5D4]'>
                    <div
                      className='h-4 rounded-full bg-[#FEC601]'
                      style={{
                        width: `${Math.max(0, Math.min(100, (daysLeft / 14) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <section className='flex items-end justify-between'>
                    <div>
                      <p className='text-xs text-gray-500'>
                        <span className='text-2xl font-semibold text-[#0F0F0F] md:text-3xl'>
                          {daysLeft}{' '}
                        </span>
                        Days Left
                      </p>
                    </div>
                    <p className='text-xs text-gray-500'>
                      Created on the 16th of July
                    </p>
                  </section>
                </CardContent>
              </Card>

              <Card className='flex flex-col !border border-[#EEF2F6] bg-[#FFF4ED]'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-gray-600 lg:text-base'>
                    Promotion Views
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-1 flex-col space-y-3'>
                  <div className='flex h-12 max-w-40 items-end justify-center lg:max-w-60'>
                    <div className='flex h-full w-full items-end justify-between gap-1 lg:gap-2'>
                      {[20, 30, 35, 40, 60, 55, 45, 32, 25, 30, 48, 20, 35].map(
                        (height, i) => (
                          <div
                            key={i}
                            className='flex-1 rounded-lg bg-[#FFD6AE]'
                            style={{
                              height:
                                totalViews <= 0
                                  ? '4px'
                                  : `${(height / 70) * 100}%`,
                              minHeight: '4px',
                            }}
                          ></div>
                        )
                      )}
                    </div>
                  </div>

                  <section className='flex items-end justify-between'>
                    <div>
                      <p className='text-xs text-gray-500'>
                        <span className='text-2xl font-semibold text-[#0F0F0F] md:text-3xl'>
                          {totalViews.toLocaleString()}{' '}
                        </span>
                        Views
                      </p>
                    </div>
                    <p className='text-xs text-gray-500'>Now</p>
                  </section>
                </CardContent>
              </Card>

              <Card className='flex flex-col !border border-[#EEF2F6] bg-[#F3FEE7]'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-gray-600 lg:text-base'>
                    Clicks & Engagements
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-1 flex-col space-y-3'>
                  <div className='flex h-12 max-w-40 items-end justify-center lg:max-w-60'>
                    <div className='flex size-full items-end justify-between gap-1 lg:gap-2'>
                      {[20, 30, 35, 40, 60, 55, 45, 32, 25, 30, 48, 35, 20].map(
                        (height, i) => (
                          <div
                            key={i}
                            className='flex-1 rounded-sm bg-green-200 transition-all duration-300 ease-linear'
                            style={{
                              height:
                                totalClicks <= 0
                                  ? '4px'
                                  : `${(height / 70) * 100}%`,
                              minHeight: '4px',
                            }}
                          ></div>
                        )
                      )}
                    </div>
                  </div>

                  <section className='flex items-end justify-between'>
                    <div>
                      <p className='text-xs text-gray-500'>
                        <span className='text-2xl font-semibold text-[#0F0F0F] md:text-3xl'>
                          {totalClicks.toLocaleString()}{' '}
                        </span>
                        Interactions
                      </p>
                    </div>
                    <p className='text-xs text-gray-500'>Now</p>
                  </section>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Performance Trends */}
          <section className='mt-5 p-4 pt-0 lg:p-6 lg:pt-0'>
            <Card>
              <CardHeader className='!pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-normal text-[#697586]'>
                    Performance Trends Over Time
                  </CardTitle>
                  <Select
                    value={selectedGraphView}
                    onValueChange={e =>
                      setSelectedGraphView(e as 'views' | 'clicks')
                    }
                  >
                    <SelectTrigger className='!h-8 w-[70px] border border-[#EEF2F6] bg-[#F8FAFC] !p-1 md:!h-10 md:w-[100px] md:!py-1.5'>
                      <span className='text-xs text-black md:text-sm'>
                        {selectedGraphView === 'views' ? 'Views' : 'Clicks'}
                      </span>
                    </SelectTrigger>
                    <SelectContent className='max-w-max'>
                      <SelectItem className='!text-xs' value='views'>
                        Views
                      </SelectItem>
                      <SelectItem className='!text-xs' value='clicks'>
                        Clicks
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className='mb-4'>
                  <p className='text-sm font-medium'>
                    Total number of {selectedGraphView}
                  </p>
                  <p className='mb-3 mt-1 text-xs text-green-600'>
                    <span className='text-2xl font-bold text-[#0D0D0D] lg:text-4xl'>
                      {selectedGraphView == 'clicks'
                        ? totalClicks.toLocaleString()
                        : totalViews.toLocaleString()}
                    </span>{' '}
                    This month
                  </p>
                </div>

                {!hasActiveCampaign ||
                (selectedView === 'promotion' && !hasActivePromoCampaign) ||
                (selectedView === 'advert' && !hasActiveAdvertCampaign) ? (
                  <div className='py-10'>
                    <EmptyState
                      description={`No active ${selectedView === 'advert' ? 'advert' : 'promotion'} campaigns to display performance trends.`}
                      className='h-48'
                      titleClassName='text-black text-xl font-semibold'
                      descriptionClassName='!text-gray-500'
                      media={<EmptySavedBusinessesIcon />}
                    />
                  </div>
                ) : (
                  <CampaignAreaChart
                    data={dailyMetrics.map(m => ({
                      date: m.date,
                      views: m.daily_views,
                      clicks: m.daily_clicks,
                    }))}
                    metric={
                      selectedGraphView === 'views'
                        ? 'views'
                        : (selectedGraphView as 'views' | 'clicks')
                    }
                  />
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
