'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  EmptyState,
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui';
import { ChevronDown, Send } from 'lucide-react';
import { useBusinessReviews, useReplyToReview } from '../../misc/api/reviews';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { formatDistanceToNow, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RatingStars, RatingStarsSquare } from '../../misc/components/icons';
import { EmptyChatMedia } from '@/app/(clients)/misc/icons';
import { BusinessReviewThread } from '@/types/api';
import { useIsMobile } from '@/hooks';

export default function ReviewManagementPage() {
  const { currentBusiness } = useBusinessContext();
  const businessId = currentBusiness?.id;
  const { data, isLoading, isError, refetch } = useBusinessReviews(businessId);
  const replyMutation = useReplyToReview();
  const { isMobile } = useIsMobile(1280);

  const reviews = useMemo(() => data?.data ?? [], [data]);
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const first = new Date(b.added_at ?? '').getTime();
      const second = new Date(a.added_at ?? '').getTime();
      return first - second;
    });
  }, [reviews]);

  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedReview = useMemo(() => {
    if (selectedReviewId === null) return null;
    return sortedReviews.find(review => review.id === selectedReviewId) ?? null;
  }, [sortedReviews, selectedReviewId]);

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce(
    (acc, review) => acc + (review.rating ?? 0),
    0
  );
  const averageRating = totalReviews ? totalRating / totalReviews : 0;

  const ratingBuckets = useMemo(() => {
    const counts = new Map<number, number>();
    for (let rating = 1; rating <= 5; rating += 1) {
      counts.set(rating, 0);
    }

    for (const review of reviews) {
      const rounded = Math.round(review.rating ?? 0);
      if (counts.has(rounded)) {
        counts.set(rounded, (counts.get(rounded) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries()).sort((a, b) => b[0] - a[0]);
  }, [reviews]);

  const handleReplySubmit = useCallback(async () => {
    if (!businessId || !selectedReview) {
      return;
    }

    const trimmed = replyContent.trim();
    if (!trimmed) {
      toast.error('Write a response before sending.');
      return;
    }

    try {
      await replyMutation.mutateAsync({
        business_id: businessId,
        review_id: selectedReview.id,
        content: trimmed,
      });
      toast.success('Reply sent');
      setReplyContent('');
      await refetch();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to send reply right now';
      toast.error(message);
    }
  }, [businessId, selectedReview, replyContent, replyMutation, refetch]);

  const getRelativeTime = useCallback((dateString?: string | null) => {
    if (!dateString) return '---';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return '---';
    return formatDistanceToNow(parsed, { addSuffix: true });
  }, []);

  const formatTimeDisplay = useCallback((dateString?: string | null) => {
    if (!dateString) return '---';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return '---';

    if (isToday(parsed)) {
      return 'Today';
    }
    return formatDistanceToNow(parsed, { addSuffix: true });
  }, []);

  const isReviewRecent = useCallback((dateString?: string | null) => {
    if (!dateString) return false;
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return false;
    return isToday(parsed);
  }, []);

  const renderReplies = (
    replies: NonNullable<typeof selectedReview>['replies'],
    depth = 0
  ): JSX.Element | null => {
    if (!replies?.length) return null;
    return (
      <div
        className={cn(
          'space-y-4',
          depth > 0 && 'border-l-2 border-primary/30 pl-4'
        )}
      >
        {replies.map(reply => (
          <div key={reply.id} className='space-y-2'>
            <div className='flex items-start gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
                {(reply.user.first_name ?? reply.user.email ?? 'U')
                  .slice(0, 1)
                  .toUpperCase()}
              </div>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium text-[#0F0F0F]'>
                    {`${reply.user.first_name ?? ''} ${reply.user.last_name ?? ''}`.trim() ||
                      reply.user.email}
                  </p>
                  <span className='text-xs text-[#697586]'>
                    {getRelativeTime(reply.added_at)}
                  </span>
                </div>
                <p className='text-sm text-[#697586]'>{reply.content}</p>
              </div>
            </div>
            {renderReplies(reply.children, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  const showEmptyState = !isLoading && !isError && reviews.length === 0;

  return (
    <div className={cn('flex-1 overflow-hidden bg-[#FCFCFD]')}>
      <div
        className={cn(
          'container size-full grid-cols-[1fr_minmax(300px,0.45fr)] overflow-hidden xl:grid'
        )}
      >
        <section className='flex max-h-full flex-col gap-y-6 overflow-hidden py-6'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 md:px-6'>
            <h1 className='font-inter text-lg font-medium text-[#0F0F0F] md:text-xl lg:text-2xl'>
              Review Management
            </h1>

            <Button
              variant='outline'
              className='gap-2 rounded-full border-border text-xs text-[#0F0F0F] hover:bg-muted md:text-sm'
            >
              All Time
              <ChevronDown className='h-3 w-3 md:h-4 md:w-4' />
            </Button>
          </div>

          {/* Stats Row */}
          <section className='mb-4 grid grid-cols-3 items-stretch gap-2 px-2 md:mb-8 md:gap-0 md:px-4 lg:px-6 xl:grid-cols-[0.7fr,1fr,0.7fr] 2xl:grid-cols-[0.5fr,1fr,0.7fr]'>
            {/* Total Reviews */}
            <div className='relative flex flex-col items-start justify-between gap-1 pl-2 md:gap-4 md:px-0 xl:py-4'>
              <p className='text-[10px] font-normal text-[#697586] md:text-xs lg:text-sm xl:text-lg'>
                Total reviews
              </p>
              <div className='flex flex-col items-start gap-1 md:gap-2'>
                <div className='flex items-center gap-1 md:items-end md:gap-2'>
                  <span className='text-xl font-semibold text-[#0F0F0F] max-md:block md:text-2xl lg:text-3xl xl:text-4xl'>
                    {isLoading ? (
                      '—'
                    ) : (
                      <>
                        <span className='text-[7px] font-normal text-[#4B5565] md:text-xs'>
                          Over{' '}
                        </span>
                        {totalReviews}
                      </>
                    )}
                  </span>
                  <svg
                    className='h-3 w-3 max-md:hidden md:h-4 md:w-4 lg:h-5 lg:w-5'
                    width='19'
                    height='19'
                    viewBox='0 0 19 19'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12.6761 10.0766C12.2964 10.0766 11.9886 9.76879 11.9886 9.38909V8.4431L9.6528 10.7789C9.38432 11.0474 8.94902 11.0474 8.68053 10.7789L7.79167 9.89002L5.06947 12.6122C4.80098 12.8807 4.36568 12.8807 4.0972 12.6122C3.82871 12.3437 3.82871 11.9084 4.0972 11.6399L7.30553 8.43161C7.57402 8.16313 8.00932 8.16313 8.2778 8.43161L9.16667 9.32048L11.0033 7.48386H10.0834C9.70367 7.48386 9.39587 7.17606 9.39587 6.79636C9.39587 6.41667 9.70367 6.10887 10.0834 6.10886L12.6761 6.10887C13.0558 6.10887 13.3636 6.41667 13.3636 6.79637L13.3636 9.38909C13.3636 9.76879 13.0558 10.0766 12.6761 10.0766Z'
                      fill='#551FB9'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M0 9.16667C0 12.5936 0 14.3071 0.73686 15.5833C1.21959 16.4194 1.91389 17.1137 2.75 17.5965C4.02628 18.3333 5.73974 18.3333 9.16667 18.3333C12.5936 18.3333 14.3071 18.3333 15.5833 17.5965C16.4194 17.1137 17.1137 16.4194 17.5965 15.5833C18.3333 14.3071 18.3333 12.5936 18.3333 9.16667C18.3333 5.73974 18.3333 4.02628 17.5965 2.75C17.1137 1.91389 16.4194 1.21959 15.5833 0.73686C14.3071 0 12.5936 0 9.16667 0C5.73974 0 4.02628 0 2.75 0.73686C1.91389 1.21959 1.21959 1.91389 0.73686 2.75C0 4.02628 0 5.73974 0 9.16667ZM16.4057 3.4375C16.6332 3.83149 16.7884 4.35506 16.8718 5.27595C16.957 6.21576 16.9583 7.4279 16.9583 9.16667C16.9583 10.9054 16.957 12.1176 16.8718 13.0574C16.7884 13.9783 16.6332 14.5018 16.4057 14.8958C16.0436 15.5229 15.5229 16.0436 14.8958 16.4057C14.5018 16.6332 13.9783 16.7884 13.0574 16.8718C12.1176 16.957 10.9054 16.9583 9.16667 16.9583C7.4279 16.9583 6.21576 16.957 5.27595 16.8718C4.35506 16.7884 3.83149 16.6332 3.4375 16.4057C2.81042 16.0436 2.28969 15.5229 1.92765 14.8958C1.70018 14.5018 1.54496 13.9783 1.46149 13.0574C1.37632 12.1176 1.375 10.9054 1.375 9.16667C1.375 7.4279 1.37632 6.21576 1.46149 5.27595C1.54496 4.35506 1.70018 3.83149 1.92765 3.4375C2.28969 2.81042 2.81042 2.28969 3.4375 1.92765C3.83149 1.70018 4.35506 1.54496 5.27595 1.46149C6.21576 1.37632 7.4279 1.375 9.16667 1.375C10.9054 1.375 12.1176 1.37632 13.0574 1.46149C13.9783 1.54496 14.5018 1.70018 14.8958 1.92765C15.5229 2.28969 16.0436 2.81042 16.4057 3.4375Z'
                      fill='#551FB9'
                    />
                  </svg>
                </div>
              </div>
              <div className='absolute right-0 top-1/2 hidden h-[70%] w-px -translate-y-1/2 bg-[#CDD5DF] md:block' />
            </div>

            {/* Total Rating */}
            <div className='relative flex flex-col items-center justify-center gap-1 md:gap-4 md:pl-4 xl:px-8 xl:py-4'>
              <div className='flex h-full w-full flex-col items-start justify-between gap-1 md:gap-2'>
                <p className='text-[10px] font-normal text-[#697586] md:text-xs lg:text-sm xl:text-lg'>
                  Total rating
                </p>
                <div className='flex gap-2 max-sm:flex-col md:items-end md:gap-3'>
                  <span className='text-xl font-semibold text-[#0F0F0F] md:text-2xl lg:text-3xl xl:text-4xl'>
                    {isLoading ? '—' : averageRating.toFixed(1)}
                  </span>
                  <RatingStars rating={averageRating} />
                </div>
              </div>
              <div className='absolute right-0 top-1/2 hidden h-[70%] w-px -translate-y-1/2 bg-[#CDD5DF] md:block' />
            </div>

            {/* Rating Breakdown */}
            <div className='flex flex-col items-end justify-between md:px-2 md:pl-4'>
              <div className='w-full space-y-0.5 md:max-w-[200px] md:space-y-1'>
                {ratingBuckets.map(([rating, count]) => {
                  const percentage = totalReviews
                    ? Math.round((count / totalReviews) * 100)
                    : 0;
                  return (
                    <div
                      key={rating}
                      className='flex items-center gap-0.5 text-[10px] md:gap-1 md:text-sm'
                    >
                      <div className='flex items-center gap-0.5 md:gap-1'>
                        <svg
                          width='8'
                          height='8'
                          viewBox='0 0 11 10'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className='md:h-[10px] md:w-[11px]'
                        >
                          <path
                            d='M4.9853 1.1308C5.07137 0.956401 5.32005 0.956401 5.40612 1.1308L6.52029 3.38835C6.55446 3.4576 6.62053 3.5056 6.69695 3.5167L9.18831 3.87872C9.38077 3.90669 9.45761 4.14319 9.31835 4.27894L7.51559 6.0362C7.46029 6.09011 7.43505 6.16777 7.44811 6.24389L7.87368 8.72518C7.90656 8.91685 7.70537 9.06302 7.53323 8.97253L5.3049 7.80102C5.23654 7.76508 5.15488 7.76508 5.08652 7.80102L2.85819 8.97253C2.68605 9.06302 2.48486 8.91685 2.51774 8.72518L2.94331 6.24389C2.95637 6.16777 2.93113 6.09011 2.87583 6.0362L1.07307 4.27894C0.933806 4.14319 1.01065 3.90669 1.20311 3.87872L3.69446 3.5167C3.77089 3.5056 3.83695 3.4576 3.87113 3.38835L4.9853 1.1308Z'
                            fill='#FBBF24'
                            strokeWidth='2'
                            strokeLinejoin='round'
                          />
                        </svg>

                        <span className='w-2 font-medium text-[#0F0F0F] md:w-3'>
                          {rating}
                        </span>
                      </div>
                      <div className='h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-muted md:h-1.5'>
                        <div
                          className='h-full rounded-full bg-amber-400 transition-all'
                          style={{
                            width: `${Math.max(percentage, percentage > 0 ? 8 : 0)}%`,
                          }}
                        />
                      </div>
                      <span className='w-4 text-right text-[8px] font-medium text-[#697586] md:w-6 md:text-xs'>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Error State */}
          {isError && (
            <div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center'>
              <p className='text-sm text-destructive'>
                Unable to load reviews right now. Please try again.
              </p>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !showEmptyState && (
            <div className='flex flex-1 flex-col gap-6 overflow-y-auto px-4 md:px-6'>
              {isLoading ? (
                <div className='grid gap-6 lg:grid-cols-[400px_1fr]'>
                  <div className='animate-pulse space-y-3 rounded-2xl border border-border bg-card p-4'>
                    <div className='h-16 rounded-xl bg-muted' />
                    <div className='h-16 rounded-xl bg-muted' />
                    <div className='h-16 rounded-xl bg-muted' />
                  </div>
                  <div className='animate-pulse space-y-4 rounded-2xl border border-border bg-card p-6'>
                    <div className='h-6 w-32 rounded bg-muted' />
                    <div className='h-4 w-48 rounded bg-muted' />
                    <div className='h-32 rounded-xl bg-muted' />
                  </div>
                </div>
              ) : showEmptyState ? (
                <EmptyState
                  media={<EmptyChatMedia />}
                  title='No reviews yet'
                  description="When customers share feedback, you'll see it here in real time."
                />
              ) : (
                sortedReviews.map(review => {
                  const isActive = review.id === selectedReviewId;
                  const reviewerName =
                    `${review.reviewer.first_name ?? ''} ${review.reviewer.last_name ?? ''}`.trim() ||
                    review.reviewer.email;

                  return (
                    <button
                      key={review.id}
                      type='button'
                      onClick={() => {
                        setSelectedReviewId(review.id);
                        if (isMobile) {
                          setIsDrawerOpen(true);
                        }
                      }}
                      className={cn(
                        'w-full overflow-hidden rounded-2xl border border-[#EEF2F6] bg-[#FFFFFF] text-left transition-colors',
                        'xl:grid-[0.34fr_1fr] grid grid-cols-[minmax(120px,0.3fr)_1fr] gap-4',
                        isActive && 'border-primary/70'
                      )}
                    >
                      <section
                        className={cn(
                          'flex flex-col items-start justify-between gap-3 p-3 md:p-4 xl:p-5',
                          isActive ? 'bg-[#FBFAFF]' : 'bg-[#FCFCFD]'
                        )}
                      >
                        <p className='text-xs text-[#697586]'>
                          {formatTimeDisplay(review.added_at)}
                        </p>
                        <div className='space-y-1'>
                          <p className='text-xs font-medium text-[#0F0F0F] sm:text-sm'>
                            {reviewerName}
                          </p>
                          <RatingStarsSquare
                            rating={review.rating}
                            className='justify-start'
                          />
                        </div>
                      </section>

                      <section className='p-3 max-md:pl-0 md:p-4 xl:p-5'>
                        <p className='mb-2 text-xs font-medium text-[#0F0F0F] md:mb-4 md:text-[0.9rem]'>
                          {review.service?.title ??
                            review.service_text ??
                            'General Review'}
                        </p>

                        <p className='line-clamp-2 text-xs text-[#514F6E] md:text-sm'>
                          {review.content}
                        </p>
                      </section>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </section>

        <section className='my-6 hidden h-[calc(100vh-3rem)] flex-col rounded-2xl border border-border bg-card lg:flex'>
          {selectedReview ? (
            <ReviewDetails
              selectedReview={selectedReview}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              replyMutation={replyMutation}
              handleReplySubmit={handleReplySubmit}
              getRelativeTime={getRelativeTime}
              isReviewRecent={isReviewRecent}
              renderReplies={renderReplies}
            />
          ) : (
            <div className='flex flex-1 items-center justify-center p-12 text-sm text-[#697586]'>
              Select a review to see the full details.
            </div>
          )}
        </section>

        {/* Mobile Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent
            side='right'
            className='flex h-full w-full flex-col overflow-hidden p-0 sm:w-full'
          >
            <SheetHeader className='border-b border-border p-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-[#0F0F0F]'>
                  Review Details
                </h2>
              </div>
            </SheetHeader>
            {selectedReview ? (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <ReviewDetails
                  selectedReview={selectedReview}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  replyMutation={replyMutation}
                  handleReplySubmit={handleReplySubmit}
                  getRelativeTime={getRelativeTime}
                  isReviewRecent={isReviewRecent}
                  renderReplies={renderReplies}
                />
              </div>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

const ReviewDetails = ({
  selectedReview,
  replyContent,
  setReplyContent,
  replyMutation,
  handleReplySubmit,
  getRelativeTime,
  isReviewRecent,
  renderReplies,
}: {
  selectedReview: BusinessReviewThread | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  replyMutation: ReturnType<typeof useReplyToReview>;
  handleReplySubmit: () => Promise<void>;
  getRelativeTime: (dateString?: string | null) => string;
  isReviewRecent: (dateString?: string | null) => boolean;
  renderReplies: (
    replies: NonNullable<typeof selectedReview>['replies'],
    depth?: number
  ) => JSX.Element | null;
}) => {
  if (!selectedReview) return null;

  const isReplyDisabled = !replyContent.trim() || replyMutation.isPending;

  return (
    <>
      {/* Detail Header */}

      {/* Detail Content */}
      <div className='flex-1 space-y-5 overflow-auto p-6'>
        <header className='border-b pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {isReviewRecent(selectedReview.added_at) && (
                <span className='rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400'>
                  Now
                </span>
              )}
              <span className='text-sm text-[#697586]'>
                {getRelativeTime(selectedReview.added_at)}
              </span>
            </div>
            {/* <Button variant='outline' size='sm' className='gap-2 rounded-full'>
          Open Chat
          <MessageCircle className='h-4 w-4' />
        </Button> */}
          </div>

          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-[#0F0F0F]'>
              {`${selectedReview.reviewer.first_name ?? ''} ${selectedReview.reviewer.last_name ?? ''}`.trim() ||
                selectedReview.reviewer.email}
            </h2>
            <RatingStarsSquare rating={selectedReview.rating} />
          </div>
        </header>

        {/* Service */}
        <div>
          <label className='mb-1.5 block text-xs font-medium tracking-wide text-[#0A0A0A]'>
            Service
          </label>
          <div className='rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-[#697586]'>
            {selectedReview.service?.title ??
              selectedReview.service_text ??
              'Not specified'}
          </div>
        </div>

        {/* Review Content */}
        <div>
          <label className='mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#697586]'>
            Review
          </label>
          <div className='text-sm  text-[#697586]'>
            {selectedReview.content}
          </div>
        </div>

        {/* Existing Replies */}
        {selectedReview.replies?.length ? (
          <div className='space-y-3'>
            <h3 className=' text-sm text-[#0A0A0A]'>Replies</h3>
            {renderReplies(selectedReview.replies)}
          </div>
        ) : null}
      </div>

      {/* Reply Input */}
      <div className='border-t border-border p-4'>
        <div className='flex items-center gap-3'>
          <input
            type='text'
            placeholder='Write reply...'
            value={replyContent}
            onChange={event => setReplyContent(event.target.value)}
            onKeyDown={event => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !isReplyDisabled
              ) {
                handleReplySubmit();
              }
            }}
            className='flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-[#0F0F0F] placeholder:text-[#697586] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
          <Button
            size='icon'
            className='h-10 w-10 rounded-full'
            disabled={isReplyDisabled}
            onClick={handleReplySubmit}
          >
            {replyMutation.isPending ? (
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
