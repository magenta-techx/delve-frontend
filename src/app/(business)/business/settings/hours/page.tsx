'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useUpdateBusinessHours } from '@/app/(business)/misc/api/business';
import {
  businessHoursZodSchema,
  BusinessHoursInput,
} from '@/schemas/businessZodSchema';
import { LogoLoadingIcon } from '@/assets/icons';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export default function BusinessHoursPage() {
  const { currentBusiness } = useBusinessContext();
  const businessId = currentBusiness?.id;
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert 24-hour format to 12-hour format
  const convertTo12Hour = (timeStr: string | null | undefined) => {
    if (!timeStr) return { hour: '9', meridiem: 'AM' };

    const [hourStr] = timeStr.split(':');
    let hour = parseInt(hourStr!);
    const meridiem = hour >= 12 ? 'PM' : 'AM';

    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return { hour: String(hour), meridiem };
  };

  // Build default values from currentBusiness.business_hours if available
  const getDefaultValues = () => {
    if (!!currentBusiness?.business_hours) {
      const generated = currentBusiness?.business_hours.map(hour => {
        const openTime = convertTo12Hour(hour.open_time);
        const closeTime = convertTo12Hour(hour.close_time);
        return {
          day: hour.day,
          is_open: hour.is_open,
          open_hour: hour.is_open ? openTime.hour : null,
          open_meridiem: hour.is_open ? openTime.meridiem as 'AM' | 'PM' : 'AM',
          close_hour: hour.is_open ? closeTime.hour : null,
          close_meridiem: hour.is_open ? closeTime.meridiem as 'AM' | 'PM' : 'PM',
        };
      });
      console.log(generated, 'generated default values');

      return {
        hours: generated,
      };
    }

    return {
      hours: DAYS_OF_WEEK.map(day => ({
        day: day.value,
        is_open: day.value < 7,
        open_hour: '9' as const,
        open_meridiem: 'AM' as const,
        close_hour: '6' as const,
        close_meridiem: 'PM' as const,
      })),
    };
  };

  // Initialize form with default hours
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<BusinessHoursInput>({
    resolver: zodResolver(businessHoursZodSchema),
    defaultValues: getDefaultValues(),
  });

  // Reset form when business hours data changes
  useEffect(() => {
    reset(getDefaultValues());
  }, [currentBusiness?.business_hours, reset]);

  const updateHoursMutation = useUpdateBusinessHours();
  const hoursWatch = watch('hours');

  const onSubmit = async (data: BusinessHoursInput) => {
    if (!businessId) {
      toast.error('Business ID not found');
      return;
    }

    setIsLoading(true);
    try {
      // Convert AM/PM format to 24-hour format for backend
      const payload = data.hours.map(hour => {
        if (!hour.is_open) {
          return {
            day: hour.day,
            is_open: false,
          };
        }

        const convertTo24Hour = (
          hourStr: string | null | undefined,
          meridiem: string | undefined
        ) => {
          if (!hourStr || !meridiem) return null;
          let hour = parseInt(hourStr);
          if (meridiem === 'PM' && hour !== 12) hour += 12;
          if (meridiem === 'AM' && hour === 12) hour = 0;
          return `${String(hour).padStart(2, '0')}:00`;
        };

        return {
          day: hour.day,
          is_open: true,
          open_time: convertTo24Hour(hour.open_hour, hour.open_meridiem),
          close_time: convertTo24Hour(hour.close_hour, hour.close_meridiem),
        };
      });

      await updateHoursMutation.mutateAsync({
        business_id: businessId,
        hours: payload as any,
      });

      toast.success('Business hours updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update business hours'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!businessId) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  return (
    <div className='relative h-full w-full space-y-3 overflow-hidden overflow-y-scroll md:space-y-6 lg:space-y-10'>
      <div className='container grid gap-6 px-4 pb-6 lg:px-6'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6 rounded-2xl border border-[#E8EAF6] bg-white p-6'
        >
          <div>
            <h1 className='font-inter text-xl font-semibold lg:text-3xl'>
              Business Hours
            </h1>
            <p className='text-balance text-xs font-normal text-[#4B5565] max-lg:max-w-[30ch] lg:text-sm'>
              Set your weekly operating hours. Customers will see these times on
              your business profile.
            </p>
          </div>

          <div className=''>
            <div className='space-y-0'>
              {DAYS_OF_WEEK.map((day, index) => (
                <div
                  key={day.value}
                  className='flex items-center justify-between gap-8 border-b border-[#F0F0F0] px-4 py-4 last:border-b-0 hover:bg-[#FAFAFA]'
                >
                  {/* Day Name */}
                  <div className='w-24'>
                    <p className='text-sm font-semibold text-[#212121]'>
                      {day.label}
                    </p>
                  </div>

                  {/* Time Inputs */}
                  <div className='flex flex-1 items-center justify-center gap-6'>
                    {hoursWatch[index]?.is_open ? (
                      <>
                        {/* From */}
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-medium text-[#999999]'>
                            From
                          </span>
                          <Controller
                            name={`hours.${index}.open_hour`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type='number'
                                value={field.value ?? ''}
                                min='1'
                                max='12'
                                placeholder='9'
                                haserror={!!errors.hours?.[index]?.open_hour}
                                errormessage={
                                  errors?.hours?.[index]?.open_hour?.message
                                }
                                className='w-12 rounded border border-[#E0E0E0] px-1 py-1.5 text-center text-sm font-semibold text-[#212121]'
                              />
                            )}
                          />
                          <Controller
                            name={`hours.${index}.open_meridiem`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className='h-9 rounded border border-[#E0E0E0] bg-white px-2 py-1.5 text-sm font-medium text-[#212121]'
                              >
                                <option value='AM'>AM</option>
                                <option value='PM'>PM</option>
                              </select>
                            )}
                          />
                        </div>

                        {/* To */}
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-medium text-[#999999]'>
                            To
                          </span>
                          <Controller
                            name={`hours.${index}.close_hour`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type='number'
                                min='1'
                                max='12'
                                placeholder='6'
                                value={field.value ?? ''}
                                haserror={!!errors.hours?.[index]?.close_hour}
                                errormessage={
                                  errors?.hours?.[index]?.close_hour?.message
                                }
                                className='w-12 rounded border border-[#E0E0E0] px-1 py-1.5 text-center text-sm font-semibold text-[#212121]'
                              />
                            )}
                          />
                          <Controller
                            name={`hours.${index}.close_meridiem`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className='h-9 rounded border border-[#E0E0E0] bg-white px-2 py-1.5 text-sm font-medium text-[#212121]'
                              >
                                <option value='AM'>AM</option>
                                <option value='PM'>PM</option>
                              </select>
                            )}
                          />
                        </div>
                      </>
                    ) : (
                      <span className='text-sm font-medium text-[#BDBDBD] py-2.5'>
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Toggle and Status */}
                  <div className='flex items-center gap-3'>
                    <Controller
                      name={`hours.${index}.is_open`}
                      control={control}
                      render={({ field }) => (
                        <button
                          type='button'
                          onClick={() => field.onChange(!field.value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            field.value ? 'bg-blue-500' : 'bg-[#D1D5DB]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              field.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                    />
                    <span className='w-12 text-right text-sm font-medium text-[#212121]'>
                      {hoursWatch[index]?.is_open ? 'Open' : 'Close'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-4 flex items-center justify-end gap-3 border-t border-[#E8EAF6] pt-6'>
              <Button
                type='submit'
                disabled={isLoading || updateHoursMutation.isPending}
                className='gap-2 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
              >
                {isLoading || updateHoursMutation.isPending ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Business Hours'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
