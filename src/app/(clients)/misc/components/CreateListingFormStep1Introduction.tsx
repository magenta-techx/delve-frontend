'use client';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { GalleryIcon } from '../icons';
import { authAwareFetch } from '@/utils/authAwareFetch';

const businessIntroSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  logo: z.any().optional(),
});

type BusinessIntroductionFormData = z.infer<typeof businessIntroSchema>;

interface BusinessIntroductionFormProps {
  onSuccess: (businessId: number) => void;
}

export interface BusinessIntroductionFormHandle {
  submit: () => Promise<void>;
}

const BusinessCreateListingFormStep1Introduction = forwardRef<
  BusinessIntroductionFormHandle,
  BusinessIntroductionFormProps
>(({ onSuccess }, ref) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<BusinessIntroductionFormData>({
    resolver: zodResolver(businessIntroSchema),
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitForm = async () => {
    const values = getValues();
    
    // Trigger validation
    const isValid = await new Promise<boolean>((resolve) => {
      handleSubmit(
        () => resolve(true),
        () => resolve(false)
      )();
    });

    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('business_name', values.business_name);
      formData.append('description', values.description);
      
      if (values.website) {
        formData.append('website', values.website);
      }
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await authAwareFetch('/api/business/create/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create business');
      }

      console.log('✅ Business created successfully:', data);
      onSuccess(data.data.business_id);
    } catch (error) {
      console.error('Error creating business:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create business';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: submitForm,
  }));

  return (
    <section className="space-y-6 max-w-xl mx-auto">
    

      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        {/* Logo Upload */}
        <div className="flex">
          <div className="relative">
            {logoPreview ? (
              // After upload - show image with change button
              <div className="relative">
                <div className="h-24 w-24 rounded-lg overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="mt-2 flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                >
                  <GalleryIcon className="h-3 w-3" />
                  Change
                </button>
                <p className="mt-1 text-center text-xs text-gray-500">
                  .png, .jpeg files up to 8MB. Recommended size<br />
                  is 256 × 256px
                </p>
              </div>
            ) : (
              // Before upload - show upload area
              <div className="flex items-end gap-2">
                <div className="flex h-24 w-28 items-center justify-center rounded-lg border-2 border-dashed border-purple-300 bg-white hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-purple-600">
                    <GalleryIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs font-inter">Upload logo</span>
                  </div>
                </div>
                <p className="mt-2 text-left text-balance text-xs text-gray-500">
                  .png, .jpeg files up to 8MB. Recommended size<br />
                  is 256 × 256px
                </p>
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
            Business name
          </label>
          <Input
            id="business_name"
            {...register('business_name')}
            placeholder="Enter your business name"
            className="mt-1"
            hasError={!!errors.business_name}
          />
          {errors.business_name && (
            <p className="mt-1 text-sm text-red-600">{errors.business_name.message}</p>
          )}
        </div>

        {/* About Business */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            About Business
          </label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Write a description"
            rows={4}
            className="mt-1"
            hasError={!!errors.description}
          />
          <div className="mt-1 flex justify-between">
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500">0/250 words</p>
          </div>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website (Optional)
          </label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            placeholder="www.yoursite.com"
            className="mt-1"
            hasError={!!errors.website}
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
          )}
        </div>
      </form>
    </section>
  );
});

BusinessCreateListingFormStep1Introduction.displayName = 'BusinessCreateListingFormStep1Introduction';

export default BusinessCreateListingFormStep1Introduction;