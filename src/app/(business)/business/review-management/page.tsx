'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageCircle, Filter, ArrowUpRight } from 'lucide-react';
import { useBusinessReviews, useReplyToReview } from '../../misc/api/reviews';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ReviewManagementPage() {
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

  const renderRatingStars = (rating: number) => {
    return (
      <div className='flex items-center gap-1'>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'h-4 w-4',
              index < Math.round(rating)
                ? 'fill-[#FFC107] text-[#FFC107]'
                : 'text-muted-foreground'
            )}
          />
        ))}
      </div>
    );
  };

  const getRelativeTime = useCallback((dateString?: string | null) => {
    if (!dateString) return '---';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return '---';
    return formatDistanceToNow(parsed, { addSuffix: true });
  }, []);

  const renderReplies = (
    replies: NonNullable<typeof selectedReview>['replies'],
    depth = 0
  ): JSX.Element | null => {
    if (!replies?.length) return null;
    return (
      <div className={cn('space-y-4', depth > 0 && 'rounded-lg border-l-2 border-primary/30 pl-4')}>
        {replies.map(reply => (
          <div key={reply.id} className='space-y-2'>
            <div className='flex items-start gap-3'>
              <Avatar className='h-9 w-9'>
                <AvatarImage
                  src={reply.user.profile_image ?? undefined}
                  alt={reply.user.first_name ?? reply.user.email ?? 'Reviewer'}
                />
                <AvatarFallback>
                  {(reply.user.first_name ?? reply.user.email ?? 'U')
                    .slice(0, 1)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm font-medium'>
                      {`${reply.user.first_name ?? ''} ${reply.user.last_name ?? ''}`.trim() || reply.user.email}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {getRelativeTime(reply.added_at)}
                    </p>
                  </div>
                  <Badge variant='outline' className='border-primary/20 text-primary'>
                    Reply
                  </Badge>
                </div>
                <p className='text-sm text-foreground/90'>{reply.content}</p>
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
    <div className='flex-1 overflow-auto'>
      <div className='space-y-6 p-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-semibold text-foreground'>Review Management</h1>
          <p className='text-sm text-muted-foreground'>Monitor incoming reviews and keep the conversation flowing.</p>
        </div>

        <Card className='border-primary/10 bg-primary/5'>
          <CardContent className='flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex flex-col gap-2'>
              <span className='text-sm text-muted-foreground'>Total reviews</span>
              <div className='text-4xl font-semibold text-foreground'>
                {isLoading ? '—' : totalReviews}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <span className='text-sm text-muted-foreground'>Total rating</span>
              <div className='flex items-center gap-3 text-foreground'>
                <span className='text-4xl font-semibold'>
                  {isLoading ? '—' : averageRating.toFixed(1)}
                </span>
                {renderRatingStars(averageRating)}
              </div>
            </div>

            <div className='flex flex-1 flex-col gap-2 lg:max-w-sm'>
              <div className='flex items-center justify-between text-xs font-medium uppercase text-muted-foreground'>
                <span>Breakdown</span>
                <Button variant='outline' size='sm' className='gap-2 rounded-full border-primary/20 text-primary'>
                  <Filter className='h-3.5 w-3.5' />
                  All Time
                </Button>
              </div>
              <div className='space-y-2'>
                {ratingBuckets.map(([rating, count]) => {
                  const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <div key={rating} className='flex items-center gap-3 text-sm'>
                      <div className='flex items-center gap-1 text-muted-foreground'>
                        <span className='font-medium text-foreground'>{rating}</span>
                        <Star className='h-3.5 w-3.5 fill-[#FFC107] text-[#FFC107]' />
                      </div>
                      <div className='h-2 flex-1 rounded-full bg-muted'>
                        <div
                          className='h-full rounded-full bg-primary'
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className='w-10 text-right text-xs text-muted-foreground'>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {isError ? (
          <Card>
            <CardContent className='p-10 text-center text-sm text-destructive'>
              Unable to load reviews right now. Please try again.
            </CardContent>
          </Card>
        ) : null}

        {isLoading ? (
          <div className='grid gap-6 lg:grid-cols-[380px_1fr]'>
            <Card className='animate-pulse'>
              <CardContent className='p-6 space-y-4'>
                <div className='h-4 rounded-full bg-muted' />
                <div className='h-4 rounded-full bg-muted' />
                <div className='h-4 rounded-full bg-muted' />
              </CardContent>
            </Card>
            <Card className='animate-pulse'>
              <CardContent className='p-6 space-y-4'>
                <div className='h-4 rounded-full bg-muted' />
                <div className='h-4 rounded-full bg-muted' />
                <div className='h-40 rounded-xl bg-muted' />
              </CardContent>
            </Card>
          </div>
        ) : null}

        {showEmptyState ? (
          <Card>
            <CardContent className='p-12 text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <MessageCircle className='h-6 w-6' />
              </div>
              <h2 className='text-lg font-semibold text-foreground'>No reviews yet</h2>
              <p className='mt-2 text-sm text-muted-foreground'>When customers share feedback, you will see it here in real time.</p>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !showEmptyState ? (
          <div className='grid gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]'>
            <Card className='border-muted'>
              <CardHeader className='flex flex-row items-center justify-between gap-2 pb-4'>
                <CardTitle className='text-base font-semibold text-foreground'>Latest reviews</CardTitle>
                <Button variant='ghost' size='sm' className='gap-1 text-xs text-primary'>
                  View all
                  <ArrowUpRight className='h-3.5 w-3.5' />
                </Button>
              </CardHeader>
              <CardContent className='space-y-3 p-0'>
                {sortedReviews.map(review => {
                  const isActive = review.id === selectedReviewId;
                  return (
                    <button
                      key={review.id}
                      type='button'
                      onClick={() => setSelectedReviewId(review.id)}
                      className={cn(
                        'flex w-full flex-col gap-3 rounded-xl border border-transparent p-4 text-left transition-colors',
                        isActive
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'hover:border-primary/20 hover:bg-muted/40'
                      )}
                    >
                      <div className='flex items-center justify-between gap-3'>
                        <div>
                          <p className='text-sm font-semibold text-foreground'>
                            {`${review.reviewer.first_name ?? ''} ${review.reviewer.last_name ?? ''}`.trim() || review.reviewer.email}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {getRelativeTime(review.added_at)}
                          </p>
                        </div>
                        <Badge variant='outline' className='gap-1 border-primary/20 text-xs text-primary'>
                          {review.rating.toFixed(1)}
                          <Star className='h-3 w-3 fill-[#FFC107] text-[#FFC107]' />
                        </Badge>
                      </div>
                      <p className='line-clamp-2 text-sm text-muted-foreground'>
                        {review.content}
                      </p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className='border-muted'>
              {selectedReview ? (
                <CardContent className='space-y-6 p-6'>
                  <div className='flex flex-col gap-4 border-b border-muted pb-6'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex items-start gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={selectedReview.reviewer.profile_image ?? undefined} alt={selectedReview.reviewer.first_name ?? selectedReview.reviewer.email} />
                          <AvatarFallback>
                            {(selectedReview.reviewer.first_name ?? selectedReview.reviewer.email ?? 'U')
                              .slice(0, 1)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='space-y-1'>
                          <p className='text-base font-semibold text-foreground'>
                            {`${selectedReview.reviewer.first_name ?? ''} ${selectedReview.reviewer.last_name ?? ''}`.trim() || selectedReview.reviewer.email}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {getRelativeTime(selectedReview.added_at)}
                          </p>
                          {renderRatingStars(selectedReview.rating)}
                        </div>
                      </div>
                      <Button variant='outline' size='sm' className='gap-2'>
                        Open Chat
                        <MessageCircle className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='grid gap-3 text-sm'>
                      <div>
                        <span className='text-xs font-semibold uppercase text-muted-foreground'>Service</span>
                        <div className='mt-1 rounded-lg border border-muted px-3 py-2 text-foreground'>
                          {selectedReview.service?.title ?? selectedReview.service_text ?? 'Not specified'}
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <span className='text-xs font-semibold uppercase text-muted-foreground'>Review</span>
                        <p className='rounded-xl bg-muted/60 px-4 py-3 text-sm text-foreground'>
                          {selectedReview.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    {selectedReview.replies?.length ? (
                      <div className='space-y-3'>
                        <h3 className='text-sm font-semibold text-foreground'>Thread</h3>
                        {renderReplies(selectedReview.replies)}
                      </div>
                    ) : null}

                    <div className='space-y-3 rounded-2xl border border-muted bg-muted/30 p-5'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold text-foreground'>Reply as {currentBusiness?.name ?? 'your business'}</p>
                        <span className='text-xs text-muted-foreground'>Visible publicly</span>
                      </div>
                      <Textarea
                        placeholder="Say thanks or address concerns..."
                        value={replyContent}
                        onChange={event => setReplyContent(event.target.value)}
                      />
                      <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <p className='text-xs text-muted-foreground'>Responding quickly builds trust and shows you value feedback.</p>
                        <Button
                          className='sm:w-auto'
                          disabled={isReplyDisabled}
                          onClick={handleReplySubmit}
                        >
                          {replyMutation.isPending ? 'Sending...' : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className='flex h-full items-center justify-center p-12 text-sm text-muted-foreground'>
                  Select a review to see the full details.
                </CardContent>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
