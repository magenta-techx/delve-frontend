import React, { useState } from 'react';
import { useBusinessActivation } from '@/app/(clients)/misc/api/useBusinessActivation';
import { toast } from 'sonner';
import { Button } from '@/components/ui';

interface BusinessActivationModalProps {
  business_id: string | number;
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export const BusinessActivationModal: React.FC<
  BusinessActivationModalProps
> = ({ business_id, isOpen, onClose, onActivated }) => {
  const { mutate, isPending } = useBusinessActivation();
  const [error, setError] = useState<string | null>(null);

  const handleActivate = () => {
    mutate(
      { business_id, activation_status: 'activate' },
      {
        onSuccess: data => {
          toast.success(data?.message || 'Business activated successfully');
          onActivated?.();
          onClose();
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to activate business');
          toast.error(err.message || 'Failed to activate business');
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-lg font-semibold'>Activate Business</h2>
        <p className='mb-4'>Are you sure you want to activate this business?</p>
        {error && <div className='mb-2 text-red-500'>{error}</div>}
        <div className='flex justify-end gap-2'>
          <Button
            size='lg'
            onClick={onClose}
            disabled={isPending}
            variant='black'
          >
            Cancel
          </Button>
          <Button size='lg' onClick={handleActivate} disabled={isPending}>
            {isPending ? 'Activating...' : 'Activate'}
          </Button>
        </div>
      </div>
    </div>
  );
};
