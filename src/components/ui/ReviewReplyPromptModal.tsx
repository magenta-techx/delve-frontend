"use client";

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui';
import { X, Star, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessReviewThread, ReviewReplyNode } from '@/types/api';
import Image from 'next/image';

interface ReviewReplyPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { content: string; parent_reply_id?: number }) => Promise<void> | void;
  review: BusinessReviewThread;
  businessName: string;
  isSubmitting?: boolean;
}

interface ReplyListProps {
  replies: ReviewReplyNode[];
  onReply: (reply: ReviewReplyNode) => void;
  depth?: number;
}

function InitialBadge({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="bg-primary-100 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ReplyList({ replies, onReply, depth = 0 }: ReplyListProps) {
  if (!replies?.length) return null;

  return (
    <ul className={cn('space-y-4', depth > 0 && 'pl-6 border-l border-muted-foreground/20')}>
      {replies.map(reply => (
        <li key={reply.id} className="space-y-2">
          <div className="flex items-start gap-3">
            <InitialBadge
              name={`${reply.user.first_name ?? ''} ${reply.user.last_name ?? ''}`.trim() || reply.user.email}
              image={reply.user.profile_image ?? null}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {`${reply.user.first_name ?? ''} ${reply.user.last_name ?? ''}`.trim() || reply.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reply.added_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onReply(reply)}
                >
                  <Reply className="mr-1 h-3.5 w-3.5" />
                  Reply
                </Button>
              </div>
              <p className="text-sm text-foreground/90">{reply.content}</p>
            </div>
          </div>
          {reply.children?.length ? (
            <ReplyList replies={reply.children} onReply={onReply} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
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
}

export function ReviewReplyPromptModal({
  isOpen,
  onClose,
  onSubmit,
  review,
  businessName,
  isSubmitting,
}: ReviewReplyPromptModalProps) {
  const [content, setContent] = useState('');
  const [parentReply, setParentReply] = useState<ReviewReplyNode | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const reviewerName = useMemo(() => {
    const { reviewer } = review;
    if (!reviewer) return 'Customer';
    const composed = `${reviewer.first_name ?? ''} ${reviewer.last_name ?? ''}`.trim();
    return composed || reviewer.email;
  }, [review]);

  const handleClose = () => {
    setContent('');
    setParentReply(null);
    setFormError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setFormError('Add a message before sending.');
      return;
    }

    setFormError(null);
    try {
      await onSubmit({
        content: trimmed,
        ...(parentReply ? { parent_reply_id: parentReply.id } : {}),
      });
      setContent('');
      setParentReply(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send reply.';
      setFormError(message);
    }
  };

  const serviceLabel = review.service?.title ?? review.service_text ?? 'Service';

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-gradient-to-b from-white via-white to-primary/5 px-8 py-8">
          <DialogHeader className="mb-4 text-left">
            <DialogTitle className="text-lg font-semibold text-foreground">
              Review from <span className="text-primary">{reviewerName}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {businessName} received new feedback. Send a quick reply to keep the conversation going.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <InitialBadge
              name={reviewerName}
              image={review.reviewer?.profile_image ?? null}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{serviceLabel}</p>
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-xs text-muted-foreground">
                  {new Date(review.added_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-foreground/90 shadow-sm">
            {review.content}
          </p>
        </div>

        <div className="space-y-6 px-8 py-6">
          {review.replies?.length ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Thread</h3>
              <ReplyList
                replies={review.replies}
                onReply={reply => {
                  setParentReply(reply);
                  setFormError(null);
                }}
              />
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Reply to {parentReply ? 'a reply' : reviewerName}</p>
              {parentReply ? (
                <button
                  type="button"
                  onClick={() => setParentReply(null)}
                  className="text-xs font-medium text-primary underline"
                >
                  Cancel threading
                </button>
              ) : null}
            </div>
            {parentReply ? (
              <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                Replying to {`${parentReply.user.first_name ?? ''} ${parentReply.user.last_name ?? ''}`.trim() || parentReply.user.email}
              </p>
            ) : null}
            <Textarea
              placeholder="Write your message..."
              value={content}
              onChange={event => setContent(event.target.value)}
              rows={4}
            />
            {formError ? <p className="text-xs text-red-500">{formError}</p> : null}
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-white hover:bg-primary/90"
            >
              {isSubmitting ? 'Sending...' : 'Reply'}
            </Button>
          </div>
        </div>

        <div className="bg-muted/40 px-8 py-5 text-center text-xs text-muted-foreground">
          Responding promptly helps customers feel heard and keeps engagement high.
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewReplyPromptModal;
