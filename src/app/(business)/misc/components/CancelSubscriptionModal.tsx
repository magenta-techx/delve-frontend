import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CancelSubscriptionModalProps {
  variant?: 'confirm' | 'info';
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}
export const CancelSubscriptionModal = ({
  variant = 'confirm',
  isOpen,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>
            {variant === 'info' ? 'Important Information' : 'Cancel Subscription'}
          </DialogTitle>
          {variant === 'info' && (
            <div className='mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100'>
              <span className='text-sm font-bold text-red-600'>!</span>
            </div>
          )}
        </DialogHeader>
        <DialogDescription>
          {variant === 'info' ? (
            <div className='space-y-3 text-sm'>
              <p>
                • Your subscription will remain active until the end of the current billing period.
              </p>
              <p>
                • Canceling your subscription will remove access to Delve Premium features, including priority visibility, advanced insights, and the verified badge.
              </p>
            </div>
          ) : (
            <p className='text-sm'>Are you sure you want to end your business subscription?</p>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button
            className='w-full bg-red-600 text-white hover:bg-red-700'
            onClick={onConfirm}
          >
            {variant === 'info' ? 'Yes, Cancel Subscription' : 'Yes, Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}