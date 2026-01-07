'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { contactFormSchema, ContactFormInput } from '@/schemas/contactSchema';
import { useSendContactMessage } from '@/app/(clients)/misc/api/contact';
import { useBusinessContext } from '@/contexts/BusinessContext';

export default function ContactUsForm() {
  const { currentBusiness } = useBusinessContext();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      full_name: '',
      business_name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    setValue('business_name', currentBusiness?.name || '');
  }, [currentBusiness]);

  const { mutateAsync: sendMessage, isPending } = useSendContactMessage();

  const onSubmit = async (data: ContactFormInput) => {
    try {
      const response = await sendMessage(data);

      if (response.status) {
        toast.success('Message sent!', {
          description: response.message,
        });
        reset();
      }
    } catch (error) {
      toast.error('Failed to send message', {
        description:
          error instanceof Error ? error.message : 'Please try again later',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mx-auto max-w-5xl space-y-6 pt-12 sm:pt-16 xl:pt-24'
    >
      <h2 className='text-center text-xl font-semibold text-gray-900'>
        Contact Us via Email
      </h2>

      <div className='grid gap-6 md:grid-cols-2 md:grid-rows-3'>
        <section className='row-span-3 space-y-4'>
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-[#0A0A0A]'>
              Full name
            </label>
            <Input
              {...register('full_name')}
              placeholder='Enter your full name'
              haserror={!!errors.full_name}
              className='h-14 border border-[#E3E8EF] bg-[#F8FAFC]'
            />
            {errors.full_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-[#0A0A0A]'>
              Business name
            </label>
            <Input
              {...register('business_name')}
              placeholder='Enter your business name (optional)'
              haserror={!!errors.business_name}
              className='h-14 border border-[#E3E8EF] bg-[#F8FAFC]'
            />
            {errors.business_name && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.business_name.message}
              </p>
            )}
          </div>
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium text-[#0A0A0A]'>
              Email
            </label>
            <Input
              {...register('email')}
              type='email'
              placeholder='Enter your email address'
              haserror={!!errors.email}
              className='h-14 border border-[#E3E8EF] bg-[#F8FAFC]'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
        </section>

        <section className='flex grid-rows-[subgrid] flex-col items-center md:col-span-1 md:row-span-3 md:grid'>
          <div className='row-span-2 w-full'>
            <Textarea
              label='Leave a message'
              labelClassName='text-sm font-medium text-[#0A0A0A]'
              {...register('message')}
              placeholder='Type your message here...'
              haserror={!!errors.message}
              errormessage={errors.message?.message}
              showCharCount
              value={watch('message')}
              maxCharCount={250}
              className='min-h-32 resize-none border border-[#E3E8EF] bg-[#F8FAFC]'
            />
          </div>
          <div className='flex w-full flex-col items-end justify-end md:h-full md:justify-between'>
            <Button
              type='submit'
              disabled={isSubmitting || isPending}
              className=''
              size='dynamic_lg'
            >
              {isSubmitting || isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                'Submit Message'
              )}
            </Button>
          </div>
        </section>
      </div>

      {/* Submit Button */}
    </form>
  );
}
