import React from 'react';
import {
  useAdvertisementPlans,
  useBusinessPromotionPlans,
} from '@/app/(clients)/misc/api';
import { cn } from '@/lib/utils';
import { LogoLoadingIcon, TagIcon } from '@/assets/icons';
import { UploadIcon } from '@/app/(clients)/misc/icons';
import { toast } from 'sonner';
import {
  useAdvertCheckout,
  usePromotionCheckout,
} from '@/app/(clients)/misc/api/promotionCheckout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { MoveLeft } from 'lucide-react';

interface CreateAdPromoFormProps {
  initialTab?: 'advert' | 'promotion';
  isOpen: boolean;
  isExtension: boolean;
  isCloseable: boolean;
  showTabs: boolean;
  closeForm?: () => void;
}
const CreateAdPromoForm = ({
  initialTab,
  isExtension,
  showTabs,
  closeForm,
  isCloseable,
}: CreateAdPromoFormProps) => {
  const router = useRouter();

  const { mutate: promotionCheckout, isPending: promoCheckoutLoading } =
    usePromotionCheckout();
  const { mutate: advertCheckout, isPending: advertCheckoutLoading } =
    useAdvertCheckout();

  const [selectedTab, setSelectedTab] = React.useState<'advert' | 'promotion'>(
    initialTab || 'advert'
  );
  const [advertImage, setAdvertImage] = React.useState<File | null>(null);
  const { data: advertPlansData, isLoading: advertPlansLoading } =
    useAdvertisementPlans();
  const { data: promotionPlansData, isLoading: promotionPlansLoading } =
    useBusinessPromotionPlans();

  // Get plans for current tab
  const plans =
    selectedTab === 'promotion' ? promotionPlansData : advertPlansData;
  const plansLoading =
    selectedTab === 'promotion' ? promotionPlansLoading : advertPlansLoading;

  // Duration options: promo has 1,7,14,30; advert has 7,14,30
  let durationOptions: {
    label: string;
    value: number;
    cost: number;
    plan_id: string;
  }[] = [];
  if (plans?.data && Array.isArray(plans.data)) {
    if (selectedTab === 'promotion') {
      durationOptions = [1, 7, 14, 30]
        .map(day => {
          const found = plans.data.find(plan => plan.duration_in_days === day);
          return found
            ? {
                label: `${day} Days`,
                value: day,
                cost: found.price,
                plan_id: found.plan_id,
              }
            : null;
        })
        .filter(Boolean) as any;
    } else {
      durationOptions = [7, 14, 30]
        .map(day => {
          const found = plans.data.find(plan => plan.duration_in_days === day);
          return found
            ? {
                label: `${day} Days`,
                value: day,
                cost: found.price,
                plan_id: found.plan_id,
              }
            : null;
        })
        .filter(Boolean) as any;
    }
  } else {
    durationOptions = [];
  }

  const [selectedDuration, setSelectedDuration] = React.useState<number>(
    durationOptions[0]?.value!
  );

  // Find selected plan/cost
  const selectedPlan = durationOptions.find(
    opt => opt.value === selectedDuration
  );

  const { currentBusiness } = useBusinessContext();
  const business_id = currentBusiness?.id!;

  const handleCheckout = () => {
    if (!selectedPlan) {
      toast.error('Please select a plan before proceeding to checkout');
      return;
    }
    if (selectedTab === 'promotion') {
      promotionCheckout(
        {
          business_id,
          plan_id: selectedPlan.plan_id,
          campaign_extension: String(!!isExtension),
        },
        {
          onSuccess: (data: any) => {
            if (data?.checkout_url) router.push(data.checkout_url);
          },
          onError: (err: any) => {
              toast.error('Failed to create checkout session', {
              description: err.message,
            });
          },
        }
      );
    } else {
      if (!isExtension && !advertImage) {
        toast.error(
          'Please upload an advert image before proceeding to checkout'
        );
        return;
      }
      advertCheckout(
        {
          business_id,
          plan_id: selectedPlan.plan_id,
          advertisment_image: advertImage!,
          campaign_extension: !!isExtension,
        },
        {
          onSuccess: (data: any) => {
            if (data?.checkout_url) router.push(data.checkout_url);
          },
          onError: (err: any) => {

            toast.error('Failed to create checkout session', {
              description: err.message,
            });
          },
        }
      );
    }
  };

  return (
    <div className='flex h-full w-full flex-col overflow-hidden bg-[#FCFCFD]'>
      <header className='h-16'></header>

      <div className='mx-auto flex max-w-xl flex-1 flex-col items-center max-lg:px-4 md:max-lg:px-6'>
        {isCloseable && (
          <Button
            size='xl'
            variant='light'
            className='mr-2 mt-4 mb-9 self-end text-gray-500 hover:text-gray-700'
            onClick={() => {
              if (closeForm) closeForm();
            }}
          >
            <MoveLeft /> Back to Dashboard
          </Button>
        )}
        <header className='text-center'>
          <h1 className='mb-3 text-2xl font-semibold text-[#18181C] sm:text-3xl lg:text-4xl'>
            Promotions and Adverts
          </h1>
          <p className='mb-8 text-balance text-[0.825rem] text-[#4B5565]'>
            Choose your campaign duration, set your budget, and track
            performance in real time.
          </p>
          <div className='mb-8 grid grid-cols-2 gap-4 lg:px-10'>
            {[
              {
                key: 'promotion',
                label: 'Run a Promotion',
                mobile_label: 'Promotion',
              },
              {
                key: 'advert',
                label: 'Create Advertisement',
                mobile_label: 'Advert',
              },
            ].map(tab => (
              <button
                key={tab.key}
                disabled={plansLoading || !showTabs}
                className={cn(
                  'relative rounded-lg border border-[#F8FAFC] bg-[#F8FAFC] px-2.5 py-3 text-xs font-medium text-[#4B5565] !outline-none sm:px-4 sm:py-3.5 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50',
                  selectedTab === tab.key &&
                    'border-primary bg-white text-[#7839EE] shadow-md'
                )}
                onClick={() =>
                  setSelectedTab(tab.key as 'advert' | 'promotion')
                }
              >
                <span className='sm:hidden'>{tab.mobile_label}</span>
                <span className='hidden sm:inline'>{tab.label}</span>
                {selectedTab === tab.key && (
                  <span
                    className={
                      'absolute right-[-10px] top-[-12%] ml-2 inline-block align-middle'
                    }
                  >
                    <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
                      <circle cx='9' cy='9' r='9' fill='#7839EE' />
                      <path
                        d='M5 9l3 3 5-5'
                        stroke='#fff'
                        strokeWidth='2'
                        fill='none'
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        {plansLoading ? (
          <div className='flex w-full items-center justify-center py-16'>
            <LogoLoadingIcon />
          </div>
        ) : (
          <>
            <div className='mx-auto mt-2 w-full max-w-lg lg:px-3'>
              <h3 className='mb-4 text-sm font-semibold text-black'>
                Set{' '}
                {selectedTab === 'promotion' ? 'Promotion' : 'Advertisement'}{' '}
                {isExtension && 'Extension'}{' '}
                Period
              </h3>
              <div className='ap-1.5 mb-6 grid grid-cols-4 sm:gap-3'>
                {durationOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={cn(
                      'rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] px-2 py-1 text-xs font-normal text-[#4B5565] sm:px-4 sm:py-2 sm:text-sm',
                      selectedDuration === opt.value &&
                        'border-[#5F2EEA] bg-[#5F2EEA] text-white shadow-md'
                    )}
                    onClick={() => setSelectedDuration(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className='mb-4 flex items-center justify-center rounded-lg border border-[#C3B5FD#C3B5FD] bg-[#F5F3FF] px-4 py-3 text-xs font-normal text-[#4B5565] lg:text-[0.825rem]'>
                <TagIcon className='mr-1.5 text-[#7839EE]' />
                <span className='ml-1'>
                  Great choice! You've selected {selectedPlan?.value} days. Your
                  total cost is{' '}
                  <span className='ml-1 font-semibold'>
                    ₦{selectedPlan?.cost?.toLocaleString() || '0'}
                  </span>
                </span>
              </div>
              {selectedTab === 'advert' && (
                <div className='mb-7 flex w-full flex-col items-center'>
                  <div className='w-full'>
                    {!advertImage ? (
                      <div className='flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-white px-2 py-8 text-center transition-colors hover:border-purple-400'>
                        <label
                          htmlFor='advert-image-upload'
                          className='flex w-full cursor-pointer flex-col items-center'
                        >
                          <div className='mb-4 flex justify-center'>
                            <UploadIcon />
                          </div>
                          <span className='mb-1 block text-base font-medium text-gray-900'>
                            Upload advert image
                          </span>
                          <span className='mb-2 block text-xs text-gray-500'>
                            (PNG, JPG, JPEG — up to 5MB, 1:1 or 16:9 ratio)
                          </span>
                          <input
                            id='advert-image-upload'
                            type='file'
                            accept='image/png, image/jpeg, image/jpg'
                            className='hidden'
                            onChange={e =>
                              setAdvertImage(e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-400 bg-white px-2 py-8 text-center'>
                        <img
                          src={URL.createObjectURL(advertImage)}
                          alt='Preview'
                          className='mb-4 max-h-40 w-auto rounded-lg object-contain shadow-sm'
                        />
                        <span className='mb-2 block text-xs text-gray-500'>
                          {advertImage.name}
                        </span>
                        <button
                          type='button'
                          className='rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200'
                          onClick={() => setAdvertImage(null)}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                className='mb-3 w-full rounded-xl bg-[#551FB9] py-4 text-sm font-medium text-white'
                onClick={handleCheckout}
                disabled={promoCheckoutLoading || advertCheckoutLoading}
              >
                {promoCheckoutLoading || advertCheckoutLoading
                  ? 'Processing...'
                  : `Pay ₦${selectedPlan?.cost?.toLocaleString() || '0'} with Paystack`}
              </button>
              <div className='mt-2 text-center text-xs text-[#4B5565]'>
                Your{' '}
                {selectedTab === 'promotion' ? 'promotion' : 'advertisement'}{' '}
                will go live once payment is confirmed.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateAdPromoForm;
