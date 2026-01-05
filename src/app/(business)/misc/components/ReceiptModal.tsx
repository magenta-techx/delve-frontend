import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { BillingData, PaymentHistory, UserDetail } from '@/types/api';
import { format } from 'date-fns';
import { X, ChevronUp, ChevronDown, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/assets/icons';

export interface ReceiptModalProps {
  transactions: PaymentHistory[];
  initialIndex?: number;
  onClose: () => void;
  billingData?: BillingData | undefined;
  userData?: UserDetail | undefined;
}

export function ReceiptModal({
  transactions,
  initialIndex = 0,
  onClose,
  billingData,
  userData,
}: ReceiptModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const transaction = transactions[currentIndex];
  if (!transaction) return null;

  const paymentRecord = billingData?.payment_history?.[currentIndex];

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className='fixed inset-0 z-50 !m-0 flex items-center justify-center bg-black/50 backdrop-blur-md'>
      <Card className='relative mx-4 w-full max-w-md'>
        <CardHeader className='pb-3 print:pb-0'>
          <div className='flex items-center justify-between print:hidden'>
            <div className='flex items-center gap-2'>
              <button
                aria-label='Previous receipt'
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                className={`rounded border p-1 ${currentIndex === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
              >
                <ChevronUp className='h-4 w-4' />
              </button>
              <button
                aria-label='Next receipt'
                disabled={currentIndex === transactions.length - 1}
                onClick={() =>
                  setCurrentIndex(i => Math.min(transactions.length - 1, i + 1))
                }
                className={`rounded border p-1 ${currentIndex === transactions.length - 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
              >
                <ChevronDown className='h-4 w-4' />
              </button>
              <span className='ml-2 text-xs text-[#616161]'>
                {currentIndex + 1} of {transactions.length} receipt
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                aria-label='Download receipt'
                onClick={handleDownload}
                className='rounded border p-1 hover:bg-gray-100'
              >
                <Download className='h-4 w-4' />
              </button>
              <button
                onClick={onClose}
                className='rounded border p-1 text-xs text-[#616161] hover:text-foreground'
                aria-label='Close receipt modal'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6 py-6'>
          {/* Screen View - Original UI */}
          <div className='space-y-6 print:hidden'>
            {/* Subscription info */}
            <div className='flex items-start gap-4 rounded-lg border p-4'>
              <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600'>
                <span className='text-lg font-bold text-white'>
                  {transaction.plan?.name?.[0] || 'P'}
                </span>
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xs font-medium text-[#616161]'>
                  Subscription type
                </p>
                <p className='truncate font-semibold'>
                  {transaction.plan?.name}
                </p>
              </div>
              <div className='flex-shrink-0 text-right'>
                <p className='text-xs font-medium text-[#616161]'>Amount</p>
                <p className='font-semibold text-[#212121]'>
                  ₦{transaction.amount_paid.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <div className='relative mb-4 flex items-center gap-2 border-b border-[#E0E0E0]'>
                <h3 className='relative pb-2 font-semibold text-[#212121]'>
                  Payment Details
                  <div className='absolute bottom-0 left-0 h-1 w-full rounded-full bg-yellow-500'></div>
                </h3>
              </div>
              <div className='space-y-3 text-sm lg:space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-xs text-[#616161]'>Cycle</span>
                  <span className='text-sm font-medium text-[#222124]'>
                    {transaction.plan?.billing_cycle}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-[#616161]'>
                    Transaction Date
                  </span>
                  <span className='text-sm font-medium text-[#222124]'>
                    {paymentRecord
                      ? new Date(paymentRecord.timestamp).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )
                      : new Date(transaction.timestamp).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-[#616161]'>Reference</span>
                  <span className='text-sm font-medium text-[#222124]'>
                    {paymentRecord?.payment_reference_id ||
                      transaction.payment_reference_id ||
                      'N/A'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-[#616161]'>Status</span>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                      transaction.status === 'success'
                        ? 'bg-[#DAFBD5] text-[#558B2F]'
                        : 'bg-[#FFE1E1] text-[#C62828]'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-[#616161]'>
                    Transaction Method
                  </span>
                  <span className='text-sm font-medium text-[#222124]'>
                    {paymentRecord?.transaction_method ||
                      transaction.transaction_method ||
                      'Card payment'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-[#616161]'>Card number</span>
                  <span className='text-sm font-medium text-[#222124]'>
                    **** {transaction.payment_card_last_4_digits}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-[#616161]'>User Id</span>
                  <span className='text-sm font-medium text-[#222124]'>
                    {userData?.email || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction selector */}
            <div className='mt-6'>
              <label
                htmlFor='receipt-select'
                className='mb-1 block text-xs text-[#616161]'
              >
                Jump to receipt
              </label>
              <select
                id='receipt-select'
                value={currentIndex}
                onChange={e => setCurrentIndex(Number(e.target.value))}
                className='w-full cursor-pointer rounded-xl border px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              >
                {transactions.map((t, idx) => (
                  <option key={idx} value={idx} className=''>
                    {t.plan?.name} - ₦{t.amount_paid.toLocaleString()} (
                    {t.plan?.billing_cycle})/{format(t.timestamp, 'dd-MM-yyyy')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Print View - Receipt Style */}
          <div className='relative hidden space-y-6 print:block'>
            {/* Watermark Background */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden opacity-5 print:opacity-5'>
              <div className='absolute inset-0 flex flex-wrap items-start justify-start gap-8 p-4'>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className='h-20 w-20 flex-shrink-0'>
                    <Logo textColor='black' />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className='relative z-10'>
              <div className='flex items-start justify-between border-b border-[#E0E0E0] pb-6 text-center'>
                <Logo textColor='black' />
                <div>
                  <p className='text-xs text-[#616161]'>Payment Receipt</p>
                  <p className='mt-1 text-xs text-[#999999]'>
                    {paymentRecord
                      ? new Date(paymentRecord.timestamp).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )
                      : new Date(transaction.timestamp).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-transparent p-4'>
                <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800'>
                  <Check className='h-6 w-6 text-white' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-medium text-[#616161]'>
                    Subscription Type
                  </p>
                  <p className='truncate text-lg font-semibold'>
                    {transaction.plan?.name}
                  </p>
                  <p className='mt-0.5 text-xs text-[#999999]'>
                    {transaction.plan?.billing_cycle} Plan
                  </p>
                </div>
                <div className='flex-shrink-0 text-right'>
                  <p className='text-xs font-medium text-[#616161]'>
                    Amount Paid
                  </p>
                  <p className='text-lg font-bold text-green-600'>
                    ₦{transaction.amount_paid.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <div className='relative mb-4 flex items-center gap-2 border-b-2 border-purple-300 pb-3'>
                  <h3 className='font-bold text-[#212121]'>Payment Details</h3>
                  <div className='ml-auto h-1 w-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-400'></div>
                </div>
                <div className='space-y-3 rounded-lg bg-[#F9F8FF] p-4 text-sm'>
                  <div className='flex items-center justify-between border-b border-purple-100 py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Cycle
                    </span>
                    <span className='text-sm font-semibold text-[#222124]'>
                      {transaction.plan?.billing_cycle}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-purple-100 py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Transaction Date
                    </span>
                    <span className='text-sm font-semibold text-[#222124]'>
                      {paymentRecord
                        ? new Date(paymentRecord.timestamp).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : new Date(transaction.timestamp).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-purple-100 py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Reference ID
                    </span>
                    <span className='font-mono text-xs font-semibold text-[#222124]'>
                      {paymentRecord?.payment_reference_id ||
                        transaction.payment_reference_id ||
                        'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-purple-100 py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Status
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        transaction.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.status === 'success' ? '✓ ' : ''}
                      {transaction.status}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-purple-100 py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Payment Method
                    </span>
                    <span className='text-sm font-semibold text-[#222124]'>
                      {paymentRecord?.transaction_method ||
                        transaction.transaction_method ||
                        'Card'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-purple-100 py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Card
                    </span>
                    <span className='text-sm font-semibold text-[#222124]'>
                      •••• {transaction.payment_card_last_4_digits}
                    </span>
                  </div>
                  <div className='flex items-center justify-between py-2'>
                    <span className='text-xs font-medium text-[#616161]'>
                      Customer
                    </span>
                    <span className='text-sm font-semibold text-[#222124]'>
                      {userData?.email || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className='border-t-2 border-dashed border-purple-200 pt-6 text-center'>
                <p className='mb-2 text-xs text-[#999999]'>
                  Thank you for your payment
                </p>
                <p className='text-xs text-[#999999]'>
                  For questions, contact support@delve.com
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
