'use client';
import React, { ChangeEvent, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import Input from '@/components/ui/Input';
import { Form, Formik } from 'formik';
// import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';

const BusinessLocationForm = (): JSX.Element => {
  const [useLiveLocation, setUseLiveLocation] = useState<boolean>(false);
  const [noPhysicalAddress, setNoPhysicalAddress] = useState<boolean>(false);
  const [liveLocationError, setLiveLocationError] = useState<boolean>(false);

  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Set your location address '
        paragraph='Add your business location to help clients find you easily '
      />
      <Formik
        initialValues={{ location: '' }}
        onSubmit={values => console.log(values)}
      >
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
              <div className='relative w-full'>
                <Input
                  name='location'
                  type='text'
                  label='Where is your business located?'
                  className='w-full'
                  icon={<BusinessCategoryIcons value='marker' />}
                  iconPosition='left'
                />
                <div className='absolute right-0 top-1 flex items-center gap-1'>
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
              </div>
              {liveLocationError && (
                <span className='text-xs text-red-400'>
                  Unselect &quot;I operate without a physical location (mobile
                  or onine service only) &quot;{' '}
                </span>
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
              I operate without a physical location (mobile or onine service
              only)
            </span>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default BusinessLocationForm;
