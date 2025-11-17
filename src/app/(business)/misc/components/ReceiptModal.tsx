import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { BillingData, PaymentHistory, UserDetail } from '@/types/api';
import { format } from 'date-fns';
import { X, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { useState } from 'react';


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

  // Download handler (simple print for now, can be replaced with PDF/deownload logic)
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md !m-0'>
      <Card className='mx-4 w-full max-w-md relative'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <button
                aria-label='Previous receipt'
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                className={`rounded border p-1 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                <ChevronUp className='h-4 w-4' />
              </button>
              <button
                aria-label='Next receipt'
                disabled={currentIndex === transactions.length - 1}
                onClick={() => setCurrentIndex(i => Math.min(transactions.length - 1, i + 1))}
                className={`rounded border p-1 ${currentIndex === transactions.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
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
                className='text-xs text-[#616161] hover:text-foreground rounded border p-1'
                aria-label='Close receipt modal'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6 py-6'>
          {/* Subscription info */}
          <div className='flex items-start gap-4 border p-4 rounded-lg'>
            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-purple-600 flex items-center justify-center'>
              {/* Icon placeholder, replace with actual icon if needed */}
              <span className='text-white font-bold text-lg'>
                {transaction.plan?.name?.[0] || 'P'}
              </span>
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-xs font-mediumtext-[#616161]'>Subscription type</p>
              <p className='truncate font-semibold'>{transaction.plan?.name}</p>
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
            <div className='relative mb-4 border-b border-[#E0E0E0] flex items-center gap-2'>
              <h3 className='relative font-semibold text-[#212121] pb-2'>
                Payment Details

              <div className='absolute h-1 rounded-full bg-yellow-500 left-0 w-full bottom-0'></div>
              </h3>
            </div>
            <div className='space-y-3 lg:space-y-4 text-sm'>
              <div className='flex justify-between'>
                <span className='text-xs text-[#616161]'>Cycle</span>
                <span className='font-medium text-[#222124] text-sm'>{transaction.plan?.billing_cycle}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-xs text-[#616161]'>Transaction Date</span>
                <span className='font-medium text-[#222124] text-sm'>
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
                <span className='font-medium text-[#222124] text-sm'>
                  {paymentRecord?.payment_reference_id || transaction.payment_reference_id || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-[#616161]'>Status</span>
                <span
                  className={`font-medium text-xs px-3 py-1.5 rounded-full capitalize ${ transaction.status === 'success'
                                ? 'bg-[#DAFBD5] text-[#558B2F]'
                                : 'bg-[#FFE1E1] text-[#C62828]'}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-xs text-[#616161]'>Transaction Method</span>
                <span className='font-medium text-[#222124] text-sm'>
                  {paymentRecord?.transaction_method || transaction.transaction_method || 'Card payment'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-xs text-[#616161]'>Card number</span>
                <span className='font-medium text-[#222124] text-sm'>**** {transaction.payment_card_last_4_digits}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-xs text-[#616161]'>User Id</span>
                <span className='font-medium text-[#222124] text-sm'>{userData?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
          {/* Transaction selector */}
          <div className='mt-6'>
            <label htmlFor='receipt-select' className='block text-xs text-[#616161] mb-1'>Jump to receipt</label>
            <select
              id='receipt-select'
              value={currentIndex}
              onChange={e => setCurrentIndex(Number(e.target.value))}
              className='w-full rounded-xl border px-2 py-3 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            >
              {transactions.map((t, idx) => (
                <option key={idx} value={idx} className=''>
                  {t.plan?.name} - ₦{t.amount_paid.toLocaleString()} ({t.plan?.billing_cycle})/{format(t.timestamp, 'dd-MM-yyyy')}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
