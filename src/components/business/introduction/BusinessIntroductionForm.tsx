'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Input } from '../../ui/Input';
import Image from 'next/image';
import ImageUploadIcon from '@/assets/icons/ImageUploadIcon';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessIntroductionZodSchema, type BusinessIntroductionInput } from '@/schemas/businessZodSchema';

type ExposedSubmit = { submit: () => Promise<void> };

type BusinessIntroductionFormValues = BusinessIntroductionInput & { logo?: File | null };

type Props = {
  onSuccess: (businessId: number) => void;
  setIsSubmitting?: (b: boolean) => void;
  onFormStateChange?: (state: { isValid: boolean; isDirty: boolean }) => void;
};

const BusinessIntroductionForm = forwardRef<ExposedSubmit, Props>(
  ({ onSuccess, setIsSubmitting, onFormStateChange }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const methods = useForm<BusinessIntroductionFormValues>({
      resolver: zodResolver(businessIntroductionZodSchema),
      mode: 'onChange',
      defaultValues: {
        business_name: '',
        description: '',
        website: '',
        logo: null,
      },
    });

    const { handleSubmit, control, setValue, formState } = methods;

    useEffect(() => {
      onFormStateChange?.({ isValid: formState.isValid, isDirty: formState.isDirty });
    }, [formState.isValid, formState.isDirty, onFormStateChange]);

    const onSubmit = async (values: BusinessIntroductionFormValues): Promise<void> => {
      try {
        setIsSubmitting?.(true);
        const formData = new FormData();
        formData.append('business_name', values.business_name);
        formData.append('description', values.description);
        if (values.website) formData.append('website', values.website);
        if (values.logo instanceof File) formData.append('logo', values.logo);

        const res = await fetch('/api/business/business-introduction', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          alert(`Error submitting business intro: ${data?.message ?? 'Unknown error'}`);
          return;
        }
        const newId = data?.data?.id;
        if (newId) onSuccess(newId);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitting?.(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: async (): Promise<void> => {
        await handleSubmit(onSubmit)();
      },
    }));

    const errors = methods.formState.errors;

    return (
      <div className='sm:w-[500px]'>
        <BusinessIntroductionFormHeader
          intro={'Business account setup'}
          header='Introduce us to your business'
          paragraph='This is the name, website, and description customers will see.'
        />
        <FormProvider {...methods}>
          <form className='mt-3 w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-1 sm:items-center'>
              <div className='my-4 flex w-full items-end justify-start gap-3 text-xs font-medium'>
                <input
                  ref={fileInputRef}
                  name='logo'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    const file = e.currentTarget.files?.[0] ?? null;
                    setValue('logo', file, { shouldDirty: true, shouldValidate: true });
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setPreview(previewUrl);
                    } else {
                      setPreview(null);
                    }
                  }}
                />
                {preview ? (
                  <Image
                    src={preview}
                    alt='Business preview'
                    className='mt-2 h-24 w-24 rounded object-cover'
                    height={100}
                    width={200}
                  />
                ) : (
                  <div
                    className='flex h-20 w-36 items-center justify-center rounded-md border border-dashed border-primary shadow-md hover:cursor-pointer sm:h-24 sm:w-24'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className='flex flex-col items-center gap-1'>
                      <ImageUploadIcon />
                      <p className='text-primary'>Upload logo</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className='mb-3 w-full text-gray-600 sm:w-[235px]'>
                    .png, .jpeg up to 8MB. Recommended size is 256 x 256
                  </p>
                  {preview && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      type='button'
                      className='rounded-sm border border-primary-50 bg-neutral px-2 py-1 text-primary'
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              <Controller
                name='business_name'
                control={control}
                render={({ field }): JSX.Element => (
                  <Input
                    {...field}
                    type='text'
                    label='Business name'
                    className='w-full'
                    hasError={!!errors.business_name}
                    errorMessage={errors.business_name?.message}
                  />
                )}
              />

              <Controller
                name='description'
                control={control}
                render={({ field }): JSX.Element => (
                  <div className='w-full'>
                    <label className='text-sm text-[#0F172B] font-medium' htmlFor='description'>
                      About business
                    </label>
                    <textarea
                      id='description'
                      className='w-full rounded-md border border-[#D9D9D9] p-3 text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
                      maxLength={250}
                      rows={4}
                      {...field}
                    />
                    {errors.description?.message && (
                      <p className='text-sm text-destructive'>{errors.description.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name='website'
                control={control}
                render={({ field }): JSX.Element => (
                  <Input
                    {...field}
                    type='text'
                    label='Website'
                    placeholder='https://www.your_domain.com'
                    className='w-full'
                    optional
                    hasError={!!errors.website}
                    errorMessage={errors.website?.message}
                  />
                )}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    );
  }
);

BusinessIntroductionForm.displayName = 'BusinessIntroductionForm';

export default BusinessIntroductionForm;
