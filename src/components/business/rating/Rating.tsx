'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import CancleIcon from '@/assets/icons/CancelIcon';
import { IconsType, RatingsIcons } from '@/assets/icons/business/ratings/Icons';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/Button';
import TextArea from '@/components/ui/TextArea';
import Input from '@/components/ui/Input';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';

interface RatingProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const Rating = ({ open, setOpen }: RatingProps): JSX.Element => {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);

  const [showServicesOptions, setShowServicesOptions] =
    useState<boolean>(false);

  const [customeService, setCusomtservice] = useState<boolean>(false);

  const RATING_DATA: {
    id: number;
    icon: string;
    state: string;
  }[] = [
    {
      id: 1,
      state: 'sad',
      icon: 'rating-emoji-poor',
    },
    {
      id: 2,
      state: 'fair',
      icon: 'rating-emoji-bad',
    },
    {
      id: 3,
      state: 'normal',
      icon: 'rating-emoji-normal',
    },
    {
      id: 4,
      state: 'good',
      icon: 'rating-emoji-happy',
    },
    {
      id: 5,
      state: 'happy',
      icon: 'rating-emoji-excited',
    },
  ];

  const SERVCICES = [
    'Haircut',
    'Hair Coloring',
    'Braids/Weaves',
    'Wig Installation',
    'Hair Treatment',
    'Blow Dry & Styling',
    'Others (type service)',
  ];

  return (
    <div>
      <Modal isOpen={open} onClose={() => setOpen(false)} contentClassName=''>
        <div className='flex min-h-[308px] w-[462px] flex-col items-center rounded-lg border-[1px] border-[#CDD5DF] bg-white px-8 py-6 shadow-lg'>
          <div className='mb-6 w-full'>
            <div className='mb-4 flex w-full justify-end'>
              <button
                onClick={() => {
                  setOpen(false);
                  setSelectedRating(null);
                  setShowServicesOptions(false);
                }}
              >
                <CancleIcon />
              </button>
            </div>
            <div className='text-center text-[24px] font-medium'>
              <h1 className='text-center text-[24px] font-medium'>
                How was your experience with
              </h1>
              <div className='-mb-2 flex items-center justify-center gap-2'>
                <RatingsIcons value='business-primary' />
                <h1>Aura?</h1>
              </div>
              <span className='text-[14px] text-[#9098A3]'>
                We’d love to know!
              </span>
            </div>
          </div>
          <div className='mb-5 flex items-center gap-4'>
            {RATING_DATA.map(rating => {
              return (
                <button
                  key={rating.id}
                  className={`${rating.state === selectedRating ? 'bg-[#A48AFB] shadow-xl' : ''} flex h-[58px] w-[58px] items-center justify-center rounded-full`}
                  onClick={() => setSelectedRating(rating.state)}
                >
                  {rating.icon && (
                    <RatingsIcons value={rating.icon as IconsType} />
                  )}
                </button>
              );
            })}
          </div>
          <div className='mb-1 flex items-center gap-1'>
            <RatingsIcons value={'rating-star-yellow'} />
            <RatingsIcons value={'rating-star-yellow'} />
            <RatingsIcons value={'rating-star-yellow'} />
            <RatingsIcons value={'rating-star-yellow'} />
          </div>
          <div className='mb-10'>
            <span className='capitalize text-gray-500'>{selectedRating}</span>
          </div>

          {
            <Formik
              initialValues={{
                first_name: '',
                last_name: '',
                email: '',
                current_password: '****************',
                // confirm_password: '',
              }}
              // validationSchema={signupSchema}
              onSubmit={values => {
                console.log(values);
              }}
            >
              {({ isSubmitting }) => (
                <Form className='w-full'>
                  {/* Fields */}
                  {selectedRating && (
                    <div className='flex w-full flex-col gap-2'>
                      {/* selection section  */}
                      {!customeService && (
                        <div className='reltive mb-4'>
                          <label className='text-sm font-medium'>Service</label>
                          <button
                            type='button'
                            className={`flex w-full appearance-none items-center justify-between rounded-md border border-gray-300 px-5 py-3 font-inter text-[16px] sm:text-[13px]`}
                            onClick={() => setShowServicesOptions(true)}
                          >
                            <span className='text-[16px] text-[#9AA4B2]'>
                              Select
                            </span>
                            <BusinessCategoryIcons value='arrow-down' />
                          </button>

                          {/* Services drop down  */}
                          {showServicesOptions && (
                            <div className='absolute z-10 mt-3 flex h-[236px] w-[293px] flex-col items-start justify-center gap-2 rounded-md border-[1px] border-[#E3E8EF] bg-[#FCFCFD] pl-5'>
                              {SERVCICES.map((service, key) => {
                                return (
                                  <button
                                    key={key}
                                    type='button'
                                    className='text-[14px]'
                                    onClick={() => setCusomtservice(true)}
                                  >
                                    {service}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Service Field */}
                      {customeService && (
                        <Input
                          name='service'
                          type='text'
                          placeholder='Type the service you received'
                          label='Service'
                        />
                      )}

                      {/* Password Field */}
                      <TextArea name='tell_us_more' label='Tell us more' />
                    </div>
                  )}
                  {/* Submit Button */}
                  <Button
                    type='submit'
                    // disabled={!passwordReset}
                    isSubmitting={isSubmitting}
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          }
        </div>
      </Modal>
    </div>
  );
};

export default Rating;
