import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { X } from 'lucide-react';

interface CancelSubscriptionModalProps {
  variant?: 'confirm' | 'info';
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function CancelSubscriptionModal({
  variant = 'confirm',
  isOpen,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='pb-4'>
          <div className='flex items-start gap-3'>
            {variant === 'info' ? (
              <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100'>
                <span className='text-sm font-bold text-red-600'>!</span>
              </div>
            ) : null}
            <div className='flex-1'>
              <div className='flex items-center justify-between gap-2'>
                <CardTitle>
                  {variant === 'info'
                    ? 'Important Information'
                    : 'Cancel Subscription'}
                </CardTitle>
                <button
                  onClick={onClose}
                  className='text-muted-foreground hover:text-foreground'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {variant === 'info' ? (
            <>
              <div className='space-y-3 text-sm'>
                <p>
                  • Your subscription will remain active until the end of the
                  current billing period.
                </p>
                <p>
                  • Canceling your subscription will remove access to Delve
                  Premium features, including priority visibility, advanced
                  insights, and the verified badge.
                </p>
              </div>
              <Button
                className='w-full bg-red-600 text-white hover:bg-red-700'
                onClick={onConfirm}
              >
                Yes, Cancel Subscription
              </Button>
            </>
          ) : (
            <>
              <p className='text-sm'>
                Are you sure you want to end your business subscription?
              </p>
              <Button
                className='w-full bg-red-600 text-white hover:bg-red-700'
                onClick={onConfirm}
              >
                Yes, Continue
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
