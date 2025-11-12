'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useUpdateBusiness } from '@/app/(business)/misc/api';

const generalSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logo: z.any().optional(),
});

type GeneralFormData = z.infer<typeof generalSchema>;

export default function GeneralPage() {
  const { currentBusiness, refetchBusinesses } = useBusinessContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      business_name: currentBusiness?.name || '',
      description: currentBusiness?.description || '',
      website: currentBusiness?.website || '',
    },
  });

  useEffect(() => {
    if (currentBusiness) {
      setValue('business_name', currentBusiness.name);
      setValue('description', currentBusiness.description || '');
      setValue('website', currentBusiness.website || '');
      if (currentBusiness.logo) {
        setLogoPreview(currentBusiness.logo);
      }
    }
  }, [currentBusiness, setValue]);

  const { mutate: updateBusiness, isPending } = useUpdateBusiness();

  const onSubmit = (data: GeneralFormData) => {
    if (!currentBusiness?.id) return;
    
    const updateData: {
      business_id: number;
      business_name: string;
      description: string;
      website?: string;
      logo?: File;
    } = {
      business_id: currentBusiness.id,
      business_name: data.business_name,
      description: data.description,
    };
    if (data.website) updateData.website = data.website;
    if (data.logo?.[0]) updateData.logo = data.logo[0];
    
    updateBusiness(
      updateData,
      {
        onSuccess: () => {
          toast.success('Business updated successfully');
          refetchBusinesses();
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update business');
        },
      }
    );
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No business selected</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Business Logo */}
      <div className="space-y-2">
        <Label htmlFor="logo">Business Logo</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {logoPreview ? (
              <Image src={logoPreview} alt="Business logo" fill className="object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {currentBusiness.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              .png, .jpeg files up to 8MB. Recommended size is 256 x 256px
            </p>
            <Input
              id="logo"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              {...register('logo')}
              onChange={(e) => {
                register('logo').onChange(e);
                handleLogoChange(e);
              }}
              className="max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="business_name">Business Name</Label>
        <Input
          id="business_name"
          {...register('business_name')}
          placeholder="Enter business name"
          className={errors.business_name ? 'border-red-500' : ''}
        />
        {errors.business_name && (
          <p className="text-sm text-red-500">{errors.business_name.message}</p>
        )}
      </div>

      {/* About Business */}
      <div className="space-y-2">
        <Label htmlFor="description">About Business</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your business"
          rows={6}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">
          Website <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="website"
          {...register('website')}
          placeholder="www.delve.com"
          className={errors.website ? 'border-red-500' : ''}
        />
        {errors.website && (
          <p className="text-sm text-red-500">{errors.website.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isPending ? (
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
