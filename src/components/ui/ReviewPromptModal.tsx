'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessService } from '@/types/api';
import { Textarea } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import Link from 'next/link';
import Image from 'next/image';
import { useMarkNotificationSeen } from '@/app/(clients)/misc/api';

const CUSTOM_SERVICE_OPTION = '__custom__';

export type ReviewPromptSubmissionPayload = {
  rating: number;
  content: string;
  service_id?: number;
  service_text?: string;
};

interface ReviewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ReviewPromptSubmissionPayload) => Promise<void> | void;
  businessName?: string;
  businessLogo?: string;
  businessId?: number | string;
  services?: BusinessService[];
  promptMessage?: string;
  notificationId: string | number;
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
  services,
  businessId,
  promptMessage,
  notificationId,
}: ReviewPromptModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedServiceValue, setSelectedServiceValue] = useState('');
  const [customService, setCustomService] = useState('');
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useMarkNotificationSeen();
  useEffect(() => {
    mutate({ notification_id: notificationId });
  }, [notificationId, mutate]);

  const hasServices = useMemo(
    () => Array.isArray(services) && services.length > 0,
    [services]
  );

  const shouldShowCustomServiceInput = useMemo(() => {
    if (!hasServices) return true;
    if (!selectedServiceValue) return false;
    return (
      selectedServiceValue === CUSTOM_SERVICE_OPTION ||
      selectedServiceValue.startsWith('text:')
    );
  }, [hasServices, selectedServiceValue]);

  const resetForm = () => {
    setSelectedRating(null);
    setSelectedServiceValue('');
    setCustomService('');
    setContent('');
    setFormError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleServiceSelect = (value: string) => {
    setSelectedServiceValue(value);
    if (value === CUSTOM_SERVICE_OPTION) {
      setCustomService('');
      return;
    }

    if (value.startsWith('id:')) {
      setCustomService('');
      return;
    }

    if (value.startsWith('text:')) {
      const rawTitle = value.slice(5);
      setCustomService(rawTitle);
    }
  };

  const handleSubmit = async () => {
    if (selectedRating === null) {
      setFormError('Select a rating to continue.');
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setFormError('Share a quick note about your experience.');
      return;
    }

    const trimmedServiceText = customService.trim();
    const payload: ReviewPromptSubmissionPayload = {
      rating: selectedRating,
      content: trimmedContent,
    };

    if (hasServices) {
      if (
        selectedServiceValue &&
        selectedServiceValue !== CUSTOM_SERVICE_OPTION
      ) {
        if (selectedServiceValue.startsWith('id:')) {
          const numericId = Number(selectedServiceValue.slice(3));
          if (!Number.isNaN(numericId)) {
            payload.service_id = numericId;
          } else if (trimmedServiceText) {
            payload.service_text = trimmedServiceText;
          } else {
            setFormError('Select a service or describe the service you used.');
            return;
          }
        } else if (selectedServiceValue.startsWith('text:')) {
          const derived =
            customService.trim() || selectedServiceValue.slice(5).trim();
          if (!derived) {
            setFormError('Tell us which service you received.');
            return;
          }
          payload.service_text = derived;
        }
      } else if (trimmedServiceText) {
        payload.service_text = trimmedServiceText;
      } else {
        setFormError('Select a service or describe the service you used.');
        return;
      }
    } else {
      if (!trimmedServiceText) {
        setFormError('Tell us which service you received.');
        return;
      }
      payload.service_text = trimmedServiceText;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit(payload);
      resetForm();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to submit review. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent
        className='max-w-lg overflow-hidden !rounded-2xl p-0 sm:rounded-3xl'
        style={{
          borderRadius: 20,
        }}
      >
        <button
          onClick={handleClose}
          className='absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none'
        >
          <X className='h-5 w-5' />
          <span className='sr-only'>Close</span>
        </button>

        <div className='px-8 py-10 text-center'>
          <DialogHeader className='mb-2'>
            <DialogTitle className='text-center text-xl font-medium text-[#0F0F0F] lg:text-2xl'>
              How was your experience with
            </DialogTitle>
          </DialogHeader>

          {businessId ? (
            <Link
              href={`/businesses/${businessId}`}
              className='mb-6 flex items-center justify-center gap-2 underline'
            >
              {businessLogo ? (
                <Image
                  src={businessLogo}
                  alt={businessName}
                  width={32}
                  height={32}
                  className='h-8 w-8 rounded-full object-cover'
                />
              ) : (
                <div className='bg-primary-100 flex h-8 w-8 items-center justify-center rounded-full'>
                  <span className='text-xs font-bold text-[#5F2EEA]'>
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className='text-xl font-medium text-primary lg:text-[1.65rem]'>
                {businessName}?
              </span>
            </Link>
          ) : (
            <div className='mb-6 flex items-center justify-center gap-2'>
              {businessLogo ? (
                <Image
                  src={businessLogo}
                  alt={businessName}
                  width={32}
                  height={32}
                  className='h-8 w-8 rounded-full object-cover'
                />
              ) : (
                <div className='bg-primary-100 flex h-8 w-8 items-center justify-center rounded-full'>
                  <span className='text-xs font-bold text-[#5F2EEA]'>
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className='text-xl font-medium text-primary lg:text-[1.65rem]'>
                {businessName}?
              </span>
            </div>
          )}

          <p className='mb-4 mt-5 text-[0.825rem] text-[#9098A3]'>
            {promptMessage?.trim()?.length
              ? promptMessage
              : "We'd love to know!"}
          </p>

          <div className='mb-6 flex flex-col items-center gap-2'>
            <div className='flex items-center justify-center gap-4'>
              {EMOJI_RATINGS.map(({ emoji, value, label }) => (
                <button
                  key={value}
                  disabled={
                    isSubmitting ||
                    (selectedRating !== null && selectedRating !== value)
                  }
                  onClick={() => setSelectedRating(value)}
                  className={cn(
                    'text-4xl transition-transform hover:scale-110 focus:outline-none'
                  )}
                  title={label}
                  type='button'
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className='mb-6 space-y-4 text-left'>
            {hasServices && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Service experienced
                </label>
                <Select
                  value={selectedServiceValue}
                  onValueChange={handleServiceSelect}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue
                      placeholder='Select the service you used'
                      className='text-black placeholder:text-[#9098A3]'
                    >
                      {(() => {
                        if (!selectedServiceValue) return null;
                        if (selectedServiceValue === CUSTOM_SERVICE_OPTION)
                          return 'Something else';
                        if (selectedServiceValue.startsWith('id:')) {
                          const id = Number(selectedServiceValue.slice(3));
                          const found = services?.find(s => s.id === id);
                          return found?.title || '';
                        }
                        if (selectedServiceValue.startsWith('text:')) {
                          return selectedServiceValue.slice(5);
                        }
                        return selectedServiceValue;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map(service => (
                      <SelectItem
                        key={service.id ?? service.title}
                        value={
                          service.id !== undefined
                            ? `id:${service.id}`
                            : `text:${service.title}`
                        }
                      >
                        {service.title}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_SERVICE_OPTION}>
                      Something else
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {shouldShowCustomServiceInput && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  {hasServices ? 'Service name' : 'Which service did you use?'}
                </label>
                <Input
                  value={customService}
                  onChange={event => setCustomService(event.target.value)}
                  placeholder='e.g. Event photography'
                />
              </div>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Share a quick review
              </label>
              <Textarea
                value={content}
                onChange={event => setContent(event.target.value)}
                placeholder='Tell others about your experience...'
                rows={4}
              />
            </div>
          </div>

          {formError ? (
            <p className='mb-4 text-sm text-red-500'>{formError}</p>
          ) : null}

          <Button
            onClick={handleSubmit}
            disabled={selectedRating === null || isSubmitting}
            className={cn(
              'w-full rounded-xl py-6 text-base font-medium transition-colors'
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
