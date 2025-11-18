import { FullScreenModal } from '@/components/ui/FullScreenModal';
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
