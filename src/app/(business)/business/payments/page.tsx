'use client';

import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
} from '@/components/ui';
import { ChevronDown, MoveRight, Settings } from 'lucide-react';
import { useBilling, useCurrentUser } from '@/app/(clients)/misc/api';
import { useChangeCard } from '@/app/(clients)/misc/api/payment';
import { useBooleanStateControl } from '@/hooks';
import {
  ReceiptModal,
  PlanSelectionModal,
  CancelSubscriptionModal,
  BusinessPageHeader,
} from '@/app/(business)/misc/components';
import { cn } from '@/lib/utils';
import {
  LogoLoadingIcon,
  MasterCardIcon,
  ReceiptIcon,
  VisaIcon,
} from '@/assets/icons';
import { EmptySavedBusinessesIcon } from '@/app/(clients)/misc/icons';
import { PaymentHistory } from '@/types/api';
import { format } from 'date-fns';
import { PaymentsIcon } from '../../misc/components/icons';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const changeCardMutation = useChangeCard();
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState<
    number | null
  >(null);
  const {
    state: isReceiptModalOpen,
    setTrue: openReceiptModal,
    setFalse: closeReceiptModal,
  } = useBooleanStateControl(false);

  const {
    state: isPlanSelectionOpen,
    setTrue: openPlanSelection,
    setFalse: closePlanSelection,
  } = useBooleanStateControl(false);

  const {
    state: isCancelConfirmOpen,
    setTrue: openCancelConfirm,
    setFalse: closeCancelConfirm,
  } = useBooleanStateControl(false);

  const {
    state: isCancelInfoOpen,
    setTrue: openCancelInfo,
    setFalse: closeCancelInfo,
  } = useBooleanStateControl(false);

  const [filterPeriod, setFilterPeriod] = useState('All time');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = ['All time', '2025', '2024', '2023'];

  // API calls
  const {
    data: billingResponse,
    isLoading: billingLoading,
    refetch: refetchBillingData,
  } = useBilling();
  const {
    data: userResponse,
    isLoading: userLoading,
    refetch: refetchUserData,
  } = useCurrentUser();

  const billingData = billingResponse?.data;
  const userData = userResponse?.user;

  const currentPlan = {
    name: billingData?.plan?.name || userData?.current_plan || 'Freemium',
    cycle: billingData?.plan?.billing_cycle || 'Monthly',
    cost: billingData?.plan?.price || 0,
    daysLeft:
      billingData?.plan?.days_left ||
      (userData?.current_plan === 'Freemium' ? null : null),
    hasPaymentMethod:
      billingData?.card && Object.keys(billingData.card).length > 0,
    isPendingCancellation: billingData?.plan.is_pending_cancellation || false,
  };

  console.log(billingData);

  const handleCancelClick = () => {
    closeCancelConfirm();
    openCancelInfo();
  };

  const handleSelectTransaction = (transaction: PaymentHistory) => {
    const idx = billingData?.payment_history.findIndex(
      t => t.payment_reference_id === transaction.payment_reference_id
    );
    if (idx !== undefined && idx > -1) {
      setSelectedReceiptIndex(idx);
      openReceiptModal();
    }
  };

  const handleCloseReceipt = () => {
    closeReceiptModal();
    setSelectedReceiptIndex(null);
  };

  // Show loading state
  if (billingLoading || userLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  return (
    <div className='relative h-full w-full space-y-3 overflow-hidden overflow-y-scroll md:space-y-6 lg:space-y-10'>
      <BusinessPageHeader
        title='Payment & Subscription'
        description='Effortlessly handle your billing and invoices right here.'
      />

      <div className='container grid gap-6 px-4 pb-6 lg:px-6'>
        {/* Current Plan Summary */}
        <section className='grid gap-5 lg:grid-cols-[1fr,minmax(auto,350px)] lg:items-stretch lg:gap-6 xl:grid-cols-[1fr,minmax(auto,470px)]'>
          <article className='flex flex-col gap-5 rounded-2xl border border-[#CDD5DF] bg-card p-4 px-6 text-card-foreground'>
            <h1 className='font-inter text-base font-semibold md:text-lg'>
              Current Plan Summary
            </h1>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <p className='text-[0.55rem] font-semibold uppercase text-muted-foreground'>
                  Plan name
                </p>
                <p className='text-xs font-medium text-[#2C2C2C] sm:text-sm'>
                  {currentPlan.name}
                </p>
              </div>
              <div>
                <p className='text-[0.55rem] font-semibold uppercase text-muted-foreground'>
                  Billing Cycle
                </p>
                <p className='text-xs font-medium capitalize text-[#2C2C2C] sm:text-sm'>
                  {currentPlan.name === 'Free Trial' && currentPlan.daysLeft
                    ? `${currentPlan.daysLeft} Days`
                    : currentPlan.cycle}
                </p>
              </div>
              <div>
                <p className='text-[0.55rem] font-semibold uppercase text-muted-foreground'>
                  Plan Cost
                </p>
                <p className='text-xs font-medium text-[#2C2C2C] sm:text-sm'>
                  {currentPlan.name === 'Free Trial'
                    ? '0.00'
                    : currentPlan.cost > 0
                      ? `₦${currentPlan.cost.toLocaleString()}`
                      : 'Free'}
                </p>
              </div>
            </div>
            <div>
              <p className='mb-2 text-xs text-muted-foreground'>Usage</p>
              <p className='mb-3 text-balance text-xs font-medium text-[#2C2C2C] sm:text-sm lg:pr-6'>
                {currentPlan.name === 'Free Trial' && currentPlan.daysLeft
                  ? `You have ${currentPlan.daysLeft} more days before your free trial ends`
                  : currentPlan.name === 'Premium' && currentPlan.daysLeft
                    ? `You have ${currentPlan.daysLeft} more days before your next premium payment.`
                    : 'You currently have access to limited features. Upgrade to Premium and unlock full visibility, insights, and tools to grow your business faster.'}
              </p>
              {((currentPlan.name === 'Free Trial' && !!currentPlan.daysLeft) ||
                (currentPlan.name === 'Premium' && !!currentPlan.daysLeft)) && (
                <div className='h-3.5 w-full overflow-hidden rounded bg-gray-200'>
                  <div
                    className='h-3.5 rounded bg-purple-600'
                    style={{
                      width:
                        currentPlan.name === 'Free Trial'
                          ? `${((7 - currentPlan.daysLeft!) / 7) * 100}%`
                          : currentPlan.cycle == 'monthly'
                            ? `${((30 - currentPlan.daysLeft!) / 30) * 100}%`
                            : `${((365 - currentPlan.daysLeft!) / 365) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </article>

          <article
            className={cn(
              'relative overflow-hidden rounded-2xl p-6 lg:px-8',
              "bg-[url('/business/payment-card-back.jpg')] bg-cover bg-no-repeat"
            )}
          >
            <div className='absolute inset-0 bg-[#551FB980]' />

            {/* Upgrade Banner */}
            {currentPlan.name === 'Free Trial' ||
            currentPlan.name === 'Freemium' ? (
              <>
                {!userData?.has_paid_for_premium ? (
                  <div className='relative z-[2] flex size-full flex-col'>
                    <h3 className='mb-3 flex flex-col justify-between text-balance font-inter font-semibold leading-tight text-white lg:text-xl'>
                      {currentPlan.name === 'Free Trial'
                        ? `Enjoying your free ${currentPlan.daysLeft}-day trial? Subscribe today to keep premium features when your trial ends.`
                        : 'Enjoy full visibility, advanced insights, and a verified badge that builds customer trust.'}
                    </h3>
                    <Button
                      className='fit-content mt-auto h-10 w-max border border-[#FBFAFF] bg-[#551FB9] text-white'
                      onClick={openPlanSelection}
                      variant={'unstyled'}
                    >
                      Upgrade to Premium <MoveRight className='ml-1' />
                    </Button>
                  </div>
                ) : (
                  <div className='relative z-[2] pt-6'>
                    <h3 className='mb-3 text-lg font-semibold text-white'>
                      You&apos;ve cancelled your subscription. Resubscribe now
                      to keep enjoying Delve Premium without interruption.
                    </h3>
                    <Button
                      className='w-full border border-white/30 bg-white/20 text-white hover:bg-white/30'
                      onClick={openPlanSelection}
                    >
                      Resubscribe to Premium →
                    </Button>
                  </div>
                )}
              </>
            ) : currentPlan.isPendingCancellation ? (
              <div className='relative z-[2] pt-6'>
                <h3 className='mb-3 text-lg font-semibold text-white'>
                  You&apos;ve cancelled your subscription. You still have{' '}
                  {currentPlan.daysLeft} days of access left before your current
                  plan expires. Resubscribe now to keep enjoying Delve Premium
                  without interruption.
                </h3>
                <Button
                  className='w-full border border-white/30 bg-white/20 text-white hover:bg-white/30'
                  onClick={openPlanSelection}
                >
                  Resubscribe to Premium →
                </Button>
              </div>
            ) : (
              <>
                {currentPlan.hasPaymentMethod && (
                  <div className='relative z-[2] flex h-full flex-col text-white'>
                    <div className='flex flex-row items-center justify-between pb-4'>
                      <h3 className='text-lg'>Current Payment Method</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Settings className='h-5 w-5 text-white/80 hover:text-white' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            disabled={changeCardMutation.isPending}
                            onClick={async () => {
                              try {
                                const result =
                                  await changeCardMutation.mutateAsync();
                                if (result.card_update_link) {
                                  window.open(
                                    result.card_update_link,
                                    '_blank'
                                  );
                                }
                              } catch (err) {
                                toast.error(
                                  'Failed to initiate card change process.',
                                  { description: err as string }
                                );
                              }
                            }}
                          >
                            Change Card <PaymentsIcon className='ml-2' />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className='p-0'
                            onClick={openCancelConfirm}
                          >
                            <button
                              className='rounded-lg border border-red-600 px-2 py-1.5 text-xs text-[#C62828]'
                              onClick={openCancelConfirm}
                            >
                              Cancel Subscription
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className='mt-4 text-white'>
                      <div className='flex items-start gap-3'>
                        <div className='mt-1.5 flex gap-1'>
                          {billingData?.card.payment_card_type ==
                          'Mastercard' ? (
                            <MasterCardIcon />
                          ) : (
                            <VisaIcon />
                          )}
                        </div>
                        <div className='flex flex-col gap-2.5'>
                          <p className='font-medium'>
                            {billingData?.card?.payment_card_type
                              ? billingData.card.payment_card_type
                                  .charAt(0)
                                  .toUpperCase() +
                                billingData.card.payment_card_type.slice(1)
                              : 'Master Card'}
                          </p>
                          <p className='space-x-4 font-inter text-base font-normal text-[#EEF2F6] lg:text-lg'>
                            <span>****</span>
                            <span>****</span>
                            <span>****</span>
                            <span>
                              {billingData?.card?.payment_card_last_4_digits ||
                                '4002'}
                            </span>
                          </p>
                          <p className='text-xs text-[#E3E8EF]'>
                            Expiry on{' '}
                            {billingData?.card?.payment_card_expiratin_month ||
                              '20'}
                            /
                            {billingData?.card?.payment_card_expiratin_year ||
                              '2027'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </article>
        </section>

        {/* Payment History */}
        <section className='relative overflow-hidden rounded-2xl border border-[#E8EAF6] bg-card py-4'>
          <header className='flex flex-row items-center justify-between p-4 pt-0 md:px-6'>
            <h3 className='font-inter text-base font-semibold md:text-lg'>
              Payment History
            </h3>
            <div className='relative'>
              <Button
                variant='outline'
                size='sm'
                className='gap-2 bg-transparent'
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                {filterPeriod}
                <ChevronDown className='h-4 w-4' />
              </Button>
              {showFilterDropdown && (
                <div className='absolute right-0 z-10 mt-2 w-32 rounded-md border bg-popover p-2 shadow-md'>
                  {filterOptions.map(option => (
                    <button
                      key={option}
                      className='block w-full rounded px-2 py-1 text-left text-sm hover:bg-muted'
                      onClick={() => {
                        setFilterPeriod(option);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>
          <div>
            {billingData?.payment_history.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <EmptyState
                  media={<EmptySavedBusinessesIcon />}
                  title='You don’t have any history yet.'
                />
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-xs sm:text-sm'>
                  <thead>
                    <tr className='bg-[#F5F3FF]'>
                      {[
                        'Subscription plan',
                        'Period',
                        'Amount',
                        'Status',
                        'Date',
                        'Payment Card',
                        ' ',
                      ].map((header, idx) => (
                        <th
                          key={header}
                          className={cn(
                            'py-3 text-left font-inter font-medium text-[#4B5565]',
                            idx === 0 && 'pl-4 pr-2 md:pl-8',
                            idx !== 0 && idx !== 6 && 'px-2',
                            idx === 6 && 'pl-2 pr-4 md:pr-8'
                          )}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {billingData?.payment_history.map(transaction => (
                      <tr
                        key={transaction.payment_reference_id}
                        className='group cursor-pointer bg-[#FAFAFA] hover:bg-[#f5f3f3]'
                      >
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'pl-4 pr-2 md:pl-8'
                          )}
                        >
                          {transaction.plan.name} plan
                        </td>
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'px-2'
                          )}
                        >
                          {transaction.plan.billing_cycle ?? '-'}
                        </td>
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'px-2'
                          )}
                        >
                          ₦{transaction.amount_paid.toLocaleString()}
                        </td>
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'px-2'
                          )}
                        >
                          <span
                            className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                              transaction.status === 'success'
                                ? 'bg-[#DAFBD5] text-[#558B2F]'
                                : 'bg-[#FFE1E1] text-[#C62828]'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'px-2'
                          )}
                        >
                          {format(
                            new Date(transaction.timestamp),
                            'dd-MM-yyyy'
                          )}
                        </td>
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'px-2'
                          )}
                        >
                          **** {transaction.payment_card_last_4_digits}
                        </td>
                        <td
                          className={cn(
                            'bg-white py-4 font-inter font-normal',
                            'pl-2 pr-4 md:pr-8'
                          )}
                        >
                          <button
                            onClick={() => handleSelectTransaction(transaction)}
                            className='text-blue-600 hover:underline'
                          >
                            <ReceiptIcon className='h-4 w-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      {isReceiptModalOpen && selectedReceiptIndex !== null && (
        <ReceiptModal
          transactions={billingData?.payment_history || []}
          initialIndex={selectedReceiptIndex}
          onClose={handleCloseReceipt}
          billingData={billingData}
          userData={userData}
        />
      )}

      <PlanSelectionModal
        isOpen={isPlanSelectionOpen}
        onClose={closePlanSelection}
      />

      <CancelSubscriptionModal
        variant='confirm'
        isOpen={isCancelConfirmOpen}
        onClose={closeCancelConfirm}
        onConfirm={handleCancelClick}
      />

      <CancelSubscriptionModal
        variant='info'
        isOpen={isCancelInfoOpen}
        onClose={closeCancelInfo}
        reload={() => {
          refetchUserData();
          refetchBillingData();
        }}
      />
    </div>
  );
}
