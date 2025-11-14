import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { X } from 'lucide-react';

interface PaymentTransaction {
  id: number;
  plan: string;
  period: string;
  amount: number;
  status: string;
  date: string;
  card: string;
}

export interface ReceiptModalProps {
  transaction: PaymentTransaction | null;
  onClose: () => void;
  billingData?: {
    payment_history?: Array<{
      timestamp: string;
      payment_reference_id: string;
      transaction_method: string;
    }>;
  } | undefined;
  userData?: {
    email?: string;
  } | undefined;
}

export function ReceiptModal({
  transaction,
  onClose,
  billingData,
  userData,
}: ReceiptModalProps) {
  if (!transaction) return null;

  // Find the actual payment record
  const paymentRecord = billingData?.payment_history?.[transaction.id - 1];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <Card className='mx-4 w-full max-w-md'>
        <CardHeader className='border-b pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <p className='text-sm text-muted-foreground'>
                {transaction.id} of {billingData?.payment_history?.length || 0}{' '}
                receipt
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-muted-foreground hover:text-foreground'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        </CardHeader>
        <CardContent className='space-y-6 py-6'>
          {/* Subscription info */}
          <div className='flex items-start gap-4 border-b pb-4'>
            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-purple-600' />
            <div className='min-w-0 flex-1'>
              <p className='text-sm text-muted-foreground'>Subscription type</p>
              <p className='truncate font-semibold'>{transaction.plan}</p>
            </div>
            <div className='flex-shrink-0 text-right'>
              <p className='text-sm text-muted-foreground'>Amount</p>
              <p className='font-semibold'>
                ₦{transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <div className='mb-4 border-b border-yellow-500 pb-2'>
              <h3 className='font-semibold'>Payment Details</h3>
            </div>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Cycle</span>
                <span className='font-medium'>{transaction.period}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Transaction Date</span>
                <span className='font-medium'>
                  {paymentRecord
                    ? new Date(paymentRecord.timestamp).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )
                    : transaction.date}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Reference</span>
                <span className='font-medium'>
                  {paymentRecord?.payment_reference_id || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span
                  className={`font-medium ${transaction.status === 'Successful' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  Transaction Method
                </span>
                <span className='font-medium'>
                  {paymentRecord?.transaction_method || 'Card payment'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Card number</span>
                <span className='font-medium'>**** {transaction.card}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>User Id</span>
                <span className='font-medium'>{userData?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
