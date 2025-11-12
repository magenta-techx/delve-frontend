'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useBusinessStates, useUpdateBusinessLocation, useUpdateBusinessContact } from '@/app/(business)/misc/api/business';

const contactSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
  address: z.string().min(5, 'Business location is required'),
  instagram_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  whatsapp_link: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();

  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      state: currentBusiness?.state || '',
      address: currentBusiness?.address || '',
      instagram_link: currentBusiness?.instagram_link || '',
      whatsapp_link: currentBusiness?.whatsapp_link || '',
    },
  });

  // Fetch states
  const { data: statesData } = useBusinessStates();
  
  // Mutations
  const { mutate: updateLocation, isPending: isUpdatingLocation } = useUpdateBusinessLocation();
  const { mutate: updateContact, isPending: isUpdatingContact } = useUpdateBusinessContact();

  useEffect(() => {
    if (currentBusiness) {
      setValue('state', currentBusiness.state || '');
      setValue('address', currentBusiness.address || '');
      setValue('instagram_link', currentBusiness.instagram_link || '');
      setValue('whatsapp_link', currentBusiness.whatsapp_link || '');
    }
  }, [currentBusiness, setValue]);

  const onSubmit = (data: ContactFormData) => {
    if (!currentBusiness?.id) return;

    // Update location
    updateLocation(
      {
        business_id: currentBusiness.id,
        state: data.state,
        address: data.address,
      },
      {
        onSuccess: () => {
          toast.success('Location updated successfully');
          refetchBusinesses();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update location');
        },
      }
    );

    // Update social links if provided
    if (data.instagram_link || data.whatsapp_link) {
      const contactData: {
        business_id: number;
        email: string;
        phone_number: string;
        instagram_link?: string;
        whatsapp_link?: string;
      } = {
        business_id: currentBusiness.id,
        email: currentBusiness.email || '',
        phone_number: currentBusiness.phone_number || '',
      };
      if (data.instagram_link) contactData.instagram_link = data.instagram_link;
      if (data.whatsapp_link) contactData.whatsapp_link = data.whatsapp_link;
      
      updateContact(
        contactData,
        {
          onSuccess: () => {
            toast.success('Social links updated successfully');
            refetchBusinesses();
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to update social links');
          },
        }
      );
    }
  };

  if (!currentBusiness) {
    return <div className="py-12 text-center text-muted-foreground">No business selected</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select a state</option>
              {statesData?.map(state => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.state && (
          <p className="text-sm text-red-500">{errors.state.message}</p>
        )}
      </div>

      {/* Business Location */}
      <div className="space-y-2">
        <Label htmlFor="address">Business Location?</Label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              📍
            </span>
            <Input
              id="address"
              {...register('address')}
              placeholder="12, Adenuga Tiwo Str, Ikeja"
              className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
            />
          </div>
        </div>
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Socials Section */}
      <div className="space-y-4 pt-6">
        <Label className="text-lg font-semibold">Socials</Label>

        {/* Instagram Link */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📷</span>
            <Label htmlFor="instagram_link">Instagram Link</Label>
          </div>
          <div className="flex gap-2">
            <Input
              id="instagram_link"
              {...register('instagram_link')}
              placeholder="https://www.instagram.com/retyihgv=ggb45B6tcrf5"
              className={errors.instagram_link ? 'border-red-500' : ''}
            />
            <Button type="button" variant="outline">
              Edit
            </Button>
          </div>
          {errors.instagram_link && (
            <p className="text-sm text-red-500">{errors.instagram_link.message}</p>
          )}
        </div>

        {/* WhatsApp Link */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <Label htmlFor="whatsapp_link">Whatsapp Link</Label>
          </div>
          <div className="flex gap-2">
            <Input
              id="whatsapp_link"
              {...register('whatsapp_link')}
              placeholder="Wa.me/2349012345678"
              className={errors.whatsapp_link ? 'border-red-500' : ''}
            />
            <Button type="button" variant="outline">
              Add
            </Button>
            <Button type="button" variant="outline">
              Edit
            </Button>
          </div>
          {errors.whatsapp_link && (
            <p className="text-sm text-red-500">{errors.whatsapp_link.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          disabled={isUpdatingLocation || isUpdatingContact}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {(isUpdatingLocation || isUpdatingContact) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
