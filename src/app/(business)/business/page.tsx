'use client';

import { useBusinessContext } from '@/contexts/BusinessContext';
import { useBusinessDashboardDetails } from '../misc/api';
import { LogoLoadingIcon } from '@/assets/icons';
import { Button, EmptyState, LinkButton } from '@/components/ui';
import { EmptyChatMedia, EmptyListingIcon } from '@/app/(clients)/misc/icons';
import {
  MessagesSelectedIcon,
  PromotionBannerStars,
  PromotionBannerStarsMobile,
  ReviewsSelectedIcon,
  SolidEyeIcon,
} from '../misc/components/icons';
import { cn } from '@/lib/utils';
import {
  BusinessPageHeader,
  DashboardPerformanceChart,
  Notifications,
  RatingStars,
} from '../misc/components';
import { useIsMobile } from '@/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function DashboardPage(): JSX.Element {
  const { currentBusiness, businesses, isLoading } = useBusinessContext();
  const { isMobile } = useIsMobile();
  const { data, isLoading: isBusinessDetailsLoading } =
    useBusinessDashboardDetails(currentBusiness?.id, 'dashboard');
  const router = useRouter();

  const cardsData = [
    {
      title: 'Conversations',
      title_count: data?.data.number_of_conversations,
      title_desc: 'Messages',
      title_desc_mobile: 'Messages request',
      icon: <MessagesSelectedIcon className='text-[#7839EE] max-md:!size-3' />,
      icon_bg: 'bg-[#F5F3FF]',
    },
    {
      title: 'Feedback',
      title_count: data?.data.number_of_reviews,
      title_desc: 'Reviews',
      title_desc_mobile: 'Client Reviews',
      icon: <ReviewsSelectedIcon className='text-[#FF4405] max-md:!size-3' />,
      icon_bg: 'bg-[#FFF4ED]',
    },
    {
      title: 'Clients',
      title_count: data?.data.number_of_profile_visits,
      title_desc: 'Views',
      title_desc_mobile: 'Profile visits',
      icon: <SolidEyeIcon className='text-[#FEC601] max-md:!size-3' />,
      icon_bg: 'bg-[#FEFDF0]',
    },
  ];

  if (isLoading || isBusinessDetailsLoading) {
    return (
      <div className='flex size-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  // Only redirect if we are certain the user truly has zero businesses.
  // During initialization currentBusiness can be null even when businesses exist,
  // so we guard against that by checking the raw businesses array.
  if (!isLoading && businesses.length === 0) {
    router.replace('/businesses/create-listing');
    return (
      <EmptyState
        media={<EmptyListingIcon />}
        title='No business created yet'
        description='Get started by creating your first business listing.'
        actions={
          <Button isLoading size='xl'>
            Redirecting you to create your first business listing...
          </Button>
        }
      />
    );
  }

  return (
    <div className='flex h-dvh flex-1 flex-col overflow-hidden'>
      <BusinessPageHeader marketPlace={true} />
      <div className='grid flex-1 gap-4 gap-y-5 overflow-y-auto px-3 pt-2 max-md:pb-28 lg:px-5 xl:grid-cols-[1fr,minmax(0,280px)] 2xl:grid-cols-[1fr,minmax(0,350px)]'>
        <section className='w-full overflow-x-hidden'>
          <article className='relative mb-4 flex flex-col gap-y-2 rounded-2xl bg-[#FEEE95] p-4 lg:mb-6 lg:gap-y-3 lg:p-6'>
            <h6 className='text-[0.825rem] font-medium md:text-sm'>
              🚀 Promote Your Business
            </h6>
            <p className='relative z-[2] max-w-md text-balance font-karma text-xl font-semibold md:text-2xl lg:text-3xl 2xl:max-w-2xl 2xl:text-[clamp(2.25rem,2.35vw,2.9rem)] 2xl:leading-snug'>
              Reach more customers with ads and featured spots on Delve.
            </p>
            <LinkButton
              href='/business/promotions'
              size={isMobile ? 'dynamic_lg' : 'xl'}
              className='relative z-[2] mt-2 w-max rounded-full bg-[#5F2EEA] !px-3 !py-2 text-xs text-white md:mt-5 md:text-sm lg:!pl-4 lg:text-base'
            >
              Promote
              <div className='flex size-6 items-center justify-center rounded-full bg-[#ECE9FE] md:size-9'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  className='size-3 md:size-6'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12.8333 7.625L17 12M17 12L12.8333 16.375M17 12L7 12'
                    stroke='black'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </LinkButton>

            <PromotionBannerStarsMobile className='absolute bottom-0 right-0 mt-4 block md:hidden' />
            <PromotionBannerStars className='absolute bottom-0 right-0 mt-4 hidden md:block' />
          </article>

          <div className='container flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] max-md:snap-x max-md:snap-mandatory md:grid md:grid-cols-2 lg:gap-4 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden'>
            {cardsData.map((card, index) => (
              <article
                key={index}
                className='flex flex-col gap-1.5 overflow-x-hidden rounded-[0.85rem] border border-[#F5F3FF] bg-card p-2 px-2.5 text-card-foreground max-md:min-w-[42vw] max-md:snap-start md:gap-3 md:rounded-2xl md:p-4 lg:px-6'
              >
                <section className='flex gap-2 md:items-center'>
                  <div
                    className={cn(
                      'flex items-center justify-center max-md:mt-1',
                      card.icon_bg,
                      'size-4 rounded-full md:size-10'
                    )}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-[#0F0F0F] md:text-2xl md:font-semibold lg:text-3xl'>
                      {card.title_count ?? 0}{' '}
                      <span className='ml-0.5 text-[0.725rem] font-normal text-[#697586] md:ml-1.5 md:text-[0.825rem] md:text-xs'>
                        {card.title}
                      </span>
                    </h3>

                    <p className='text-[0.7125rem] font-medium text-[#0F0F0F] md:hidden'>
                      {card.title_desc_mobile}
                    </p>
                    <p className='text-xs text-[#0F0F0F] max-md:hidden md:text-sm'>
                      {card.title_desc}
                    </p>
                  </div>
                </section>
              </article>
            ))}
          </div>
          <section className='mt-4 grid gap-4 lg:grid-cols-3'>
            {/* ///////////////////////////////////////////////////////////////////// */}
            {/* /////////////          CONVERSATIONS            ///////////////////// */}
            {/* ///////////////////////////////////////////////////////////////////// */}
            <div className='rounded-xl border border-[#F5F3FF] bg-white py-3 lg:col-span-2 lg:py-4'>
              <header className='p-2 pt-0 md:mb-4 md:px-4'>
                <h1 className='font-inter text-lg font-medium md:text-xl'>
                  Conversations
                </h1>
              </header>
              <div>
                {!!data?.data.conversations.length ? (
                  <>
                    {data?.data.conversations.map(conversation => (
                      <div key={conversation.id} className='mb-0.5'>
                        <Link
                          key={conversation.id}
                          href={`/business/messages/${conversation.id}`}
                          className={cn(
                            'flex w-full items-center gap-2 bg-[#F8FAFC] p-2 text-left transition-colors hover:bg-muted/50 md:gap-3 md:px-4 md:py-2.5',
                            'hover:!bg-[#F5F3FF]'
                          )}
                        >
                          <div className='relative size-10 overflow-hidden rounded-full md:size-14'>
                            <Image
                              src={
                                conversation.customer.profile_image ||
                                '/default-avatar.png'
                              }
                              alt={`${conversation.customer.first_name} ${conversation.customer.last_name}`}
                              fill
                              objectFit='cover'
                            />
                          </div>
                          <div className='flex min-w-0 flex-1 flex-col'>
                            <p className='text-[0.8rem] font-medium md:text-base'>
                              {conversation.customer.first_name}{' '}
                              {conversation.customer.last_name}
                            </p>
                            <p className='line-clamp-2 min-h-[2lh] text-xs leading-tight text-[#111927] md:text-[0.825rem]'>
                              {conversation.last_message?.content}
                            </p>
                            <small className='text-end text-xs text-[#697586]'>
                              {conversation.last_message?.sent_at
                                ? format(
                                    new Date(
                                      conversation.last_message?.sent_at || 0
                                    ),
                                    'dd MMM, hh:mm a'
                                  )
                                : '--'}
                            </small>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center max-md:min-h-[40vh]'>
                    <EmptyState
                      media={<EmptyChatMedia />}
                      description='Your conversations will be displayed here.'
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ///////////////////////////////////////////////////////////////////// */}
            {/* /////////////              REVIEWS              ///////////////////// */}
            {/* ///////////////////////////////////////////////////////////////////// */}
            <div className='rounded-xl bg-white p-4 max-md:pt-10'>
              <h3 className='text-center font-karma text-5xl font-bold lg:mt-12 xl:text-6xl'>
                {data?.data.average_review_rating !== undefined
                  ? data.data.average_review_rating.toFixed(1)
                  : '0.0'}
              </h3>
              <RatingStars rating={data?.data.average_review_rating || 0} />
              <p className='mt-2 text-center text-sm font-medium text-[#111927] md:text-sm'>
                {data?.data.number_of_reviews || 0} reviews
              </p>
              <div className='mt-2 flex justify-center -space-x-4'>
                {[
                  '/business/reviewer1.jpg',
                  '/business/reviewer2.jpg',
                  '/business/reviewer3.jpg',
                  '/business/reviewer4.jpg',
                ]
                  .slice(0, 4)
                  .map((image, index) => (
                    <div
                      key={index}
                      className='relative size-10 overflow-hidden rounded-full border border-gray-300 ring-1 ring-black md:size-14'
                    >
                      <Image fill objectFit='cover' src={image} alt={image} />
                    </div>
                  ))}
              </div>

              {data?.data.performances && (
                <DashboardPerformanceChart
                  performances={data?.data.performances}
                />
              )}
            </div>
          </section>
        </section>

        <aside className='sticky top-2 h-[calc(100vh-100px)] max-xl:hidden'>
          <Notifications />
        </aside>
      </div>
    </div>
  );
}
