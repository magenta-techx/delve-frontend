'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { authAwareFetch } from '@/utils/authAwareFetch';
import { toast } from 'sonner';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const deactivateSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  reason_for_deactivation: z.string().min(10, 'Please provide a reason (minimum 10 characters)'),
});

type DeactivateFormData = z.infer<typeof deactivateSchema>;

interface DeactivateBusinessModalProps {
  businessId: number;
  businessName: string;
  onClose: () => void;
}

export function DeactivateBusinessModal({ businessId, businessName, onClose }: DeactivateBusinessModalProps) {
  const [step, setStep] = useState<'confirm' | 'form'>('confirm');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<DeactivateFormData>({
    resolver: zodResolver(deactivateSchema),
    defaultValues: {
      business_name: '',
      reason_for_deactivation: '',
    },
  });

  const businessNameInput = watch('business_name');
  const reasonInput = watch('reason_for_deactivation');

  const deactivateMutation = useMutation({
    mutationFn: async (data: DeactivateFormData) => {
      const response = await authAwareFetch(
        `/api/business/${businessId}/activation/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activation_status: 'deactivate',
            business_name: data.business_name,
            reason_for_deactivation: data.reason_for_deactivation,
          }),
        }
      );
      return response;
    },
    onSuccess: () => {
      toast.success('Business deactivated successfully');
      onClose();
      // Redirect to dashboard or business list
      router.push('/business');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate business');
    },
  });

  const onSubmit = (data: DeactivateFormData) => {
    if (data.business_name.toLowerCase() !== businessName.toLowerCase()) {
      toast.error('Business name does not match');
      return;
    }
    deactivateMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'confirm' ? (
          /* Step 1: Confirmation */
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Are you sure you want to deactivate this business?
                </h2>
                <p className="text-sm text-gray-600">
                  Once deactivated, your business will no longer be visible on Delve. You can reactivate it
                  anytime from your dashboard
                </p>
              </div>
            </div>

            <Button
              onClick={() => setStep('form')}
              className="w-full bg-red-600 hover:bg-red-700 text-white mt-6"
            >
              Yes, Proceed
            </Button>
          </div>
        ) : (
          /* Step 2: Form */
          <div className="p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Confirm Deactivation</h2>
                <p className="text-sm text-gray-600 mt-1">
                  To confirm, please type your business name and share a reason for deactivating.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="business_name">Business name</Label>
                <Input
                  id="business_name"
                  {...register('business_name')}
                  placeholder="Roza spa"
                  className={errors.business_name ? 'border-red-500' : ''}
                />
                {errors.business_name && (
                  <p className="text-sm text-red-500">{errors.business_name.message}</p>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason_for_deactivation">Reason for deactivation</Label>
                <Textarea
                  id="reason_for_deactivation"
                  {...register('reason_for_deactivation')}
                  placeholder="i would love to cancel my business subscription"
                  rows={4}
                  className={errors.reason_for_deactivation ? 'border-red-500' : ''}
                />
                {errors.reason_for_deactivation && (
                  <p className="text-sm text-red-500">{errors.reason_for_deactivation.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  !businessNameInput ||
                  !reasonInput ||
                  businessNameInput.toLowerCase() !== businessName.toLowerCase() ||
                  deactivateMutation.isPending
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {deactivateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deactivating...
                  </>
                ) : (
                  'Deactivate Business'
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
