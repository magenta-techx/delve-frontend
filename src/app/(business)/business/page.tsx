'use client';

import { useBusinessContext } from '@/contexts/BusinessContext';
import { useBusinessDashboardDetails } from '../misc/api';
import { LogoLoadingIcon } from '@/assets/icons';
import { EmptyState, LinkButton } from '@/components/ui';
import {
  ChatsIcon,
  EmptyChatMedia,
  EmptyListingIcon,
  NotificationsIcon,
} from '@/app/(clients)/misc/icons';
import {
  MessagesSelectedIcon,
  PromotionBannerStars,
  PromotionBannerStarsMobile,
  ReviewsSelectedIcon,
  SolidEyeIcon,
} from '../misc/components/icons';
import { cn } from '@/lib/utils';
import {
  DashboardPerformanceChart,
  Notifications,
  RatingStars,
} from '../misc/components';
import { useIsMobile } from '@/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useUserContext } from '@/contexts/UserContext';

const NAV_LINKS = [
  {
    name: 'Chats',
    href: '/chats',
    icon: ChatsIcon,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: NotificationsIcon,
  },
];

export default function DashboardPage(): JSX.Element {
  const { currentBusiness, isLoading } = useBusinessContext();
  const { isMobile } = useIsMobile();
  const { data, isLoading: isBusinessDetailsLoading } =
    useBusinessDashboardDetails(currentBusiness?.id, 'dashboard');
  const { user } = useUserContext();

  const cardsData = [
    {
      title: 'Conversations',
      title_count: data?.data.number_of_conversations,
      title_desc: 'Messages',
      icon: <MessagesSelectedIcon className='text-[#7839EE] max-md:!size-4' />,
      icon_bg: 'bg-[#F5F3FF]',
    },
    {
      title: 'Feedback',
      title_count: data?.data.number_of_reviews,
      title_desc: 'Reviews',
      icon: <ReviewsSelectedIcon className='text-[#FF4405] max-md:!size-4' />,
      icon_bg: 'bg-[#FFF4ED]',
    },
    {
      title: 'Clients',
      title_count: data?.data.number_of_profile_visits,
      title_desc: 'Views',
      icon: <SolidEyeIcon className='text-[#FEC601] max-md:!size-4' />,
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

  if (!currentBusiness) {
    return (
      <EmptyState
        media={<EmptyListingIcon />}
        title='No business created yet'
        description='Get started by creating your first business listing.'
        actions={
          <LinkButton
            href='/businesses/create-listing'
            // className='inline-block rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90'
            size='xl'
          >
            Create Your First Business
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className='flex h-screen flex-1 flex-col overflow-hidden'>
      <header className='hidden md:flex items-center justify-end gap-4 p-1.5 md:p-4'>
        <div className='hidden items-center gap-4 border-r-[0.4px] pr-5 md:flex'>
          {NAV_LINKS.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'flex size-[2.75rem] items-center justify-center rounded-full',
                'hover:text-primary-600 bg-[#F5F3FF] text-black'
              )}
            >
              <span className='sr-only'>{link.name}</span>
              <link.icon className='size-5' />
            </Link>
          ))}
        </div>
        {!isMobile && (
          <>
            {!!user?.first_name && (
              <p className='ml-1 flex w-max max-w-36 items-center gap-1 truncate text-left text-[0.9rem] font-medium capitalize'>
                <svg
                  width='26'
                  height='26'
                  viewBox='0 0 26 26'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12.9987 13.0013C15.9902 13.0013 18.4154 10.5762 18.4154 7.58464C18.4154 4.59309 15.9902 2.16797 12.9987 2.16797C10.0072 2.16797 7.58203 4.59309 7.58203 7.58464C7.58203 10.5762 10.0072 13.0013 12.9987 13.0013Z'
                    fill='#0F0F0F'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M16.8238 12.7848C16.5546 12.3185 16.7143 11.7222 17.1807 11.4529L18.0251 10.9654C18.4914 10.6962 19.0877 10.856 19.3569 11.3223C19.6607 11.8484 20.4201 11.8484 20.7238 11.3223C20.993 10.856 21.5893 10.6962 22.0557 10.9654L22.9001 11.4529C23.3664 11.7222 23.5262 12.3185 23.2569 12.7848C22.9532 13.3109 23.3329 13.9686 23.9404 13.9686C24.4788 13.9686 24.9154 14.4051 24.9154 14.9436V15.9186C24.9154 16.457 24.4788 16.8936 23.9404 16.8936C23.3329 16.8936 22.9532 17.5512 23.2569 18.0773C23.5262 18.5436 23.3664 19.1399 22.9 19.4092L22.0557 19.8967C21.5893 20.1659 20.993 20.0061 20.7238 19.5398C20.4201 19.0137 19.6607 19.0137 19.3569 19.5398C19.0877 20.0061 18.4914 20.1659 18.0251 19.8967L17.1807 19.4092C16.7143 19.1399 16.5546 18.5436 16.8238 18.0773C17.1276 17.5512 16.7479 16.8936 16.1404 16.8936C15.6019 16.8936 15.1654 16.457 15.1654 15.9186V14.9436C15.1654 14.4051 15.6019 13.9686 16.1404 13.9686C16.7479 13.9686 17.1276 13.3109 16.8238 12.7848ZM20.0402 17.307C21.0757 17.307 21.9152 16.4675 21.9152 15.432C21.9152 14.3965 21.0757 13.557 20.0402 13.557C19.0046 13.557 18.1652 14.3965 18.1652 15.432C18.1652 16.4675 19.0046 17.307 20.0402 17.307Z'
                    fill='#0F0F0F'
                  />
                  <path
                    d='M14.3529 14.9436C14.3529 14.6628 14.4176 14.3972 14.5329 14.1608C14.0349 14.1107 13.5222 14.0846 12.9987 14.0846C8.21223 14.0846 4.33203 16.2672 4.33203 18.9596C4.33203 21.652 8.21223 23.8346 12.9987 23.8346C16.6521 23.8346 19.7775 22.5631 21.0525 20.7638C20.6438 20.6407 20.2781 20.3719 20.0404 19.9802C19.5377 20.8087 18.4623 21.0873 17.6188 20.6003L16.7744 20.1128C15.931 19.6258 15.6345 18.5553 16.1007 17.7056C15.1318 17.6845 14.3529 16.8925 14.3529 15.9186V14.9436Z'
                    fill='#0F0F0F'
                  />
                </svg>

                {`${user?.first_name} ${user?.last_name}`}
              </p>
            )}
          </>
        )}
        <LinkButton
          href='/business'
          className='xl:ml-4'
          size={isMobile ? 'dynamic_lg' : 'xl'}
        >
          Market place
          <svg
            width='19'
            height='20'
            viewBox='0 0 19 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14.7272 10.9339C13.897 10.4595 12.8846 10.4314 12.0293 10.859L11.6181 11.0646C10.1313 11.808 8.38118 11.808 6.89432 11.0646L6.48316 10.859C5.62788 10.4314 4.61546 10.4595 3.78522 10.9339L3.46181 11.1187C2.88191 11.4501 2.23855 11.6171 1.59547 11.6219L2.05229 15.5048C2.29916 17.6032 4.07756 19.1847 6.19042 19.1847L6.39144 19.1847V16.0597C6.39144 14.4776 7.67396 13.1951 9.25602 13.1951C10.8381 13.1951 12.1206 14.4776 12.1206 16.0597V19.1847L12.8425 19.1847C14.9554 19.1847 16.7338 17.6032 16.9806 15.5048L17.4412 11.5898C16.6292 11.6959 15.7885 11.5404 15.0507 11.1187L14.7272 10.9339Z'
              fill='white'
            />
            <path
              d='M10.5581 19.1847V16.0597C10.5581 15.3406 9.97514 14.7576 9.25602 14.7576C8.5369 14.7576 7.95394 15.3406 7.95394 16.0597V19.1847H10.5581Z'
              fill='white'
            />
            <path
              d='M11.5428 0.294902L10.2836 0.085038C9.60327 -0.028346 8.90889 -0.028346 8.22858 0.085038L6.9536 0.297534L6.90724 0.76014L5.86453 8.70451L5.86402 8.70851L5.81106 9.12878L6.46099 9.45375C8.22054 10.3335 10.2916 10.3335 12.0512 9.45375L12.7011 9.12878L12.6481 8.70851L12.6476 8.7045L11.6065 0.771996L11.5428 0.294902Z'
              fill='white'
            />
            <path
              d='M14.2931 9.26533L16.2613 10.39C16.7561 10.6727 17.3681 10.6516 17.8422 10.3355C18.3242 10.0142 18.5789 9.44456 18.497 8.87104L17.7211 3.44007C17.6373 2.85332 17.3075 2.33004 16.8144 2.00126L14.9893 0.784518C14.647 0.556368 14.2449 0.434622 13.8336 0.434622H13.1378L13.1557 0.568662L14.1979 8.50918L14.2931 9.26533Z'
              fill='white'
            />
            <path
              d='M4.219 9.26533L4.31429 8.50916L4.3148 8.50517L5.35491 0.580521L5.36954 0.434622H4.67853C4.26722 0.434622 3.86512 0.556368 3.5229 0.784518L1.69778 2.00126C1.20461 2.33004 0.874834 2.85332 0.791012 3.44007L0.0151599 8.87104C-0.0667723 9.44456 0.187908 10.0142 0.669954 10.3355C1.14408 10.6516 1.7561 10.6727 2.25085 10.39L4.219 9.26533Z'
              fill='white'
            />
          </svg>
        </LinkButton>
      </header>
      <div className='grid flex-1 gap-4 gap-y-5 overflow-y-auto px-3 pt-2 max-md:pb-16 lg:px-5 xl:grid-cols-[1fr,minmax(0,280px)] 2xl:grid-cols-[1fr,minmax(0,350px)]'>
        <section className='w-full overflow-x-hidden'>
          <article className='relative mb-6 flex flex-col gap-y-3 rounded-2xl bg-[#FEEE95] p-4 lg:p-6'>
            <h6>🚀 Promote Your Business</h6>
            <p className='relative z-[2] max-w-md text-balance font-karma text-2xl font-semibold lg:text-3xl 2xl:max-w-2xl 2xl:text-[clamp(2.15rem,2.25vw,2.9rem)] 2xl:leading-snug'>
              Reach more customers with ads and featured spots on Delve.
            </p>
            <LinkButton
              href='/business/promotions'
              size={isMobile ? 'dynamic_lg' : 'xl'}
              className='relative z-[2] mt-5 w-max rounded-full bg-[#5F2EEA] !p-2 text-sm text-white lg:!pl-4 lg:text-base'
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
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              </div>
            </LinkButton>

            <PromotionBannerStarsMobile className='absolute bottom-0 right-0 mt-4 block md:hidden' />
            <PromotionBannerStars className='absolute bottom-0 right-0 mt-4 hidden md:block' />
          </article>

          <div className='container grid grid-cols-2 gap-4 xl:grid-cols-3'>
            {cardsData.map((card, index) => (
              <article
                key={index}
                className='flex flex-col gap-1.5 overflow-x-hidden rounded-2xl border border-[#F5F3FF] bg-card p-2.5 text-card-foreground md:gap-3 md:p-4 lg:px-6'
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
              <header className='p-2 md:mb-4 md:p-4 pt-0'>
                <h1 className='font-inter text-base md:text-xl font-medium'>
                  Conversations
                </h1>
              </header>
              <div>
                {data?.data.conversations.length ? (
                  <>
                    {data?.data.conversations.map(conversation => (
                      <div key={conversation.id} className='mb-0.5'>
                        <Link
                          key={conversation.id}
                          href={`/business/messages/${conversation.id}`}
                          className={cn(
                            'flex w-full items-center gap-2 bg-[#F8FAFC] p-2 md:px-4 md:py-2.5 text-left transition-colors hover:bg-muted/50 md:gap-3',
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
                            <p className='text-sm md:text-base font-medium'>
                              {conversation.customer.first_name}{' '}
                              {conversation.customer.last_name}
                            </p>
                            <p className='text-xs line-clamp-2 min-h-[2lh] md:text-[0.825rem] leading-tight text-[#111927]'>
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
                  <EmptyState
                    media={<EmptyChatMedia />}
                    description='Your conversations will be displayed here.'
                  />
                )}
              </div>
            </div>

            {/* ///////////////////////////////////////////////////////////////////// */}
            {/* /////////////              REVIEWS              ///////////////////// */}
            {/* ///////////////////////////////////////////////////////////////////// */}
            <div className='rounded-xl bg-white p-4'>
              <h3 className='text-center font-karma text-3xl font-bold lg:mt-12 xl:text-6xl'>
                {data?.data.average_review_rating !== undefined
                  ? data.data.average_review_rating.toFixed(1)
                  : '0.0'}
              </h3>
              <RatingStars rating={data?.data.average_review_rating || 0} />
              <p className='mt-2 text-center text-sm font-medium text-[#111927] md:text-sm'>
                {data?.data.number_of_reviews || 0} reviews
              </p>

              {data?.data.performances && (
                <DashboardPerformanceChart
                  performances={data?.data.performances}
                />
              )}
            </div>
          </section>
        </section>

        <aside className='max-xl:hidden'>
          <Notifications />
        </aside>
      </div>
    </div>
  );
}
