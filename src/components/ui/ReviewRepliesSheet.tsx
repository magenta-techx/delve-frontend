'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BusinessReviewThread } from '@/types/api';

export interface ReviewReply {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_brand_owner: boolean;
    profile_image?: string;
  };
  content: string;
  added_at: string;
  children?: ReviewReply[];
}

export interface Review {
  id: number;
  reviewer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  service_text?: string;
  service?: {
    id: number;
    title: string;
  };
  rating: number;
  content: string;
  added_at: string;
  replies: ReviewReply[];
}

interface ReviewRepliesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  review: BusinessReviewThread | null;
}

export function ReviewRepliesSheet({
  isOpen,
  onClose,
  review,
}: ReviewRepliesSheetProps) {
  if (!review) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full sm:max-w-lg overflow-y-auto'>
        <SheetHeader className='text-left'>
          <SheetTitle className='text-xl font-semibold'>
            Responses ({review.replies.length})
          </SheetTitle>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {/* Original Review */}
          <div className='border-b pb-6'>
            <div className='mb-4 flex items-start gap-3'>
              <Avatar className='h-10 w-10 shrink-0'>
                {review.reviewer?.profile_image ? (
                  <AvatarImage
                    src={review.reviewer.profile_image}
                    alt={review.reviewer.first_name}
                  />
                ) : (
                  <AvatarFallback className='bg-gray-200 text-sm text-gray-600'>
                    {review.reviewer?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className='flex-1'>
                <div className='flex items-baseline justify-between'>
                  <h3 className='font-semibold text-gray-900'>
                    {review.reviewer?.first_name} {review.reviewer?.last_name}
                  </h3>
                  <span className='text-xs text-gray-500'>
                    {formatDate(review.added_at)}
                  </span>
                </div>
                {review.service_text && (
                  <p className='text-sm font-medium text-gray-600'>
                    {review.service_text}
                  </p>
                )}
                {review.service && (
                  <p className='text-sm font-medium text-gray-600'>
                    {review.service.title}
                  </p>
                )}
              </div>
            </div>
            <p className='whitespace-pre-line text-sm text-gray-700'>
              {review.content}
            </p>
            <div className='mt-3 flex items-center gap-2'>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Replies */}
          {review.replies.length > 0 ? (
            <div className='space-y-4'>
              <h4 className='font-medium text-gray-900'>
                {review.replies.length} {review.replies.length === 1 ? 'Response' : 'Responses'}
              </h4>
              {review.replies.map(reply => (
                <div
                  key={reply.id}
                  className='rounded-lg bg-gray-50 p-4'
                >
                  <div className='mb-3 flex items-start gap-3'>
                    <Avatar className='h-9 w-9 shrink-0'>
                      {reply.user?.profile_image ? (
                        <AvatarImage
                          src={reply.user.profile_image}
                          alt={reply.user.first_name}
                        />
                      ) : (
                        <AvatarFallback className='bg-gray-300 text-xs text-gray-600'>
                          {reply.user?.first_name?.[0] || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className='flex-1'>
                      <div className='flex items-baseline justify-between'>
                        <div className='flex items-center gap-2'>
                          <h4 className='font-semibold text-gray-900'>
                            {reply.user?.first_name} {reply.user?.last_name}
                          </h4>
                          {reply.user?.is_brand_owner && (
                            <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'>
                              Business
                            </span>
                          )}
                        </div>
                        <span className='text-xs text-gray-500'>
                          {formatDate(reply.added_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className='whitespace-pre-line text-sm text-gray-700'>
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-8 text-center text-gray-500'>
              <p className='text-sm'>No responses yet</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
