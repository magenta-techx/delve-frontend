'use client';
import React, { ChangeEvent, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Input } from '../../ui/Input';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationZodSchema, type LocationInput } from '@/schemas/businessZodSchema';

const BusinessLocationForm = (): JSX.Element => {
  const [useLiveLocation, setUseLiveLocation] = useState<boolean>(false);
  const [noPhysicalAddress, setNoPhysicalAddress] = useState<boolean>(false);
  const [liveLocationError, setLiveLocationError] = useState<boolean>(false);

  const methods = useForm<LocationInput>(
    {
      resolver: zodResolver(locationZodSchema),
      mode: 'onChange',
      defaultValues: { state: '', location: '' },
    }
  );

  const { control, formState } = methods;
  const errors = formState.errors as Partial<Record<'state' | 'location', { message?: string }>>;

  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Set your location address '
        paragraph='Add your business location to help clients find you easily '
      />
      <FormProvider {...methods}>
        <form className='mt-3 w-full' onSubmit={e => e.preventDefault()}>
          <div className='flex flex-col gap-1 sm:items-center'>
            {/* State select */}
            <div className='flex w-full flex-col gap-1'>
              <label htmlFor='state' className='text-sm font-medium'>Select state</label>
              <div className='relative flex items-center'>
                <Controller
                  name='state'
                  control={control}
                  render={({ field }) => (
                    <select
                      id='state'
                      {...field}
                      className={`w-full appearance-none rounded-md border p-2 font-inter text-[16px] focus:outline-none ${errors.state ? 'border-red-500' : 'border-gray-300'} sm:p-3 sm:text-[13px]`}
                    >
                      <option value=''>Select state</option>
                      <option value='Abia'>Abia</option>
                      <option value='Lagos'>Lagos</option>
                    </select>
                  )}
                />
                <span className='pointer-events-none absolute right-3 text-gray-400'>
                  <BusinessCategoryIcons value='arrow-down' />
                </span>
              </div>
              <div className='-mt-2 min-h-[20px] p-0'>
                {errors.state?.message && (
                  <span className='text-xs text-red-500'>{errors.state.message}</span>
                )}
              </div>
            </div>

            {/* Location input */}
            <div className='mb-3 flex w-full flex-col items-start justify-start gap-1 sm:items-center sm:justify-end'>
              <div className='relative w-full'>
                <Controller
                  name='location'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='text'
                      label='Where is your business located?'
                      className='w-full'
                      leftIcon={<BusinessCategoryIcons value='marker' />}
                    />
                  )}
                />
                <div className='absolute right-0 top-1 flex items-center gap-1'>
                  <input
                    type='checkbox'
                    checked={useLiveLocation}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (noPhysicalAddress) {
                        return setLiveLocationError(true);
                      }
                      setLiveLocationError(false);
                      setUseLiveLocation(e.target.checked);
                    }}
                  />
                  <span className='-mt-[2px] text-xs text-primary sm:-mt-0'>
                    Use live locaton
                  </span>
                </div>
              </div>
              {liveLocationError && (
                <span className='text-xs text-red-400'>
                  Unselect &quot;I operate without a physical location (mobile or onine service only) &quot;
                </span>
              )}
            </div>
          </div>
          <div className='flex items-start gap-1 sm:-mt-4 sm:items-center'>
            <input
              type='checkbox'
              checked={noPhysicalAddress}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUseLiveLocation(false);
                setNoPhysicalAddress(e.target.checked);
              }}
            />
            <span className='-mt-[2px] text-xs sm:-mt-0'>
              I operate without a physical location (mobile or onine service only)
            </span>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BusinessLocationForm;
