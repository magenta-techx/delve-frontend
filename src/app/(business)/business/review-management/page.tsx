'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { ChevronDown, ExternalLink, MessageCircle, Send, ArrowUpRight } from 'lucide-react';
import { useBusinessReviews, useReplyToReview } from '../../misc/api/reviews';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { formatDistanceToNow, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RatingStars, RatingStarsSquare } from '../../misc/components/icons';

export default function ReviewManagementPage() {
  const { currentBusiness } = useBusinessContext();
  const businessId = currentBusiness?.id;
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBusinessReviews(businessId);
  const replyMutation = useReplyToReview();

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

  useEffect(() => {
    if (!sortedReviews.length) {
      setSelectedReviewId(null);
      return;
    }

    if (selectedReviewId === null) {
      setSelectedReviewId(sortedReviews[0]?.id ?? null);
    } else {
      const found = sortedReviews.some(review => review.id === selectedReviewId);
      if (!found) {
        setSelectedReviewId(sortedReviews[0]?.id ?? null);
      }
    }
  }, [sortedReviews, selectedReviewId]);

  const selectedReview = useMemo(() => {
    if (selectedReviewId === null) return null;
    return sortedReviews.find(review => review.id === selectedReviewId) ?? null;
  }, [sortedReviews, selectedReviewId]);

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0);
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
        error instanceof Error ? error.message : 'Unable to send reply right now';
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
      <div className={cn('space-y-4', depth > 0 && 'border-l-2 border-primary/30 pl-4')}>
        {replies.map(reply => (
          <div key={reply.id} className='space-y-2'>
            <div className='flex items-start gap-3'>
              <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary'>
                {(reply.user.first_name ?? reply.user.email ?? 'U')
                  .slice(0, 1)
                  .toUpperCase()}
              </div>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium text-foreground'>
                    {`${reply.user.first_name ?? ''} ${reply.user.last_name ?? ''}`.trim() || reply.user.email}
                  </p>
                  <span className='text-xs text-muted-foreground'>
                    {getRelativeTime(reply.added_at)}
                  </span>
                </div>
                <p className='text-sm text-foreground/80'>{reply.content}</p>
              </div>
            </div>
            {renderReplies(reply.children, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  const isReplyDisabled = !replyContent.trim() || replyMutation.isPending;

  const showEmptyState = !isLoading && !isError && reviews.length === 0;

  return (
    <div className='flex-1 overflow-auto bg-background'>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-foreground'>Review Management</h1>
          <Button 
            variant='outline' 
            className='gap-2 rounded-full border-border text-foreground hover:bg-muted'
          >
            All Time
            <ChevronDown className='h-4 w-4' />
          </Button>
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Total Reviews */}
          <div className='rounded-2xl bg-[#E8F5E9] dark:bg-[#1B4332]/30 p-5'>
            <p className='text-sm text-muted-foreground mb-1'>Total reviews</p>
            <div className='flex items-center gap-2'>
              <span className='text-3xl font-bold text-foreground'>
                {isLoading ? '—' : `Over ${totalReviews}`}
              </span>
              <ExternalLink className='h-5 w-5 text-muted-foreground' />
            </div>
          </div>

          {/* Total Rating */}
          <div className='rounded-2xl bg-[#E8F5E9] dark:bg-[#1B4332]/30 p-5'>
            <p className='text-sm text-muted-foreground mb-1'>Total rating</p>
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-foreground'>
                {isLoading ? '—' : averageRating.toFixed(1)}
              </span>
              <RatingStars rating={averageRating} />
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className='rounded-2xl bg-[#E8F5E9] dark:bg-[#1B4332]/30 p-5'>
            <div className='space-y-1.5'>
              {ratingBuckets.map(([rating, count]) => {
                const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={rating} className='flex items-center gap-2 text-sm'>
                    <span className='w-3 font-medium text-foreground'>{rating}</span>
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='#FBBF24'>
                      <path d='M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z' />
                    </svg>
                    <div className='flex-1 h-2 bg-white dark:bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-primary rounded-full transition-all'
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className='w-6 text-right text-xs text-muted-foreground'>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center'>
            <p className='text-sm text-destructive'>Unable to load reviews right now. Please try again.</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='grid gap-6 lg:grid-cols-[400px_1fr]'>
            <div className='rounded-2xl border border-border bg-card p-4 space-y-3 animate-pulse'>
              <div className='h-16 rounded-xl bg-muted' />
              <div className='h-16 rounded-xl bg-muted' />
              <div className='h-16 rounded-xl bg-muted' />
            </div>
            <div className='rounded-2xl border border-border bg-card p-6 space-y-4 animate-pulse'>
              <div className='h-6 w-32 rounded bg-muted' />
              <div className='h-4 w-48 rounded bg-muted' />
              <div className='h-32 rounded-xl bg-muted' />
            </div>
          </div>
        )}

        {/* Empty State */}
        {showEmptyState && (
          <div className='rounded-2xl border border-border bg-card p-12 text-center'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <MessageCircle className='h-7 w-7' />
            </div>
            <h2 className='text-lg font-semibold text-foreground'>No reviews yet</h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              When customers share feedback, you&apos;ll see it here in real time.
            </p>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !showEmptyState && (
          <div className='grid gap-6 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr]'>
            {/* Review List */}
            <div className='rounded-2xl border border-border bg-card overflow-hidden'>
              {/* List Header */}
              <div className='flex items-center justify-between p-4 border-b border-border'>
                <span className='text-sm font-medium text-muted-foreground'>Latest reviews</span>
                <button 
                  type='button'
                  className='flex items-center gap-1 text-sm font-medium text-primary hover:underline'
                >
                  View all
                  <ArrowUpRight className='h-3.5 w-3.5' />
                </button>
              </div>

              {/* Review Items */}
              <div className='divide-y divide-border'>
                {sortedReviews.map(review => {
                  const isActive = review.id === selectedReviewId;
                  const reviewerName = `${review.reviewer.first_name ?? ''} ${review.reviewer.last_name ?? ''}`.trim() || review.reviewer.email;
                  
                  return (
                    <button
                      key={review.id}
                      type='button'
                      onClick={() => setSelectedReviewId(review.id)}
                      className={cn(
                        'w-full text-left p-4 transition-colors',
                        isActive
                          ? 'bg-primary/5'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      {/* Row 1: Time, Name, Rating */}
                      <div className='flex items-center justify-between gap-3 mb-1'>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs text-muted-foreground'>
                            {formatTimeDisplay(review.added_at)}
                          </span>
                          <span className='text-sm font-medium text-foreground'>
                            {reviewerName}
                          </span>
                        </div>
                        <RatingStarsSquare rating={review.rating} />
                      </div>

                      {/* Row 2: Service */}
                      <p className='text-sm text-primary font-medium mb-1'>
                        {review.service?.title ?? review.service_text ?? 'General Review'}
                      </p>

                      {/* Row 3: Preview */}
                      <p className='text-sm text-muted-foreground line-clamp-1'>
                        {review.content}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Detail Panel */}
            <div className='rounded-2xl border border-border bg-card flex flex-col'>
              {selectedReview ? (
                <>
                  {/* Detail Header */}
                  <div className='flex items-center justify-between p-4 border-b border-border'>
                    <div className='flex items-center gap-2'>
                      {isReviewRecent(selectedReview.added_at) && (
                        <span className='px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'>
                          Now
                        </span>
                      )}
                      <span className='text-sm text-muted-foreground'>
                        {getRelativeTime(selectedReview.added_at)}
                      </span>
                    </div>
                    <Button 
                      variant='outline' 
                      size='sm' 
                      className='gap-2 rounded-full'
                    >
                      Open Chat
                      <MessageCircle className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* Detail Content */}
                  <div className='flex-1 p-6 space-y-5 overflow-auto'>
                    {/* Reviewer Info */}
                    <div className='flex items-center justify-between'>
                      <h2 className='text-lg font-semibold text-foreground'>
                        {`${selectedReview.reviewer.first_name ?? ''} ${selectedReview.reviewer.last_name ?? ''}`.trim() || selectedReview.reviewer.email}
                      </h2>
                      <RatingStarsSquare rating={selectedReview.rating} />
                    </div>

                    {/* Service */}
                    <div>
                      <label className='block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5'>
                        Service
                      </label>
                      <div className='rounded-lg border border-border px-4 py-2.5 text-sm text-foreground bg-background'>
                        {selectedReview.service?.title ?? selectedReview.service_text ?? 'Not specified'}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div>
                      <label className='block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5'>
                        Review
                      </label>
                      <div className='rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground'>
                        {selectedReview.content}
                      </div>
                    </div>

                    {/* Existing Replies */}
                    {selectedReview.replies?.length ? (
                      <div className='space-y-3'>
                        <h3 className='text-sm font-semibold text-foreground'>Replies</h3>
                        {renderReplies(selectedReview.replies)}
                      </div>
                    ) : null}
                  </div>

                  {/* Reply Input */}
                  <div className='p-4 border-t border-border'>
                    <div className='flex items-center gap-3'>
                      <input
                        type='text'
                        placeholder='Write reply...'
                        value={replyContent}
                        onChange={event => setReplyContent(event.target.value)}
                        onKeyDown={event => {
                          if (event.key === 'Enter' && !event.shiftKey && !isReplyDisabled) {
                            handleReplySubmit();
                          }
                        }}
                        className='flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
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
              ) : (
                <div className='flex-1 flex items-center justify-center p-12 text-sm text-muted-foreground'>
                  Select a review to see the full details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
