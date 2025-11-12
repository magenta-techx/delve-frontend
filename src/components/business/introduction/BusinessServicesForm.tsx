'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Input } from '../../ui/Input';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useForm, useFieldArray, Controller, FormProvider, useFormContext, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { servicesZodSchema } from '@/schemas/businessZodSchema';
import type { z } from 'zod';

export type ServicesFormValues = z.infer<typeof servicesZodSchema>;

type ExposedSubmit = { submit: () => Promise<void> };

type Props = {
  onSubmit: (values: ServicesFormValues) => void;
  setIsSubmitting?: (b: boolean) => void;
  onFormStateChange?: (state: { isValid: boolean; isDirty: boolean }) => void;
};

const ServiceItem = ({ index }: { index: number }): JSX.Element => {
  const { control, setValue, watch } = useFormContext<ServicesFormValues>() as UseFormReturn<ServicesFormValues>;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const current = watch(`services.${index}`);
  const imageUrl = useMemo(() => (current?.image_field ? URL.createObjectURL(current.image_field) : null), [current?.image_field]);

  useEffect(() => {
    return (): void => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className='flex flex-col gap-3 border-b-2 border-b-gray-100 pb-3'>
      <Controller
        name={`services.${index}.title` as const}
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            type='text'
            label='Title of Service (Optional)'
            className='w-full'
            hasError={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name={`services.${index}.description` as const}
        control={control}
        render={({ field, fieldState }) => (
          <div className='w-full'>
            <label className='text-sm text-[#0F172B] font-medium' htmlFor={`services-${index}-description`}>
              Description (Optional)
            </label>
            <textarea
              id={`services-${index}-description`}
              className='w-full rounded-md border border-[#D9D9D9] p-3 text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
              maxLength={250}
              rows={4}
              {...field}
            />
            {fieldState.error?.message && (
              <p className='text-sm text-destructive'>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {imageUrl ? (
        <div className='relative mt-2 flex h-[200px] w-full items-center justify-center'>
          <Image
            src={imageUrl}
            alt='Service Preview'
            width={100}
            height={100}
            className='h-[200px] w-full rounded-md object-cover'
            unoptimized
          />

          <input
            ref={fileInputRef}
            type='file'
            multiple={false}
            accept='image/png, image/jpeg, image/jpg'
            className='hidden'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files ? e.target.files[0] : null;
              setValue(`services.${index}.image_field`, file, { shouldDirty: true, shouldValidate: true });
            }}
          />

          <button
            className='absolute w-[100px] rounded-full bg-white p-2 text-sm font-medium shadow-md'
            onClick={() => fileInputRef.current?.click()}
            type='button'
          >
            Change
          </button>
        </div>
      ) : (
        <FileUpload
          label='Service Image'
          mutipleUploads={false}
          onFileSelect={files => setValue(`services.${index}.image_field`, files?.[0] ?? null, { shouldDirty: true, shouldValidate: true })}
        />
      )}
    </div>
  );
};

// no-op helper removed; using useFormContext directly in ServiceItem

const BusinessServicesForm = forwardRef<ExposedSubmit, Props>(
  ({ onSubmit, setIsSubmitting, onFormStateChange }, ref) => {
    const methods = useForm<ServicesFormValues>({
      resolver: zodResolver(servicesZodSchema),
      mode: 'onChange',
      defaultValues: { services: [{ title: '', description: '', image_field: null }] },
    });

    const { control, handleSubmit, formState } = methods;
    const { fields, append, remove } = useFieldArray({ control, name: 'services' });

    useEffect(() => {
      onFormStateChange?.({ isValid: formState.isValid, isDirty: formState.isDirty });
    }, [formState.isValid, formState.isDirty, onFormStateChange]);

    const internalSubmit = async (values: ServicesFormValues): Promise<void> => {
      try {
        setIsSubmitting?.(true);
        onSubmit(values);
      } finally {
        setIsSubmitting?.(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: async (): Promise<void> => {
        await handleSubmit(internalSubmit)();
      },
    }));

    return (
      <div className='sm:w-[500px]'>
        <BusinessIntroductionFormHeader
          intro='Business account setup'
          header='Add Business Services'
          paragraph='Showcase your services to attract the right clients and boost bookings'
        />
        <FormProvider {...methods}>
          <form className='mt-3 w-full' onSubmit={handleSubmit(internalSubmit)}>
            <div className='flex flex-col gap-4'>
              {fields.map((f, index) => (
                <div key={f.id}>
                  <ServiceItem index={index} />
                  {fields.length > 1 && (
                    <Button type='button' variant='destructive' onClick={() => remove(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <div className='w-[70px]'>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='border border-gray-200 bg-transparent text-primary hover:bg-transparent'
                  onClick={() => append({ title: '', description: '', image_field: null })}
                >
                  + Add
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  }
);

BusinessServicesForm.displayName = 'BusinessServicesForm';

export default BusinessServicesForm;
