'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState, useMemo, Suspense, useRef } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import {
  useCurrentUser,
  useStartChat,
  useGetUserChats,
} from '@/app/(clients)/misc/api/user';
import { useSession } from 'next-auth/react';
import type { BusinessDetail, BusinessReviewThread } from '@/types/api';
import { useBusinessDetails } from '@/app/(business)/misc/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AccessDeniedModal,
  Button,
  Card,
  EmptyState,
  LinkButton,
} from '@/components/ui';
import {
  DelveIcon,
  EmptySavedBusinessesIcon,
  VerifiedIcon,
} from '../../misc/icons';
import { useBooleanStateControl } from '@/hooks';
import {
  BusinessDetailsGalleryCarousel,
  BusinessServicesAccordion,
} from '../../misc/components';

import { useBusinessReviews } from '@/app/(business)/misc/api/reviews';
import { ReviewPromptModal } from '@/components/ui/ReviewPromptModal';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSubmitBusinessReview } from '../../misc/api';
import {
  RatingStars,
  RatingStarsSquare,
} from '@/app/(business)/misc/components/icons';
import { ReviewRepliesSheet } from '@/components/ui/ReviewRepliesSheet';

interface BusinessDetailsClientProps {
  business: BusinessDetail;
}

const positions = [
  { col: '1/5', row: '1/8' },
  { col: '5/12', row: '2/8' },
  { col: '12/16', row: '1/6' },
  { col: '1/4', row: '8/13' },
  { col: '4/12', row: '8/13' },
  { col: '12/16', row: '6/13' },
];

const BusinessDetailsClient = ({ business }: BusinessDetailsClientProps) => {
  // Ref for reviews carousel
  const reviewsContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSaved, toggleSave, setShowLoginAlert, showLoginAlert } =
    useSavedBusinessesContext();
  const params = useSearchParams();
  const ref = params.get('ref');
  const { data: businessDetails } = useBusinessDetails(
    business.id,
    ref as string | undefined
  );
  const submitReviewMutation = useSubmitBusinessReview();
  const { data: session } = useSession();
  const hasValidAccessToken = Boolean(
    session?.user?.accessToken && String(session.user.accessToken).length > 0
  );
  const { data: currentUserResp } = useCurrentUser(hasValidAccessToken);
  const { data: userChatsResp } = useGetUserChats(hasValidAccessToken);
  const startChatMutation = useStartChat();
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const {
    state: isAccessDeniedModalOpen,
    setState: setAccessDeniedModalState,
  } = useBooleanStateControl();

  const closeAccessDeniedModal = (state: boolean) => {
    setShowLoginAlert(state);
    setAccessDeniedModalState(state);
  };
  const {
    state: isImageCarouselModalOpen,
    setTrue: openImageCarouselModal,
    setFalse: closeImageCarouselModal,
  } = useBooleanStateControl();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    openImageCarouselModal();
  };

  const isOwner = useMemo(() => {
    const currentUserId = currentUserResp?.user?.id;
    const ownerId = business?.owner?.id;
    return Boolean(ownerId && currentUserId && ownerId === currentUserId);
  }, [currentUserResp?.user?.id, business?.owner?.id]);

  const isBusinessSaved = isSaved(business.id);
  const handleBookmarkClick = async () => {
    await toggleSave(business.id);
  };
  console.log(isBusinessSaved, handleBookmarkClick);

  const navLink = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'More', href: '#more' },
  ];

  // active section/hash state for nav styling
  const [activeHash, setActiveHash] = useState<string>(() => {
    if (typeof window !== 'undefined') return window.location.hash || '#about';
    return '#about';
  });

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || '#about');
    // set initial in case mount happens after navigation
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  console.log(businessDetails);

  const handleStartChat = async () => {
    // If user not logged in, show auth modal
    if (!currentUserResp?.user) {
      setAccessDeniedModalState(true);
      return;
    }

    setIsLoadingChat(true);
    try {
      // Check if there's an existing chat with this business
      const existingChat = userChatsResp?.data?.find(
        chat => chat.business.id === business.id
      );

      if (existingChat) {
        // If chat exists, navigate to it
        router.push(`/chats/${existingChat.id}`);
      } else {
        // If no existing chat, create a new one
        const response = await startChatMutation.mutateAsync({
          business_id: business.id,
        });

        // Navigate to the newly created chat
        router.push(`/chats/${response.data.id}`);
      }
    } catch (err: any) {
      console.error('Failed to start/get chat for business', err);
      toast.error('Failed to start chat', {
        description: (err as any)?.message || 'Please try again.',
      });
    } finally {
      setIsLoadingChat(false);
    }
  };

  const googleMapsApiKey = process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'] || '';

  // Reviews section state
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewForReplies, setSelectedReviewForReplies] =
    useState<BusinessReviewThread | null>(null);
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = useBusinessReviews(business.id);
  const reviews = reviewsData?.data || [];
  const averageRating =
    business.average_review_rating ||
    (reviews.length
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
      : 0);

  return (
    <Suspense fallback={<div>Loading business details...</div>}>
      <main className='relative mx-auto py-8 pt-16 lg:pt-20'>
        <div
          className={cn(`relative mb-8 overflow-hidden`)}
          style={{
            backgroundImage: `url(${business.thumbnail!})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Hero Image */}
          <div className='relative min-h-[50vh] w-full bg-[#00000075] px-5 pb-24 pt-14 text-white md:px-16 xl:px-32'>
            <div className='flex items-center justify-between'>
              <div className='hidden gap-14 lg:flex'>
                {navLink.map((links, index) => {
                  const isActive = activeHash === links.href;
                  return (
                    <div key={index}>
                      <Link
                        href={links.href}
                        onClick={() => setActiveHash(links.href)}
                        className={cn(
                          'text-sm font-medium transition-colors',
                          isActive
                            ? 'text-[#C3B5FD] underline decoration-[#C3B5FD] decoration-2'
                            : 'text-white'
                        )}
                      >
                        {links.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
              {business?.admin_approval_status == 'approved' && (
                <button className='flex min-w-max shrink-0 items-center gap-1.5 rounded-lg border border-[#D9D6FE] bg-[#F5F3FF] p-1.5 text-[0.625rem] text-[#551FB9] md:rounded-2xl md:px-4 md:py-2 md:text-sm'>
                  <VerifiedIcon className='size-3.5 md:size-5' />
                  Verified By Delve <DelveIcon className='size-3.5 md:size-5' />
                </button>
              )}
            </div>
            <div className='mt-48 lg:mt-96'>
              <div className='relative size-12 overflow-hidden rounded-full lg:size-24 xl:size-28'>
                <Image
                  src={business?.logo || '/default-logo.png'}
                  alt={`${business.name} logo`}
                  objectFit='cover'
                  fill
                />
              </div>
              <section className='mt-4 space-y-4'>
                <h2 className='md:text-lg xl:text-xl'>{business.name}</h2>
                {!!business.website && (
                  <p className='flex items-center gap-2 text-xs md:text-sm'>
                    <span>
                      <svg
                        width='20'
                        height='20'
                        className='!size-4 xl:!size-5'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM1.5 10C1.5 9.24328 1.59888 8.50965 1.78444 7.81134L2.16582 7.73157L2.20482 7.72354C2.23949 7.71645 2.29122 7.70595 2.35848 7.69252C2.49301 7.66567 2.68956 7.62714 2.93578 7.58082C3.28583 7.51498 3.73568 7.43352 4.25 7.34755V12.6525C3.73568 12.5665 3.28583 12.485 2.93578 12.4192C2.68956 12.3729 2.49301 12.3343 2.35848 12.3075C2.29122 12.2941 2.23949 12.2835 2.20482 12.2765L2.16582 12.2684L1.78444 12.1887C1.59888 11.4903 1.5 10.7567 1.5 10ZM2.6585 6.10668C3.07176 6.02894 3.62055 5.93 4.25 5.82721V3.73994C3.50467 4.42491 2.882 5.24125 2.41871 6.15227C2.49249 6.13809 2.57258 6.12284 2.6585 6.10668ZM9.25 13.2333C8.13402 13.1863 6.8892 13.0461 5.75 12.8846V7.11537C6.8892 6.95393 8.13402 6.81368 9.25 6.76672V13.2333ZM5.75 5.60076C6.87834 5.44519 8.11732 5.31009 9.25 5.26553V1.53263C7.98325 1.64338 6.79615 2.03198 5.75 2.63715V5.60076ZM14.25 12.8846C13.1108 13.0461 11.866 13.1863 10.75 13.2333V6.76672C11.866 6.81368 13.1108 6.95393 14.25 7.11537V12.8846ZM10.75 5.26553C11.8827 5.31009 13.1217 5.44519 14.25 5.60076V2.63715C13.2038 2.03198 12.0167 1.64338 10.75 1.53263V5.26553ZM17.0642 12.4192C16.7142 12.485 16.2643 12.5665 15.75 12.6525V7.34755C16.2643 7.43352 16.7142 7.51498 17.0642 7.58082C17.3104 7.62714 17.507 7.66567 17.6415 7.69252C17.7088 7.70595 17.7605 7.71645 17.7952 7.72354L17.8342 7.73157L17.8437 7.73354L18.2156 7.81134C18.4011 8.50965 18.5 9.24328 18.5 10C18.5 10.7567 18.4011 11.4903 18.2156 12.1887L17.8342 12.2684L17.7952 12.2765C17.7605 12.2835 17.7088 12.2941 17.6415 12.3075C17.507 12.3343 17.3104 12.3729 17.0642 12.4192ZM17.3415 6.10668C17.4274 6.12284 17.5075 6.13809 17.5813 6.15227C17.118 5.24125 16.4953 4.42491 15.75 3.73994V5.82721C16.3794 5.93 16.9282 6.02894 17.3415 6.10668ZM15.75 16.2601C16.4953 15.5751 17.118 14.7587 17.5813 13.8477C17.5075 13.8619 17.4274 13.8772 17.3415 13.8933C16.9282 13.9711 16.3794 14.07 15.75 14.1728V16.2601ZM10.75 14.7345C11.8827 14.6899 13.1217 14.5548 14.25 14.3992V17C14.25 17.1148 14.2758 17.2235 14.3219 17.3208C13.2583 17.95 12.0459 18.3541 10.75 18.4674V14.7345ZM5.75 14.3992C6.87834 14.5548 8.11732 14.6899 9.25 14.7345V18.4674C7.95415 18.3541 6.74165 17.95 5.67812 17.3208C5.72422 17.2235 5.75 17.1148 5.75 17V14.3992ZM2.6585 13.8933C3.07176 13.9711 3.62055 14.07 4.25 14.1728V16.2601C3.50467 15.5751 2.882 14.7587 2.41871 13.8477C2.49249 13.8619 2.57258 13.8772 2.6585 13.8933Z'
                          fill='#ffffff'
                        />
                      </svg>
                    </span>
                    <Link
                      href={business.website}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {business.website}
                    </Link>
                  </p>
                )}
                {!!business.phone_number && (
                  <p className='flex items-center gap-2 text-xs md:text-sm'>
                    <span>
                      <svg
                        width='19'
                        height='19'
                        className='!size-4 xl:!size-5'
                        viewBox='0 0 19 19'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M0.733164 2.82477L1.5926 1.1059C2.2031 -0.115093 3.83038 -0.379167 4.79567 0.586115L7.0774 2.86785C7.68612 3.47657 7.83703 4.40652 7.45204 5.17649L7.18931 5.70195C6.76661 6.54736 6.75958 7.54773 7.25212 8.35445C7.63772 8.986 8.13138 9.7113 8.62303 10.2029C9.04675 10.6267 9.64403 11.0519 10.2053 11.4081C11.1458 12.0052 12.3457 11.8926 13.2431 11.2324C14.0433 10.6436 15.1561 10.7403 15.8427 11.4583L17.8022 13.5071C18.7328 14.4802 18.4555 16.0762 17.2512 16.6783L15.4749 17.5665C14.0944 18.2567 12.5303 18.55 11.0711 18.047C9.31835 17.4428 6.80647 16.2348 4.43566 13.864C2.06484 11.4932 0.856857 8.9813 0.252677 7.22858C-0.250312 5.7694 0.0429205 4.20526 0.733164 2.82477ZM2.07481 3.4956L2.93424 1.77672C3.08687 1.47147 3.49369 1.40546 3.73501 1.64678L6.01674 3.92851C6.16892 4.08069 6.20665 4.31318 6.1104 4.50567L5.84767 5.03113C5.22203 6.28242 5.17859 7.8368 5.97188 9.1361C6.37059 9.78913 6.93951 10.6407 7.56237 11.2636C8.10404 11.8053 8.81223 12.3006 9.40141 12.6746C10.9312 13.6456 12.8035 13.4181 14.132 12.4406C14.3249 12.2987 14.5932 12.322 14.7587 12.495L16.7181 14.5439C16.9508 14.7872 16.8815 15.1862 16.5804 15.3367L14.8041 16.2249C13.6526 16.8006 12.5184 16.9593 11.5599 16.6289C9.9689 16.0804 7.67036 14.9774 5.49632 12.8033C3.32227 10.6293 2.21922 8.33076 1.67079 6.73974C1.3404 5.78127 1.4991 4.64701 2.07481 3.4956Z'
                          fill='#ffffff'
                        />
                      </svg>
                    </span>
                    <Link
                      href={`tel:${business.phone_number}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {business.phone_number}
                    </Link>
                  </p>
                )}

                <div className='flex items-center gap-3'>
                  {(
                    [
                      { key: 'instagram', icon: 'instagram_link' },
                      { key: 'facebook', icon: 'facebook_link' },
                      { key: 'whatsapp', icon: 'whatsapp_link' },
                    ] as const
                  ).map(({ key, icon }) => {
                    type SocialKey =
                      | 'instagram'
                      | 'facebook'
                      | 'whatsapp'
                      | 'twitter'
                      | 'tiktok';
                    const url = business.social_links?.[key as SocialKey];
                    if (!url) return null;
                    return (
                      <Link
                        key={key}
                        className='flex items-center gap-2 rounded-md bg-[#00000047] p-1.5 text-xs'
                        href={url}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <span>
                          {/* Use the same SVGs as before, based on icon */}
                          {icon === 'instagram_link' ? (
                            <svg
                              width='20'
                              height='20'
                              className='!size-4 xl:!size-5'
                              viewBox='0 0 20 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M10 15.5C12.7614 15.5 15 13.2614 15 10.5C15 7.73858 12.7614 5.5 10 5.5C7.23858 5.5 5 7.73858 5 10.5C5 13.2614 7.23858 15.5 10 15.5ZM10 14C11.933 14 13.5 12.433 13.5 10.5C13.5 8.567 11.933 7 10 7C8.067 7 6.5 8.567 6.5 10.5C6.5 12.433 8.067 14 10 14Z'
                                fill='#ffffff'
                              />
                              <path
                                d='M16 4.5C16 5.32843 15.3284 6 14.5 6C13.6716 6 13 5.32843 13 4.5C13 3.67157 13.6716 3 14.5 3C15.3284 3 16 3.67157 16 4.5Z'
                                fill='#ffffff'
                              />
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M0.803847 3C0 4.3923 0 6.26154 0 10C0 13.7385 0 15.6077 0.803847 17C1.33046 17.9121 2.08788 18.6695 3 19.1962C4.3923 20 6.26154 20 10 20C13.7385 20 15.6077 20 17 19.1962C17.9121 18.6695 18.6695 17.9121 19.1962 17C20 15.6077 20 13.7385 20 10C20 6.26154 20 4.3923 19.1962 3C18.6695 2.08788 17.9121 1.33046 17 0.803847C15.6077 0 13.7385 0 10 0C6.26154 0 4.3923 0 3 0.803847C2.08788 1.33046 1.33046 2.08788 0.803847 3ZM5.75559 18.4056C6.78082 18.4986 8.10316 18.5 10 18.5C11.8968 18.5 13.2192 18.4986 14.2444 18.4056C15.249 18.3146 15.8202 18.1453 16.25 17.8971C16.9341 17.5022 17.5022 16.9341 17.8971 16.25C18.1453 15.8202 18.3146 15.249 18.4056 14.2444C18.4986 13.2192 18.5 11.8968 18.5 10C18.5 8.10316 18.4986 6.78082 18.4056 5.75559C18.3146 4.75097 18.1453 4.1798 17.8971 3.75C17.5022 3.06591 16.9341 2.49784 16.25 2.10289C15.8202 1.85474 15.249 1.68541 14.2444 1.59436C13.2192 1.50144 11.8968 1.5 10 1.5C8.10316 1.5 6.78082 1.50144 5.75559 1.59436C4.75097 1.68541 4.1798 1.85474 3.75 2.10289C3.06591 2.49784 2.49784 3.06591 2.10289 3.75C1.85474 4.1798 1.68541 4.75097 1.59436 5.75559C1.50144 6.78082 1.5 8.10316 1.5 10C1.5 11.8968 1.50144 13.2192 1.59436 14.2444C1.68541 15.249 1.85474 15.8202 2.10289 16.25C2.49784 16.9341 3.06591 17.5022 3.75 17.8971C4.1798 18.1453 4.75097 18.3146 5.75559 18.4056Z'
                                fill='#ffffff'
                              />
                            </svg>
                          ) : icon === 'facebook_link' ? (
                            <svg
                              width='20'
                              height='20'
                              className='!size-4 xl:!size-5'
                              viewBox='0 0 20 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M0 10C0 6.26154 0 4.3923 0.803847 3C1.33046 2.08788 2.08788 1.33046 3 0.803847C4.3923 0 6.26154 0 10 0C13.7385 0 15.6077 0 17 0.803847C17.9121 1.33046 18.6695 2.08788 19.1962 3C20 4.3923 20 6.26154 20 10C20 13.7385 20 15.6077 19.1962 17C18.6695 17.9121 17.9121 18.6695 17 19.1962C15.6077 20 13.7385 20 10 20C6.26154 20 4.3923 20 3 19.1962C2.08788 18.6695 1.33046 17.9121 0.803847 17C0 15.6077 0 13.7385 0 10ZM8.54348 18.4977C7.38997 18.4921 6.49542 18.4727 5.75559 18.4056C4.75097 18.3146 4.1798 18.1453 3.75 17.8971C3.06591 17.5022 2.49784 16.9341 2.10289 16.25C1.85474 15.8202 1.68541 15.249 1.59436 14.2444C1.50144 13.2192 1.5 11.8968 1.5 10C1.5 8.10316 1.50144 6.78082 1.59436 5.75559C1.68541 4.75097 1.85474 4.1798 2.10289 3.75C2.49784 3.06591 3.06591 2.49784 3.75 2.10289C4.1798 1.85474 4.75097 1.68541 5.75559 1.59436C6.78082 1.50144 8.10316 1.5 10 1.5C11.8968 1.5 13.2192 1.50144 14.2444 1.59436C15.249 1.68541 15.8202 1.85474 16.25 2.10289C16.9341 2.49784 17.5022 3.06591 17.8971 3.75C18.1453 4.1798 18.3146 4.75097 18.4056 5.75559C18.4986 6.78082 18.5 8.10316 18.5 10C18.5 11.8968 18.4986 13.2192 18.4056 14.2444C18.3146 15.249 18.1453 15.8202 17.8971 16.25C17.5022 16.9341 16.9341 17.5022 16.25 17.8971C15.8202 18.1453 15.249 18.3146 14.2444 18.4056C13.4678 18.476 12.5207 18.4939 11.2826 18.4985V12.7342H14.2174L14.6087 10.0759H11.2826V7.98734C11.2826 7.25329 11.8958 6.65823 12.6522 6.65823H15V4H12.6522C10.383 4 8.54348 5.78519 8.54348 7.98734V10.0759H6V12.7342H8.54348V18.4977Z'
                                fill='#ffffff'
                              />
                            </svg>
                          ) : (
                            <svg
                              width='20'
                              height='16'
                              className='!size-4 xl:!size-5'
                              viewBox='0 0 20 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M20 1.89709C19.2566 2.23328 18.4634 2.45666 17.6344 2.55559C18.4788 2.06001 19.1071 1.24251 19.3783 0.266659C18.5851 0.723327 17.7083 1.05559 16.7722 1.22251C16.0211 0.432511 15.0022 -0.0667114 13.8722 0.000255823C11.9822 0.000255823 10.4788 1.50333 10.4788 3.39333C10.4788 3.72951 10.5222 4.03328 10.5944 4.31001C7.15996 4.14709 4.09883 2.63166 1.99661 0.393327C1.62996 1.05559 1.4322 1.83166 1.4322 2.66666C1.4322 4.12251 2.15996 5.36833 3.32996 6.09833C2.65996 6.08001 2.03483 5.90833 1.51839 5.63001V5.69166C1.51839 7.59166 2.90396 9.17333 4.76396 9.55666C4.41396 9.65666 4.03483 9.70833 3.63261 9.70833C3.35661 9.70833 3.09083 9.68001 2.83483 9.63001C3.37261 11.1817 4.80396 12.3183 6.54839 12.3583C5.22083 13.3867 3.51396 14.0333 1.6322 14.0333C1.29596 14.0333 0.966611 14.0158 0.64339 13.9825C2.40396 15.0983 4.52396 15.7083 6.80396 15.7083C13.8622 15.7083 17.9984 10.2083 17.9984 4.89333C17.9984 4.73166 17.9944 4.57333 17.9866 4.41833C18.7898 3.83166 19.4471 3.06666 20 2.18333V1.89709Z'
                                fill='#ffffff'
                              />
                            </svg>
                          )}
                        </span>
                        <span className='sr-only'>{url}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className=''>
                  {isOwner ? (
                    <LinkButton
                      href='/business/settings/general'
                      variant={'unstyled'}
                      className='mt-6 border border-[#FCFCFD] bg-[#0000006B] !py-6 md:px-20 md:py-8'
                    >
                      Business Profile
                    </LinkButton>
                  ) : (
                    <Button
                      onClick={handleStartChat}
                      variant={'unstyled'}
                      disabled={isLoadingChat}
                      className='mt-6 border border-[#FCFCFD] bg-[#0000006B] !py-6 md:px-20 md:py-8'
                    >
                      {isLoadingChat ? 'Starting chat...' : 'Send us a message'}
                    </Button>
                  )}{' '}
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className='container mx-auto px-4 py-8 md:px-8 lg:py-12'>
          <section id='about' className=''>
            <h2 className='mb-2 font-karma text-3xl font-medium text-[#FF9C66] md:mb-4 md:text-4xl lg:text-5xl'>
              Get to know us
            </h2>
            <p className='text-[0.95rem] leading-7 text-[#000000]'>
              {business.description ||
                'No description available for this business.'}
            </p>
            <div className='mt-8 grid grid-cols-3 gap-4 xl:mt-12 xl:gap-8'>
              {business.images?.slice(0, 3).map((image, index) => {
                const src = typeof image === 'string' ? image : image.image;
                return (
                  <div
                    key={
                      typeof image === 'object' && 'id' in image
                        ? image.id
                        : index
                    }
                    className='relative aspect-[470/539] cursor-pointer overflow-hidden bg-gray-200'
                    onClick={() => handleImageClick(index)}
                  >
                    {src && (
                      <Image
                        src={src}
                        alt={
                          typeof image === 'string'
                            ? `Business image ${index + 1}`
                            : `Business image ${index + 1}`
                        }
                        fill
                        className='object-cover transition-transform duration-300 hover:scale-105'
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section
          id='services'
          className='container mx-auto grid gap-x-8 gap-y-4 py-8 lg:grid-cols-[1fr,minmax(0,400px)] lg:gap-4 lg:py-12'
        >
          <div id='about' className='container mx-auto px-4 md:px-10'>
            <h2 className='mb-2 font-karma text-3xl font-medium text-[#FF9C66] md:mb-4 md:text-4xl lg:text-5xl'>
              Services
            </h2>

            <div className=''>
              {business.services && business.services.length > 0 ? (
                <BusinessServicesAccordion services={business.services} />
              ) : (
                <div className='text-gray-400'>
                  No services listed.
                  <EmptyState
                    media={<EmptySavedBusinessesIcon />}
                    title='No services available'
                    description='This business has not listed any services yet.'
                  />
                </div>
              )}
            </div>
          </div>

          {business.address && business.address && (
            <div className='max-md:px-4'>
              <Card className='border !border-[#E3E8EF] p-2 ring-0 md:p-4'>
                <div className='space-y-4'>
                  {googleMapsApiKey && business.address && (
                    <iframe
                      width='100%'
                      height='200'
                      className='rounded-lg !border-none !outline-none'
                      loading='lazy'
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${business.address},${business.address}&zoom=15`}
                    />
                  )}
                  <p className='flex items-center gap-2 text-xs'>
                    <span>
                      <svg
                        width='18'
                        height='20'
                        className='!size-4 xl:!size-5'
                        viewBox='0 0 18 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M13 9C13 11.2091 11.2091 13 9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9ZM11.5 9C11.5 10.3807 10.3807 11.5 9 11.5C7.61929 11.5 6.5 10.3807 6.5 9C6.5 7.61929 7.61929 6.5 9 6.5C10.3807 6.5 11.5 7.61929 11.5 9Z'
                          fill='#000'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M7.52835 19.3518C3.34219 17.2505 0.449096 13.4645 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C17.5544 13.4294 14.3295 17.1909 10.4481 19.3019C9.54146 19.7951 8.45077 19.8149 7.52835 19.3518ZM9.73143 17.9842C9.25447 18.2437 8.68285 18.253 8.2013 18.0113C4.43094 16.1186 1.91589 12.7761 1.50036 8.92558C1.54029 4.81772 4.8827 1.5 9 1.5C13.1172 1.5 16.4595 4.8175 16.4996 8.92516C16.0887 12.6886 13.2957 16.0456 9.73143 17.9842Z'
                          fill='#000'
                        />
                      </svg>
                    </span>

                    {business.address}
                  </p>

                  <p className='flex items-center gap-2 text-xs'>
                    <span>
                      <svg
                        width='19'
                        height='19'
                        className='!size-4 xl:!size-5'
                        viewBox='0 0 19 19'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M0.733164 2.82477L1.5926 1.1059C2.2031 -0.115093 3.83038 -0.379167 4.79567 0.586115L7.0774 2.86785C7.68612 3.47657 7.83703 4.40652 7.45204 5.17649L7.18931 5.70195C6.76661 6.54736 6.75958 7.54773 7.25212 8.35445C7.63772 8.986 8.13138 9.7113 8.62303 10.2029C9.04675 10.6267 9.64403 11.0519 10.2053 11.4081C11.1458 12.0052 12.3457 11.8926 13.2431 11.2324C14.0433 10.6436 15.1561 10.7403 15.8427 11.4583L17.8022 13.5071C18.7328 14.4802 18.4555 16.0762 17.2512 16.6783L15.4749 17.5665C14.0944 18.2567 12.5303 18.55 11.0711 18.047C9.31835 17.4428 6.80647 16.2348 4.43566 13.864C2.06484 11.4932 0.856857 8.9813 0.252677 7.22858C-0.250312 5.7694 0.0429205 4.20526 0.733164 2.82477ZM2.07481 3.4956L2.93424 1.77672C3.08687 1.47147 3.49369 1.40546 3.73501 1.64678L6.01674 3.92851C6.16892 4.08069 6.20665 4.31318 6.1104 4.50567L5.84767 5.03113C5.22203 6.28242 5.17859 7.8368 5.97188 9.1361C6.37059 9.78913 6.93951 10.6407 7.56237 11.2636C8.10404 11.8053 8.81223 12.3006 9.40141 12.6746C10.9312 13.6456 12.8035 13.4181 14.132 12.4406C14.3249 12.2987 14.5932 12.322 14.7587 12.495L16.7181 14.5439C16.9508 14.7872 16.8815 15.1862 16.5804 15.3367L14.8041 16.2249C13.6526 16.8006 12.5184 16.9593 11.5599 16.6289C9.9689 16.0804 7.67036 14.9774 5.49632 12.8033C3.32227 10.6293 2.21922 8.33076 1.67079 6.73974C1.3404 5.78127 1.4991 4.64701 2.07481 3.4956Z'
                          fill='#000'
                        />
                      </svg>
                    </span>
                    {business.phone_number}
                  </p>
                  {!!business.website && (
                    <p className='flex items-center gap-2 text-xs'>
                      <span>
                        <svg
                          width='20'
                          height='20'
                          className='!size-4 xl:!size-5'
                          viewBox='0 0 20 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM1.5 10C1.5 9.24328 1.59888 8.50965 1.78444 7.81134L2.16582 7.73157L2.20482 7.72354C2.23949 7.71645 2.29122 7.70595 2.35848 7.69252C2.49301 7.66567 2.68956 7.62714 2.93578 7.58082C3.28583 7.51498 3.73568 7.43352 4.25 7.34755V12.6525C3.73568 12.5665 3.28583 12.485 2.93578 12.4192C2.68956 12.3729 2.49301 12.3343 2.35848 12.3075C2.29122 12.2941 2.23949 12.2835 2.20482 12.2765L2.16582 12.2684L1.78444 12.1887C1.59888 11.4903 1.5 10.7567 1.5 10ZM2.6585 6.10668C3.07176 6.02894 3.62055 5.93 4.25 5.82721V3.73994C3.50467 4.42491 2.882 5.24125 2.41871 6.15227C2.49249 6.13809 2.57258 6.12284 2.6585 6.10668ZM9.25 13.2333C8.13402 13.1863 6.8892 13.0461 5.75 12.8846V7.11537C6.8892 6.95393 8.13402 6.81368 9.25 6.76672V13.2333ZM5.75 5.60076C6.87834 5.44519 8.11732 5.31009 9.25 5.26553V1.53263C7.98325 1.64338 6.79615 2.03198 5.75 2.63715V5.60076ZM14.25 12.8846C13.1108 13.0461 11.866 13.1863 10.75 13.2333V6.76672C11.866 6.81368 13.1108 6.95393 14.25 7.11537V12.8846ZM10.75 5.26553C11.8827 5.31009 13.1217 5.44519 14.25 5.60076V2.63715C13.2038 2.03198 12.0167 1.64338 10.75 1.53263V5.26553ZM17.0642 12.4192C16.7142 12.485 16.2643 12.5665 15.75 12.6525V7.34755C16.2643 7.43352 16.7142 7.51498 17.0642 7.58082C17.3104 7.62714 17.507 7.66567 17.6415 7.69252C17.7088 7.70595 17.7605 7.71645 17.7952 7.72354L17.8342 7.73157L17.8437 7.73354L18.2156 7.81134C18.4011 8.50965 18.5 9.24328 18.5 10C18.5 10.7567 18.4011 11.4903 18.2156 12.1887L17.8342 12.2684L17.7952 12.2765C17.7605 12.2835 17.7088 12.2941 17.6415 12.3075C17.507 12.3343 17.3104 12.3729 17.0642 12.4192ZM17.3415 6.10668C17.4274 6.12284 17.5075 6.13809 17.5813 6.15227C17.118 5.24125 16.4953 4.42491 15.75 3.73994V5.82721C16.3794 5.93 16.9282 6.02894 17.3415 6.10668ZM15.75 16.2601C16.4953 15.5751 17.118 14.7587 17.5813 13.8477C17.5075 13.8619 17.4274 13.8772 17.3415 13.8933C16.9282 13.9711 16.3794 14.07 15.75 14.1728V16.2601ZM10.75 14.7345C11.8827 14.6899 13.1217 14.5548 14.25 14.3992V17C14.25 17.1148 14.2758 17.2235 14.3219 17.3208C13.2583 17.95 12.0459 18.3541 10.75 18.4674V14.7345ZM5.75 14.3992C6.87834 14.5548 8.11732 14.6899 9.25 14.7345V18.4674C7.95415 18.3541 6.74165 17.95 5.67812 17.3208C5.72422 17.2235 5.75 17.1148 5.75 17V14.3992ZM2.6585 13.8933C3.07176 13.9711 3.62055 14.07 4.25 14.1728V16.2601C3.50467 15.5751 2.882 14.7587 2.41871 13.8477C2.49249 13.8619 2.57258 13.8772 2.6585 13.8933Z'
                            fill='#ffffff'
                          />
                        </svg>
                      </span>
                      <Link
                        href={business.website}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {business.website}
                      </Link>
                    </p>
                  )}

                  <div className='flex items-center gap-3 pt-4'>
                    {[
                      { key: 'instagram', icon: 'instagram_link' },
                      { key: 'facebook', icon: 'facebook_link' },
                      { key: 'whatsapp', icon: 'whatsapp_link' },
                    ].map(({ key, icon }) => {
                      type SocialKey =
                        | 'instagram'
                        | 'facebook'
                        | 'whatsapp'
                        | 'twitter'
                        | 'tiktok';
                      const url = business.social_links?.[key as SocialKey];
                      if (!url) return null;
                      return (
                        <Link
                          key={key}
                          className='flex items-center gap-2 rounded-lg border border-[##FCFCFD] p-1.5 text-xs'
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <span>
                            {/* Use the same SVGs as before, based on icon */}
                            {icon === 'instagram_link' ? (
                              <svg
                                width='20'
                                height='20'
                                className='!size-4 xl:!size-5'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  fillRule='evenodd'
                                  clipRule='evenodd'
                                  d='M10 15.5C12.7614 15.5 15 13.2614 15 10.5C15 7.73858 12.7614 5.5 10 5.5C7.23858 5.5 5 7.73858 5 10.5C5 13.2614 7.23858 15.5 10 15.5ZM10 14C11.933 14 13.5 12.433 13.5 10.5C13.5 8.567 11.933 7 10 7C8.067 7 6.5 8.567 6.5 10.5C6.5 12.433 8.067 14 10 14Z'
                                  fill='#000'
                                />
                                <path
                                  d='M16 4.5C16 5.32843 15.3284 6 14.5 6C13.6716 6 13 5.32843 13 4.5C13 3.67157 13.6716 3 14.5 3C15.3284 3 16 3.67157 16 4.5Z'
                                  fill='#000'
                                />
                                <path
                                  fillRule='evenodd'
                                  clipRule='evenodd'
                                  d='M0.803847 3C0 4.3923 0 6.26154 0 10C0 13.7385 0 15.6077 0.803847 17C1.33046 17.9121 2.08788 18.6695 3 19.1962C4.3923 20 6.26154 20 10 20C13.7385 20 15.6077 20 17 19.1962C17.9121 18.6695 18.6695 17.9121 19.1962 17C20 15.6077 20 13.7385 20 10C20 6.26154 20 4.3923 19.1962 3C18.6695 2.08788 17.9121 1.33046 17 0.803847C15.6077 0 13.7385 0 10 0C6.26154 0 4.3923 0 3 0.803847C2.08788 1.33046 1.33046 2.08788 0.803847 3ZM5.75559 18.4056C6.78082 18.4986 8.10316 18.5 10 18.5C11.8968 18.5 13.2192 18.4986 14.2444 18.4056C15.249 18.3146 15.8202 18.1453 16.25 17.8971C16.9341 17.5022 17.5022 16.9341 17.8971 16.25C18.1453 15.8202 18.3146 15.249 18.4056 14.2444C18.4986 13.2192 18.5 11.8968 18.5 10C18.5 8.10316 18.4986 6.78082 18.4056 5.75559C18.3146 4.75097 18.1453 4.1798 17.8971 3.75C17.5022 3.06591 16.9341 2.49784 16.25 2.10289C15.8202 1.85474 15.249 1.68541 14.2444 1.59436C13.2192 1.50144 11.8968 1.5 10 1.5C8.10316 1.5 6.78082 1.50144 5.75559 1.59436C4.75097 1.68541 4.1798 1.85474 3.75 2.10289C3.06591 2.49784 2.49784 3.06591 2.10289 3.75C1.85474 4.1798 1.68541 4.75097 1.59436 5.75559C1.50144 6.78082 1.5 8.10316 1.5 10C1.5 11.8968 1.50144 13.2192 1.59436 14.2444C1.68541 15.249 1.85474 15.8202 2.10289 16.25C2.49784 16.9341 3.06591 17.5022 3.75 17.8971C4.1798 18.1453 4.75097 18.3146 5.75559 18.4056Z'
                                  fill='#000'
                                />
                              </svg>
                            ) : icon === 'facebook_link' ? (
                              <svg
                                width='20'
                                height='20'
                                className='!size-4 xl:!size-5'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  fillRule='evenodd'
                                  clipRule='evenodd'
                                  d='M0 10C0 6.26154 0 4.3923 0.803847 3C1.33046 2.08788 2.08788 1.33046 3 0.803847C4.3923 0 6.26154 0 10 0C13.7385 0 15.6077 0 17 0.803847C17.9121 1.33046 18.6695 2.08788 19.1962 3C20 4.3923 20 6.26154 20 10C20 13.7385 20 15.6077 19.1962 17C18.6695 17.9121 17.9121 18.6695 17 19.1962C15.6077 20 13.7385 20 10 20C6.26154 20 4.3923 20 3 19.1962C2.08788 18.6695 1.33046 17.9121 0.803847 17C0 15.6077 0 13.7385 0 10ZM8.54348 18.4977C7.38997 18.4921 6.49542 18.4727 5.75559 18.4056C4.75097 18.3146 4.1798 18.1453 3.75 17.8971C3.06591 17.5022 2.49784 16.9341 2.10289 16.25C1.85474 15.8202 1.68541 15.249 1.59436 14.2444C1.50144 13.2192 1.5 11.8968 1.5 10C1.5 8.10316 1.50144 6.78082 1.59436 5.75559C1.68541 4.75097 1.85474 4.1798 2.10289 3.75C2.49784 3.06591 3.06591 2.49784 3.75 2.10289C4.1798 1.85474 4.75097 1.68541 5.75559 1.59436C6.78082 1.50144 8.10316 1.5 10 1.5C11.8968 1.5 13.2192 1.50144 14.2444 1.59436C15.249 1.68541 15.8202 1.85474 16.25 2.10289C16.9341 2.49784 17.5022 3.06591 17.8971 3.75C18.1453 4.1798 18.3146 4.75097 18.4056 5.75559C18.4986 6.78082 18.5 8.10316 18.5 10C18.5 11.8968 18.4986 13.2192 18.4056 14.2444C18.3146 15.249 18.1453 15.8202 17.8971 16.25C17.5022 16.9341 16.9341 17.5022 16.25 17.8971C15.8202 18.1453 15.249 18.3146 14.2444 18.4056C13.4678 18.476 12.5207 18.4939 11.2826 18.4985V12.7342H14.2174L14.6087 10.0759H11.2826V7.98734C11.2826 7.25329 11.8958 6.65823 12.6522 6.65823H15V4H12.6522C10.383 4 8.54348 5.78519 8.54348 7.98734V10.0759H6V12.7342H8.54348V18.4977Z'
                                  fill='#000'
                                />
                              </svg>
                            ) : (
                              <svg
                                width='20'
                                height='16'
                                className='!size-4 xl:!size-5'
                                viewBox='0 0 20 16'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M20 1.89709C19.2566 2.23328 18.4634 2.45666 17.6344 2.55559C18.4788 2.06001 19.1071 1.24251 19.3783 0.266659C18.5851 0.723327 17.7083 1.05559 16.7722 1.22251C16.0211 0.432511 15.0022 -0.0667114 13.8722 0.000255823C11.9822 0.000255823 10.4788 1.50333 10.4788 3.39333C10.4788 3.72951 10.5222 4.03328 10.5944 4.31001C7.15996 4.14709 4.09883 2.63166 1.99661 0.393327C1.62996 1.05559 1.4322 1.83166 1.4322 2.66666C1.4322 4.12251 2.15996 5.36833 3.32996 6.09833C2.65996 6.08001 2.03483 5.90833 1.51839 5.63001V5.69166C1.51839 7.59166 2.90396 9.17333 4.76396 9.55666C4.41396 9.65666 4.03483 9.70833 3.63261 9.70833C3.35661 9.70833 3.09083 9.68001 2.83483 9.63001C3.37261 11.1817 4.80396 12.3183 6.54839 12.3583C5.22083 13.3867 3.51396 14.0333 1.6322 14.0333C1.29596 14.0333 0.966611 14.0158 0.64339 13.9825C2.40396 15.0983 4.52396 15.7083 6.80396 15.7083C13.8622 15.7083 17.9984 10.2083 17.9984 4.89333C17.9984 4.73166 17.9944 4.57333 17.9866 4.41833C18.7898 3.83166 19.4471 3.06666 20 2.18333V1.89709Z'
                                  fill='#000'
                                />
                              </svg>
                            )}
                          </span>
                          <span className='sr-only'>{url}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </section>

        <>
          <section
            id='gallery'
            className='max-w-8xl container mx-auto py-8 md:px-8 xl:py-12'
          >
            {business.images && business.images.length > 0 ? (
              <div
                className='grid gap-2.5 md:gap-5 xl:gap-8'
                style={{
                  gridTemplateColumns: 'repeat(15, 1fr)',
                  gridTemplateRows: 'repeat(12, minmax(40px, 50px))',
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => {
                  const image = business.images?.[index];
                  const src = image
                    ? typeof image === 'string'
                      ? image
                      : image.image
                    : null;

                  const pos = positions[index];

                  return (
                    <div
                      key={
                        image && typeof image === 'object' && 'id' in image
                          ? image.id
                          : index
                      }
                      onClick={() => src && handleImageClick(index)}
                      className='group relative cursor-pointer overflow-hidden bg-gray-200'
                      style={{
                        gridColumn: pos?.col,
                        gridRow: pos?.row,
                      }}
                    >
                      {/* Your Gallery overlay */}
                      {index === 1 && src && (
                        <div className='absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 bg-[#00000099]'>
                          <h3 className='font-karma text-3xl font-medium text-white lg:text-4xl xl:text-5xl 2xl:text-6xl'>
                            Gallery
                          </h3>
                          <p className='max-w-sm text-center text-xs text-white md:text-sm xl:text-base'>
                            {!!business?.category?.subcategories &&
                              business?.category?.subcategories
                                ?.map((sub: { name: any }) => sub.name)
                                .join(', ')}
                          </p>
                          <span className='mt-2 flex items-center justify-center text-sm underline'>
                            <svg
                              width='50'
                              height='50'
                              className='size-12 lg:size-16 xl:!size-[4.5rem]'
                              viewBox='0 0 50 50'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <rect
                                x='49.5'
                                y='49.5'
                                width='49'
                                height='49'
                                rx='24.5'
                                transform='rotate(-180 49.5 49.5)'
                                fill='black'
                                fill-opacity='0.28'
                              />
                              <rect
                                x='49.5'
                                y='49.5'
                                width='49'
                                height='49'
                                rx='24.5'
                                transform='rotate(-180 49.5 49.5)'
                                stroke='white'
                              />
                              <path
                                d='M20.8813 33.7133C20.5396 34.055 20.5396 34.609 20.8813 34.9508C21.223 35.2925 21.7771 35.2925 22.1188 34.9507L28.1523 28.9172C30.3164 26.7531 30.3164 23.2443 28.1523 21.0801L22.1188 15.0466C21.7771 14.7049 21.223 14.7049 20.8813 15.0466C20.5396 15.3884 20.5396 15.9424 20.8813 16.2841L26.9148 22.3176C28.3956 23.7983 28.3956 26.1991 26.9148 27.6798L20.8813 33.7133Z'
                                fill='white'
                              />
                            </svg>
                          </span>
                        </div>
                      )}

                      {src && (
                        <Image
                          src={src}
                          alt={
                            typeof image === 'string'
                              ? `Gallery image ${index + 1}`
                              : `Business image ${index + 1}`
                          }
                          fill
                          className='object-cover'
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='py-12 text-center'>
                <p className='text-gray-500'>No images available</p>
              </div>
            )}
          </section>

          {/* Fullscreen Gallery Modal */}

          <BusinessDetailsGalleryCarousel
            images={business?.images ?? []}
            initialIndex={selectedImageIndex}
            isOpen={isImageCarouselModalOpen}
            onClose={closeImageCarouselModal}
          />
        </>

        <div className='container mx-auto px-4 py-8 md:px-8 lg:py-12 xl:pt-20'>
          <section id='about' className=''>
            <h2 className='mb-2 text-center font-karma text-3xl font-medium text-[#FF9C66] md:mb-4 md:text-4xl lg:text-5xl'>
              Amenities
            </h2>
            <div className='mx-auto flex items-center justify-center gap-6 text-[0.95rem] leading-7 text-[#000000] xl:gap-14'>
              {business.amenities?.map((amenity, index) => {
                console.log(amenity, 'Amenity');
                return (
                  <div className='flex flex-col items-center gap-1' key={index}>
                    <span className='text-sm font-medium text-[#0D121C] lg:text-base'>
                      {amenity.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Reviews Section - Redesigned to match screenshots */}
        <section
          id='reviews'
          className='container mx-auto px-4 py-8 md:px-8 lg:py-16'
        >
          <header className='flex items-center justify-between'>
            <h2 className='w-full text-left font-karma text-2xl font-medium text-black'>
              Over {reviews.length}
              {reviews.length > 0 ? (reviews.length > 1 ? '+' : '') : ''}{' '}
              reviews by
              <br />
              Delve Users
            </h2>

            <nav></nav>
          </header>
          <div className='my-12 flex flex-col gap-12 md:flex-row md:items-stretch'>
            {/* Left: Summary */}
            <div className='flex flex-col items-center justify-around gap-10 md:w-1/3 lg:w-[20rem]'>
              <div className='flex w-full flex-col items-center'>
                <span className='font-karma text-5xl font-semibold text-black'>
                  {averageRating.toFixed(1)}
                </span>
                <div className='mb-1 mt-2 flex items-center'>
                  <RatingStars rating={averageRating} />
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  {reviews.length}
                  {reviews.length > 1 ? '+' : ''}{' '}
                  {reviews.length > 1 ? 'reviews' : 'review'}
                </span>
              </div>
              {/* Avatars */}
              <div className='flex -space-x-4'>
                {[
                  "/business/reviewer1.jpg",
                  "/business/reviewer2.jpg",
                  "/business/reviewer3.jpg",
                  "/business/reviewer4.jpg",
                ].slice(0, 4).map((image, index) => (
                  <Avatar
                    key={index}
                    className='h-14 w-14 border border-gray-300 ring-2 ring-white'
                  >
                      <AvatarImage
                        src={image}
                        alt={image}
                      />
                    
                  </Avatar>
                ))}
                
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className='relative flex w-full flex-col gap-6 md:w-2/3'>
              {/* Carousel Buttons */}
              {reviews.length > 2 && (
                <>
                  <button
                    className='absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow md:-left-6'
                    onClick={() => {
                      if (reviewsContainerRef.current) {
                        reviewsContainerRef.current.scrollBy({
                          left: -350,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    aria-label='Scroll left'
                    type='button'
                  >
                    <svg width='24' height='24' fill='none'>
                      <path
                        d='M15 18l-6-6 6-6'
                        stroke='#5B21B6'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                  <button
                    className='absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow md:-right-6'
                    onClick={() => {
                      if (reviewsContainerRef.current) {
                        reviewsContainerRef.current.scrollBy({
                          left: 350,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    aria-label='Scroll right'
                    type='button'
                  >
                    <svg width='24' height='24' fill='none'>
                      <path
                        d='M9 6l6 6-6 6'
                        stroke='#5B21B6'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </>
              )}
              {/* Reviews List */}
              {isReviewsLoading ? (
                <div>Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className='text-center text-lg text-gray-500'>
                  No reviews yet. Be the first to leave one!
                </div>
              ) : (
                <div
                  ref={reviewsContainerRef}
                  className='scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex h-full divide-x overflow-x-auto pb-2'
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {reviews.map(review => (
                    <div
                      key={review.id}
                      className='relative flex h-full max-w-xs flex-shrink-0 flex-grow-0 basis-80 flex-col px-5 md:basis-96 xl:px-7'
                      style={{ minWidth: '320px' }}
                    >
                      {/* Responses link */}
                      <div className='text-xs'>
                        <span
                          onClick={() => {
                            if (review.replies?.length > 0) {
                              setSelectedReviewForReplies(review);
                            }
                          }}
                          className={cn(
                            'flex cursor-pointer items-center gap-1 font-medium underline underline-offset-4',
                            !!review.replies.length
                              ? 'text-[#5B21B6]'
                              : 'text-[#9AA4B2]'
                          )}
                        >
                          <svg
                            className=''
                            width='14'
                            height='14'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <path
                              d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                              fill='currentColor'
                            />
                          </svg>
                          View {review.replies?.length || 0} response
                          {review.replies?.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      {/* Service */}
                      {(review.service || review.service_text) && (
                        <div className='mb-2 mt-5 font-inter text-base font-medium text-[#0F0F0F]'>
                          {review.service?.title || review.service_text}
                        </div>
                      )}
                      {/* Review Content */}
                      <div className='font-dm min-h- my-5 mb-4 whitespace-pre-line text-[0.9rem] font-normal text-[#514F6E] lg:mb-8 line-clamp-5'>
                        {review.content}
                      </div>
                      {/* Reviewer Name and Rating */}
                      <div className='mt-auto flex flex-col gap-3'>
                        <p className='text-base font-semibold text-black'>
                          {review.reviewer?.first_name || 'Anonymous'}{' '}
                          {review.reviewer?.last_name || ''}
                        </p>

                        <div className='flex items-center justify-between'>
                          <RatingStarsSquare
                            rating={review.rating}
                            className='justify-start'
                          />

                          <span className='ml-auto text-xs text-gray-500'>
                            {new Date(review.added_at).toLocaleString(
                              'default',
                              {
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!!hasValidAccessToken && (
              <ReviewPromptModal
                isOpen={isReviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmit={async payload => {
                  try {
                    await submitReviewMutation.mutateAsync({
                      ...payload,
                      business_id: business.id,
                    });
                    await refetchReviews();
                    setReviewModalOpen(false);
                    toast.success('Review submitted!');
                  } catch (err) {
                    toast.error('Failed to submit review', {
                      description: (err as any)?.message || 'Please try again.',
                    });
                  }
                }}
                businessName={business.name}
                businessLogo={business.logo ?? '/default-logo.png'}
                businessId={business.id}
                services={business.services!}
                notificationId={''}
              />
            )}
          </div>
          <footer>
            {isOwner ? (
              <LinkButton
                href={'/business/review-management'}
                className='w-full max-w-xs rounded-xl bg-[#5B21B6] py-7 text-base font-medium text-white'
              >
                Manage reviews
              </LinkButton>
            ) : (
              <Button
                onClick={() => {
                  if (!currentUserResp?.user) {
                    setAccessDeniedModalState(true);
                    return;
                  }
                  setReviewModalOpen(true);
                }}
                className='mt-2 w-full max-w-xs rounded-xl bg-[#5B21B6] py-7 text-base font-medium text-white'
              >
                Leave a review
              </Button>
            )}
          </footer>
        </section>

        <AccessDeniedModal
          isAccessDeniedModalOpen={showLoginAlert || isAccessDeniedModalOpen}
          closeAccessDeniedModal={closeAccessDeniedModal}
        />

        <ReviewRepliesSheet
          isOpen={!!selectedReviewForReplies}
          onClose={() => setSelectedReviewForReplies(null)}
          review={selectedReviewForReplies}
        />
      </main>
    </Suspense>
  );
};

export default BusinessDetailsClient;
