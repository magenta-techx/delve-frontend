'use client';
import React, { useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import Input from '@/components/ui/Input';
import { Form, Formik } from 'formik';
import InstagramIconColored from '@/assets/icons/business/InstagramIconColored';
import { businessIntroductionSchema } from '@/schemas/businessSchema';
import WhatsAppIconGreen from '@/assets/icons/business/WhatsAppIconGreen';
import TelegramIconBlue from '@/assets/icons/business/TelegramIconBlue';
import XIconBlack from '@/assets/icons/business/XIconBlack';
import FacebookIconBlue from '@/assets/icons/business/FacebookIconBlue';

interface BusinessContactAndBusinessProps {
  id: number;
  text: string;
  icon: React.ReactNode;
}

const BusinessContactAndBusiness = (): JSX.Element => {
  const [socials, setSocials] = useState<BusinessContactAndBusinessProps[]>([]);
  //   const handleSubmit = async (values: {
  //     business_name: string;
  //     about_business: string;
  //     website: string;
  //   }): Promise<void> => {
  //     alert(values.business_name);
  //   };

  const SOCIAL_MEDIA_TOP = [
    {
      id: 1,
      icon: <WhatsAppIconGreen />,
      text: 'WhatsApp',
    },
    {
      id: 2,
      icon: <InstagramIconColored />,
      text: 'Instagram',
    },
    {
      id: 3,
      icon: <FacebookIconBlue />,
      text: 'Facebook',
    },
    {
      id: 4,
      icon: <XIconBlack />,
      text: 'X/Twitter',
    },
    {
      id: 5,
      icon: <TelegramIconBlue />,
      text: 'Telegram',
    },
  ];
  const handleAddSocials = (values: BusinessContactAndBusinessProps): void => {
    const checkUniqueSocialMedia = socials.some(
      social => social.id === values.id
    );
    console.log('checkUniqueSocialMedia: ', checkUniqueSocialMedia);

    if (!checkUniqueSocialMedia) {
      setSocials([...socials, values]);
    }
  };
  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Complete your contact and business information '
        paragraph='Add your contact and registration number for trust'
      />
      <Formik
        initialValues={{
          phone_number: '',
          reg_number: '',
          website: '',
        }}
        validationSchema={businessIntroductionSchema}
        onSubmit={values => {
          console.log(values);
        }}
      >
        {() => (
          <Form className='mt-3 w-full'>
            {/* Fields */}

            <div className='flex flex-col gap-1 sm:items-center'>
              {/* Phone number  */}
              <Input
                name='phone_number'
                type='number'
                label='Phone number'
                className='w-full'
              />

              <Input
                name='reg_number'
                type='text'
                label={'Business registration number'}
                className='w-full'
              />
            </div>
          </Form>
        )}
      </Formik>
      <div className='mb-10 flex flex-col gap-4'>
        {socials.map((social, key) => {
          return (
            <div
              key={key}
              className='rounded-md border border-gray-200 px-4 py-2'
            >
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <small className=''>{social.icon}</small>
                  <p className='text-sm'> {social.text} Link</p>
                </div>
                <div>v</div>
              </div>
              <input className='px'></input>
            </div>
          );
        })}
      </div>

      <div className='flex w-full justify-center'>
        <div className='grid w-[65%] grid-cols-3 gap-y-4 sm:w-[80%] sm:grid-cols-5'>
          {SOCIAL_MEDIA_TOP.map((social, key) => {
            return (
              <button
                className='flex h-[60px] w-[45px] flex-col items-center justify-center gap-1 rounded-lg border border-gray-200'
                key={key}
                onClick={() => handleAddSocials(social)}
              >
                {social.icon}
                <span className='text-xs'> Add</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessContactAndBusiness;
