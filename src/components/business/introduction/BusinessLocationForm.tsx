'use client';
import React, { ChangeEvent, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import Input from '@/components/ui/Input';
import { Form } from 'formik';
// import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';

const BusinessLocationForm = (): JSX.Element => {
  const [useLiveLocation, setUseLiveLocation] = useState<boolean>(false);
  const [noPhysicalAddress, setNoPhysicalAddress] = useState<boolean>(false);
  const [liveLocationError, setLiveLocationError] = useState<boolean>(false);
  // const handleSubmit = async (values: {
  //   business_name: string;
  //   about_business: string;
  //   website: string;
  // }): Promise<void> => {
  //   alert(values.business_name);
  // };
  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Set your location address '
        paragraph='Add your business location to help clients find you easily '
      />

      <Form className='mt-3 w-full'>
        {/* Fields */}
        {/* state */}

        <div className='flex flex-col gap-1 sm:items-center'>
          {/* Select state  */}

          <Select
            className='w-full'
            label={'Select state'}
            name='state'
            placeholder='Select state'
            options={[
              {
                label: 'Abia',
                value: 'Abia',
              },
              {
                label: 'Lagos',
                value: 'Lagos',
              },
            ]}
          />
          <div className='mb-3 flex w-full flex-col items-start justify-start gap-1 sm:items-center sm:justify-end'>
            <div className='flex w-full items-start justify-start gap-1 sm:items-center sm:justify-end'>
              <input
                type='checkbox'
                name=''
                id=''
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
            {liveLocationError && (
              <span className='text-xs text-red-400'>
                Unselect &quot;I operate without a physical location (mobile or
                onine service only) &quot;{' '}
              </span>
            )}
            {!noPhysicalAddress && useLiveLocation && (
              <Input
                name='business_location'
                type='text'
                label='Where is your business located?'
                className='w-full'
              />
            )}
          </div>
        </div>
        <div className='flex items-start gap-1 sm:items-center'>
          <input
            type='checkbox'
            name=''
            id=''
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
      </Form>
    </div>
  );
};

export default BusinessLocationForm;
