'use client';

import React, { useMemo, useState } from 'react';
import ReactSwitch from 'react-switch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSubscriptionPlans, useCurrentUser, useCreateSubscriptionCheckout } from '@/app/(clients)/misc/api';
import { Button } from '@/components/ui';

const FEATURES = [
  {
    label: 'Business Profile Visibility',
    freemium: 'Limited visibility in search results',
    premium: 'Priority Placement in search',
  },
  {
    label: 'Listing Duration',
    freemium: 'Indefinite',
    premium: 'Indefinite',
  },
  {
    label: 'Listing Features',
    freemium: 'Limited',
    premium: 'Available',
  },
  {
    label: 'Photo Uploads',
    freemium: 'Limited to 1-6 Images',
    premium: 'Up to 20 uploads',
  },
  {
    label: 'Verification Badge',
    freemium: 'No badge',
    premium: 'Verification Badge',
  },
  {
    label: 'Analytics Dashboard',
    freemium: 'Not available',
    premium: 'Access all insights on visits, clicks etc',
  },
  {
    label: 'Customer Save to Fav Access',
    freemium: 'Can be saved by up to 50 users',
    premium: 'No save limit',
  },
  {
    label: 'Customer Review',
    freemium: 'View only',
    premium: 'Actively collect and respond to reviews',
  },
  {
    label: 'Support and Business Cons.',
    freemium: 'Email only',
    premium: '24/7 Priority Chat Support',
  },
];

const BusinessLandingPricingList = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // API hooks
  const { data: plansResponse, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: userResponse, isLoading: userLoading } = useCurrentUser();
  const createCheckoutMutation = useCreateSubscriptionCheckout();
  
  const plans = plansResponse?.data || [];
  const user = userResponse?.user;
  
  // Find the appropriate plan based on billing cycle
  const selectedPlan = useMemo(() => {
    if (!plans.length) return null;
    return plans.find(plan => 
      isAnnual ? plan.billing_cycle === 'yearly' : plan.billing_cycle === 'monthly'
    ) || plans[0];
  }, [plans, isAnnual]);

  const premiumPrice = selectedPlan?.price || (isAnnual ? 54000 : 5000);
  const premiumTitle = useMemo(
    () => `Premium Listing (₦${premiumPrice.toLocaleString()}/${isAnnual ? 'yearly' : 'monthly'})`,
    [premiumPrice, isAnnual],
  );

  const handleProceed = async () => {
    console.log(userResponse)
    if (!user && !userLoading) {
      toast.error('Please log in to subscribe to a plan');
      return;
    }

    // Check if user is a business owner
    if (!user?.is_brand_owner || user?.number_of_owned_businesses === 0) {
      toast.error(
        <div className="flex flex-col gap-2">
          <span>You need to be a business owner to subscribe to a plan.</span>
          <Button
            size="sm"
            onClick={() => router.push('/businesses/create-listing')}
            className="w-fit bg-purple-600 hover:bg-purple-700 text-white"
          >
            Create Business
          </Button>
        </div>,
        {
          duration: 5000,
        }
      );
      return;
    }

    // Check if plan is available
    if (!selectedPlan) {
      toast.error('Please select a valid plan');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await createCheckoutMutation.mutateAsync({
        plan_id: selectedPlan.plan_id,
      });
      
      if (response.checkout_url) {
        // Redirect to Paystack checkout
        window.location.href = response.checkout_url;
      } else {
        toast.success('Checkout session created successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  if (plansLoading) {
    return (
      <section className='w-full font-inter text-[#0F172B] flex items-center justify-center py-20'>
        <div className="animate-pulse">Loading plans...</div>
      </section>
    );
  }

  return (
    <section className='w-full font-inter text-[#0F172B]'>
      {/* Mobile */}
      <div className='mt-10 flex w-full flex-col gap-6 px-5 sm:hidden'>
        <div className='flex items-center justify-center gap-3 text-sm'>
          <span className={!isAnnual ? 'font-semibold text-[#6E44FF]' : 'text-[#5F6B7A]'}>
            Monthly
          </span>
          <ReactSwitch
            checked={isAnnual}
            onChange={() => setIsAnnual(prev => !prev)}
            offHandleColor='#6E44FF'
            onHandleColor='#6E44FF'
            offColor='#E8EAF2'
            onColor='#E8EAF2'
            checkedIcon={false}
            uncheckedIcon={false}
            handleDiameter={18}
            height={24}
            width={48}
            boxShadow='0 0 0'
            activeBoxShadow='0 0 0'
          />
          <span className={isAnnual ? 'font-semibold text-[#6E44FF]' : 'text-[#5F6B7A]'}>
            Annually
            <span className='ml-2 inline-flex rounded-full bg-[#EEF0F8] px-2 py-0.5 text-[11px] text-[#475569]'>
              10% off
            </span>
          </span>
        </div>

        <div className='flex flex-col gap-5'>
          {[{
            key: 'premium',
            title: premiumTitle,
            description: 'Unlock full access to every growth tool on Delve.',
            entries: FEATURES.map(feature => ({
              label: feature.label,
              value: feature.premium,
            })),
            headerStyles: 'bg-[#6E44FF] text-white',
            bodyStyles: 'bg-[#F7F8FD]',
            showButton: true,
          },
          {
            key: 'freemium',
            title: 'Freemium Listing',
            description: 'List your business with essential visibility features.',
            entries: FEATURES.map(feature => ({
              label: feature.label,
              value: feature.freemium,
            })),
            headerStyles: 'bg-[#F8FAFC] text-[#0F172B]',
            bodyStyles: 'bg-white',
            showButton: false,
          }].map(plan => (
            <div
              key={plan.key}
              className='overflow-hidden rounded-2xl border border-[#E2E8F0] shadow-sm'
            >
              <div className={`flex flex-col gap-2 px-6 py-5 ${plan.headerStyles}`}>
                <h2 className='text-base font-semibold'>{plan.title}</h2>
                <p className='text-xs leading-5 opacity-80'>{plan.description}</p>
              </div>
              <div className={`${plan.bodyStyles}`}>
                <div className='flex flex-col'>
                  {plan.entries.map(entry => (
                    <div key={entry.label} className='flex flex-col gap-1 px-6 py-4'>
                      <span className='text-[11px] uppercase tracking-wide text-[#94A3B8]'>
                        {entry.label}
                      </span>
                      <p className='text-sm text-[#0F172B]'>{entry.value}</p>
                    </div>
                  ))}
                  {plan.showButton && (
                    <div className='px-6 py-4 border-t border-[#E2E8F0]'>
                      <Button
                        onClick={handleProceed}
                        disabled={isLoading || !selectedPlan}
                        className='w-full bg-[#6E44FF] hover:bg-[#5A37D8] text-white'
                      >
                        {isLoading ? 'Processing...' : 'Subscribe Now'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className='hidden w-full flex-col items-center gap-10 sm:flex'>
        <div className='flex items-center gap-5 text-sm'>
          <span className={!isAnnual ? 'font-semibold text-[#6E44FF]' : 'text-[#64748B]'}>
            Monthly
          </span>
          <ReactSwitch
            checked={isAnnual}
            onChange={() => setIsAnnual(prev => !prev)}
            offHandleColor='#6E44FF'
            onHandleColor='#6E44FF'
            offColor='#E8EAF2'
            onColor='#E8EAF2'
            checkedIcon={false}
            uncheckedIcon={false}
            handleDiameter={20}
            height={26}
            width={52}
            boxShadow='0 0 0'
            activeBoxShadow='0 0 0'
          />
          <span className={isAnnual ? 'font-semibold text-[#6E44FF]' : 'text-[#64748B]'}>
            Annually
            <span className='ml-2 inline-flex rounded-full bg-[#EEF0F8] px-2 py-0.5 text-[11px] text-[#475569]'>
              10% off
            </span>
          </span>
        </div>

        <div className='w-full max-w-[960px] overflow-hidden rounded-lg border border-[#E2E8F0] shadow-sm font-inter'>
          <div className='grid grid-cols-[1fr,1.5fr,1.75fr] text-sm font-semibold'>
            <div className='border-r border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-5 text-[#4B5565]'>
              Feature/Benefit
            </div>
            <div className='border-r border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-5 text-[#4B5565] capitalize'>
              Freemium Listing
            </div>
            <div className='bg-[#551FB9] border-b border-[#551FB9] px-6 py-5 text-white'>
              {premiumTitle}
            </div>
          </div>

          <div className='flex flex-col'>
            {FEATURES.map(feature => (
              <div key={feature.label} className='grid grid-cols-[1fr,1.5fr,1.75fr] text-sm font-inter'>
                <div className='border-r border-[#E2E8F0] bg-white px-6 py-4 text-[#0F0F0F]'>
                  {feature.label}
                </div>
                <div className='border-r border-[#E2E8F0] bg-white px-6 py-4 text-[#0F0F0F]'>
                  {feature.freemium}
                </div>
                <div className='bg-[#F5F3FF80] border-x-[#D9D6FE] px-6 py-4 text-[#0F0F0F]'>
                  {feature.premium}
                </div>
              </div>
            ))}
            
            {/* Subscribe button row */}
            <div className='grid grid-cols-[1fr,1.5fr,1.75fr] text-sm font-inter'>
              <div className='border-r border-[#E2E8F0] bg-white px-6 py-4'></div>
              <div className='border-r border-[#E2E8F0] bg-white px-6 py-4'>
                <span className='text-sm text-gray-500'>Current Plan</span>
              </div>
              <div className='bg-[#F5F3FF80] border-x-[#D9D6FE] px-6 py-4'>
                <Button
                  onClick={handleProceed}
                  disabled={isLoading || !selectedPlan}
                  className='w-full bg-[#551FB9] hover:bg-[#4A1A9E] text-white'
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessLandingPricingList;
