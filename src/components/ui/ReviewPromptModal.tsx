'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  businessName?: string;
  businessLogo?: string;
}

const EMOJI_RATINGS = [
  { emoji: '😣', value: 1, label: 'Terrible' },
  { emoji: '😔', value: 2, label: 'Bad' },
  { emoji: '😐', value: 3, label: 'Okay' },
  { emoji: '🙂', value: 4, label: 'Good' },
  { emoji: '😍', value: 5, label: 'Amazing' },
];

export function ReviewPromptModal({
  isOpen,
  onClose,
  onSubmit,
  businessName = 'this business',
  businessLogo,
}: ReviewPromptModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedRating === null) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(selectedRating);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedRating(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="px-8 py-10 text-center">
          {/* Title */}
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-semibold text-center">
              How was your experience with
            </DialogTitle>
          </DialogHeader>

          {/* Business name with logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {businessLogo ? (
              <img
                src={businessLogo}
                alt={businessName}
                className="h-6 w-6 rounded object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-100">
                <span className="text-primary-600 text-xs font-bold">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xl font-semibold text-primary-600">
              {businessName}?
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-gray-500 mb-8">We&apos;d love to know!</p>

          {/* Emoji rating selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {EMOJI_RATINGS.map(({ emoji, value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedRating(value)}
                className={cn(
                  'text-4xl transition-transform hover:scale-110 focus:outline-none',
                  selectedRating === value
                    ? 'scale-125 drop-shadow-lg'
                    : 'grayscale-0',
                  selectedRating !== null && selectedRating !== value
                    ? 'opacity-50 grayscale'
                    : ''
                )}
                title={label}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={selectedRating === null || isSubmitting}
            className={cn(
              'w-full py-6 text-base font-medium rounded-xl transition-colors',
              selectedRating === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            )}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewPromptModal;
