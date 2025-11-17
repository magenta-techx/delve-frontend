import { useState } from 'react';
import { Button } from '@/components/ui';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { useSubscriptionPlans } from '@/app/(clients)/misc/api';
import { BusinessLandingPricingList } from '@/app/(clients)/misc/components';
import { Logo } from '@/assets/icons';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanSelectionModal({
  isOpen,
  onClose,
}: PlanSelectionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>(
    'annually'
  );
  const { data } = useSubscriptionPlans();

  const planFeatures = [
    {
      label: 'Business Profile Visibility',
      free: 'Limited visibility in search results',
      premium: 'Priority Placement in search',
    },
    { label: 'Listing Duration', free: 'Indefinite', premium: 'Indefinite' },
    { label: 'Listing Features', free: 'Limited', premium: 'Available' },
    {
      label: 'Photo Uploads',
      free: 'Limited to 1-6 images',
      premium: 'Up to 20 uploads',
    },
    {
      label: 'Verification Badge',
      free: 'No badge',
      premium: 'Verification Badge',
    },
    {
      label: 'Analytics Dashboard',
      free: 'Not available',
      premium: 'Access all insights on visits, clicks etc',
    },
    {
      label: 'Customer Save to Fav Access',
      free: 'Can be saved by up to 50 users',
      premium: 'No save limit',
    },
    {
      label: 'Customer Review',
      free: 'View only',
      premium: 'Actively collect and respond to reviews',
    },
    {
      label: 'Support and Business Cons.',
      free: 'Email only',
      premium: '24/7 Priority Chat Support',
    },
  ];

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      closeButtonPosition='top-right'
    >
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        {/* Header with Logo */}
        <div className='mb-8'>
          <div className='mb-8 flex items-center gap-2'>
            <Logo/>
          </div>

          <h1 className='mb-6 text-center text-3xl font-bold'>
            Select business plan to continue
          </h1>

    
        </div>

        <BusinessLandingPricingList />
      </div>
    </FullScreenModal>
  );
}
