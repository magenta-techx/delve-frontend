'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { ChevronDown, Download, Settings } from 'lucide-react';
import { useBilling, useCurrentUser } from '@/app/(clients)/misc/api';
import { useBooleanStateControl } from '@/hooks';
import {
  ReceiptModal,
  PlanSelectionModal,
  CancelSubscriptionModal,
} from '@/app/(business)/misc/components';

interface PaymentTransaction {
  id: number;
  plan: string;
  period: string;
  amount: number;
  status: string;
  date: string;
  card: string;
}

export default function PaymentPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);
  
  // Modal state management with useBooleanStateControl
  const {
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
  const { data: billingResponse, isLoading: billingLoading } = useBilling();
  const { data: userResponse, isLoading: userLoading } = useCurrentUser();

  const billingData = billingResponse?.data;
  const userData = userResponse?.data;

  // Transform payment history data for table
  const paymentHistoryData =
    billingData?.payment_history?.map((payment, index) => ({
      id: index + 1,
      plan: payment.plan.name,
      period: payment.plan.billing_cycle,
      amount: payment.amount_paid,
      status:
        payment.status === 'success'
          ? 'Successful'
          : payment.status === 'failed'
            ? 'Failed'
            : payment.status,
      date: new Date(payment.timestamp).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      card: payment.payment_card_last_4_digits,
    })) || [];

  // Current plan data from API
  const currentPlan = {
    name: billingData?.plan?.name || userData?.current_plan || 'Freemium',
    cycle: billingData?.plan?.billing_cycle || 'Monthly',
    cost: billingData?.plan?.price || 0,
    daysLeft:
      billingData?.plan?.days_left ||
      (userData?.current_plan === 'Freemium' ? null : 7),
    hasPaymentMethod:
      billingData?.card && Object.keys(billingData.card).length > 0,
  };

  console.log(billingData);

  const handleCancelClick = () => {
    closeCancelConfirm();
    openCancelInfo();
  };

  const handleSelectTransaction = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    openReceiptModal();
  };

  const handleCloseReceipt = () => {
    closeReceiptModal();
    setSelectedTransaction(null);
  };

  // Show loading state
  if (billingLoading || userLoading) {
    return (
      <div className='space-y-6 p-6'>
        <div className='animate-pulse space-y-6'>
          <div className='h-8 w-64 rounded bg-gray-200'></div>
          <div className='grid gap-6'>
            <div className='space-y-6'>
              <div className='h-48 rounded-lg bg-gray-200'></div>
              <div className='h-64 rounded-lg bg-gray-200'></div>
            </div>
            <div className='space-y-6'>
              <div className='h-48 rounded-lg bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div>
        <h1 className='font-inter text-xl font-semibold lg:text-3xl'>
          Payment & Subscription
        </h1>
        <p className='text-balance text-xs font-normal text-[#4B5565] max-lg:max-w-[30ch] lg:text-sm'>
          Effortlessly handle your billing and invoices right here.
        </p>
      </div>

      <div className='grid gap-6 container'>
        {/* Main content */}
        <div className='space-y-6'>
          {/* Current Plan Summary */}
          <section className="grid grid-cols-[1fr,minmax(auto,400px)] gap-5">
            <article className='rounded-xl border border-[#CDD5DF] bg-card text-card-foreground p-4 px-6'>
              <h1 className="font-inter text-lg font-semibold">Current Plan Summary</h1>
              <div className='space-y-4'>
                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <p className='text-[0.55rem] font-semibold uppercase text-muted-foreground'>
                      Plan name
                    </p>
                    <p className='text-sm font-medium text-[#2C2C2C]'>{currentPlan.name}</p>
                  </div>
                  <div>
                    <p className='text-[0.55rem] font-semibold uppercase text-muted-foreground'>
                      Billing Cycle
                    </p>
                    <p className='text-sm font-medium text-[#2C2C2C]'>
                      {currentPlan.name === 'Free Trial' && currentPlan.daysLeft
                        ? `${currentPlan.daysLeft} Days`
                        : currentPlan.cycle}
                    </p>
                  </div>
                  <div>
                    <p className='text-[0.55rem] font-semibold uppercase text-muted-foreground'>
                      Plan Cost
                    </p>
                    <p className='text-sm font-medium text-[#2C2C2C]'>
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
                  <p className='mb-3 text-sm font-medium text-[#2C2C2C]'>
                    {currentPlan.name === 'Free Trial' && currentPlan.daysLeft
                      ? `You have ${currentPlan.daysLeft} more days before your free trial ends`
                      : currentPlan.name === 'Premium Plan' &&
                          currentPlan.daysLeft
                        ? `You have ${currentPlan.daysLeft} more days before your next premium payment.`
                        : 'You currently have access to limited features. Upgrade to Premium and unlock full visibility, insights, and tools to grow your business faster.'}
                  </p>
                  {((currentPlan.name === 'Free Trial' &&
                    currentPlan.daysLeft) ||
                    (currentPlan.name === 'Premium Plan' &&
                      currentPlan.daysLeft)) && (
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-purple-600'
                        style={{
                          width:
                            currentPlan.name === 'Free Trial'
                              ? `${((7 - currentPlan.daysLeft!) / 7) * 100}%`
                              : `${((30 - currentPlan.daysLeft!) / 30) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
            
            <div className='space-y-6 lg:col-span-1'>
              {/* Upgrade Banner */}
              {currentPlan.name === 'Free Trial' ||
              currentPlan.name === 'Freemium' ? (
                <Card className='border-0 bg-gradient-to-br from-purple-600 to-purple-700 text-white'>
                  <CardContent className='pt-6'>
                    <h3 className='mb-3 text-lg font-bold'>
                      {currentPlan.name === 'Free Trial'
                        ? `Enjoying your free ${currentPlan.daysLeft}-day trial? Subscribe today to keep premium features when your trial ends.`
                        : 'Enjoy full visibility, advanced insights, and a verified badge that builds customer trust.'}
                    </h3>
                    <Button
                      className='w-full border border-white/30 bg-white/20 text-white hover:bg-white/30'
                      onClick={openPlanSelection}
                    >
                      Upgrade to Premium →
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className='border-0 bg-gradient-to-br from-purple-600 to-purple-700 text-white'>
                  <CardContent className='pt-6'>
                    <h3 className='mb-3 text-lg font-bold'>
                      You&apos;ve cancelled your subscription. You still have{' '}
                      {currentPlan.daysLeft} days of access left before your
                      current plan expires. Resubscribe now to keep enjoying
                      Delve Premium without interruption.
                    </h3>
                    <Button
                      className='w-full border border-white/30 bg-white/20 text-white hover:bg-white/30'
                      onClick={openPlanSelection}
                    >
                      Resubscribe to Premium →
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              {currentPlan.hasPaymentMethod && (
                <Card className='border-0 bg-gradient-to-br from-purple-600 to-purple-700 text-white'>
                  <CardHeader className='flex flex-row items-center justify-between pb-4'>
                    <CardTitle className='text-lg'>
                      Current Payment Method
                    </CardTitle>
                    <button className='text-white/80 hover:text-white'>
                      <Settings className='h-5 w-5' />
                    </button>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex gap-1'>
                        <div className='h-6 w-6 rounded bg-red-500' />
                        <div className='h-6 w-6 rounded bg-yellow-500' />
                      </div>
                      <div>
                        <p className='font-semibold'>
                          {billingData?.card?.payment_card_type
                            ? billingData.card.payment_card_type
                                .charAt(0)
                                .toUpperCase() +
                              billingData.card.payment_card_type.slice(1)
                            : 'Master Card'}
                        </p>
                        <p className='text-sm text-white/80'>
                          **** **** ****{' '}
                          {billingData?.card?.payment_card_last_4_digits ||
                            '4002'}
                        </p>
                      </div>
                    </div>
                    <p className='text-sm text-white/80'>
                      Expiry on{' '}
                      {billingData?.card?.payment_card_expiratin_month || '20'}/
                      {billingData?.card?.payment_card_expiratin_year || '2027'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Cancel Subscription (only show for premium users) */}
              {(currentPlan.name === 'Premium Plan' ||
                userData?.is_premium_plan_active) && (
                <Card>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <div>
                        <h3 className='mb-2 font-semibold text-red-600'>
                          Subscription Management
                        </h3>
                        <p className='mb-4 text-sm text-muted-foreground'>
                          Need to make changes to your subscription? You can
                          cancel anytime.
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        className='w-full border-red-200 text-red-600 hover:bg-red-50'
                        onClick={openCancelConfirm}
                      >
                        Cancel subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Payment History */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Payment History</CardTitle>
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
            </CardHeader>
            <CardContent>
              {paymentHistoryData.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                    <span className='text-2xl'>🎉</span>
                  </div>
                  <p className='text-muted-foreground'>
                    You don&apos;t have any history yet.
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b'>
                        <th className='px-2 py-3 text-left font-semibold'>
                          Subscription plan
                        </th>
                        <th className='px-2 py-3 text-left font-semibold'>
                          Period
                        </th>
                        <th className='px-2 py-3 text-left font-semibold'>
                          Amount
                        </th>
                        <th className='px-2 py-3 text-left font-semibold'>
                          Status
                        </th>
                        <th className='px-2 py-3 text-left font-semibold'>
                          Date
                        </th>
                        <th className='px-2 py-3 text-left font-semibold'>
                          Payment Card
                        </th>
                        <th className='px-2 py-3 text-left font-semibold'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistoryData.map(transaction => (
                        <tr
                          key={transaction.id}
                          className='cursor-pointer border-b hover:bg-muted/50'
                        >
                          <td className='px-2 py-3'>{transaction.plan}</td>
                          <td className='px-2 py-3'>{transaction.period}</td>
                          <td className='px-2 py-3'>
                            ₦{transaction.amount.toLocaleString()}
                          </td>
                          <td className='px-2 py-3'>
                            <span
                              className={`rounded px-2 py-1 text-xs font-medium ${
                                transaction.status === 'Successful'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td className='px-2 py-3'>{transaction.date}</td>
                          <td className='px-2 py-3'>**** {transaction.card}</td>
                          <td className='px-2 py-3'>
                            <button
                              onClick={() => handleSelectTransaction(transaction)}
                              className='text-blue-600 hover:underline'
                            >
                              <Download className='h-4 w-4' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ReceiptModal
        transaction={selectedTransaction}
        onClose={handleCloseReceipt}
        billingData={billingData}
        userData={userData}
      />

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
        onConfirm={closeCancelInfo}
      />
    </div>
  );
}
