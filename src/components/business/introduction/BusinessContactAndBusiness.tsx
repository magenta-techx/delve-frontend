'use client';

import BusinessIntroductionFormHeader from './BusinessFormHeader';
import InstagramIconColored from '@/assets/icons/business/InstagramIconColored';
import WhatsAppIconGreen from '@/assets/icons/business/WhatsAppIconGreen';
import TelegramIconBlue from '@/assets/icons/business/TelegramIconBlue';
import XIconBlack from '@/assets/icons/business/XIconBlack';
import FacebookIconBlue from '@/assets/icons/business/FacebookIconBlue';
import ArrowDownIconBlack from '@/assets/icons/business/ArrowDownIconBlack';
import KeyIcon from '@/assets/icons/auth/KeyIcon';
import { showToastNotification } from '@/components/notifications/ToastNotification';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactInformationZodSchema, type ContactInformationInput } from '@/schemas/businessZodSchema';
import { Input } from '@/components/ui/Input';
import { Controller } from 'react-hook-form';
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { useBusinessRegistrationStore } from '@/stores/businessRegistrationStore';

// interface BusinessContactAndBusinessProps {
//   id: number;
//   text: string;
//   input_name: string;
//   icon: React.ReactNode;
// }

type SocialConfig = { id: number; input_name: keyof ContactInformationInput; text: string; icon: React.ReactNode };

type ExposedSubmit = {
  submit: () => Promise<void>;
};

type Props = {
  businessId: number | undefined;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  onFormStateChange?: (state: { isValid: boolean; isDirty: boolean }) => void;
};

const initialValues: ContactInformationInput = {
  phone_number: '',
  registration_number: '',
  whatsapp_link: '',
  instagram_link: '',
  facebook_link: '',
  twitter_link: '',
  tiktok_link: '',
};

const BusinessContactAndBusiness = forwardRef<ExposedSubmit, Props>(
  ({ businessId, setIsSubmitting, onFormStateChange }, ref) => {
    const redirect = useRouter();
    const { setStep } = useBusinessRegistrationStore();
    const SOCIAL_MEDIA_TOP: SocialConfig[] = [
      {
        id: 1,
        icon: <WhatsAppIconGreen />,
        text: 'WhatsApp',
        input_name: 'whatsapp_link',
      },
      {
        id: 2,
        icon: <InstagramIconColored />,
        text: 'Instagram',
        input_name: 'instagram_link',
      },
      {
        id: 3,
        icon: <FacebookIconBlue />,
        text: 'Facebook',
        input_name: 'facebook_link',
      },
      {
        id: 4,
        icon: <XIconBlack />,
        text: 'X/Twitter',
        input_name: 'twitter_link',
      },
      {
        id: 5,
        icon: <TelegramIconBlue />,
        text: 'Telegram',
        input_name: 'tiktok_link',
      },
    ];
  // const handleAddSocials = (values: BusinessContactAndBusinessProps): void => {
  //   const checkUniqueSocialMedia = socials.some(
  //     social => social.id === values.id
  //   );
  //   console.log('checkUniqueSocialMedia: ', checkUniqueSocialMedia);

  //   if (!checkUniqueSocialMedia) {
  //     setSocials([...socials, values]);
  //   }
  // };

    const methods = useForm<ContactInformationInput>({
      resolver: zodResolver(contactInformationZodSchema),
      mode: 'onChange',
      defaultValues: initialValues,
    });
    const { handleSubmit, formState: { isDirty, isValid }, setValue } = methods;
    const errorsMap = methods.formState.errors as Partial<Record<keyof ContactInformationInput, { message?: string }>>;

    useEffect(() => {
      onFormStateChange?.({ isDirty, isValid });
    }, [isDirty, isValid, onFormStateChange]);

    const [socials, setSocials] = useState<SocialConfig[]>([]);

    const onSubmit = async (values: ContactInformationInput): Promise<void> => {
      if (setIsSubmitting) setIsSubmitting(true);
      const payload = { ...values };
      try {
        const res = await fetch('/api/business/business-contact-location', {
          method: 'PATCH',
          body: JSON.stringify({
            business_id: businessId,
            ...payload,
          }),
        });
        if (!res.ok) {
          showToastNotification(
            {
              header: 'Error',
              body: `Invalid regitration number provided`,
            },
            <KeyIcon />
          );
          console.log('res data: ', res);
        }
        if (res.ok) {
          if (setIsSubmitting) setIsSubmitting(false);
          setStep(6);
          redirect.push('/business/business-submitted');
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: async (): Promise<void> => {
        await handleSubmit(onSubmit)();
      },
    }));

    return (
      <div className='sm:w-[500px]'>
        <BusinessIntroductionFormHeader
          intro={'Business account setup'}
          header='Complete your contact and business details '
          paragraph='Add your contact and registration number for trust'
        />
        <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-3 w-full'>
          <div className='flex flex-col gap-1 sm:items-center'>
            <Controller
              name='phone_number'
              control={methods.control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='text'
                  label='Phone number'
                  className='w-full'
                  hasError={!!errorsMap.phone_number}
                  errorMessage={errorsMap.phone_number?.message}
                />
              )}
            />

            <Controller
              name='registration_number'
              control={methods.control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='text'
                  label='Business registration number'
                  className='w-full'
                  hasError={!!errorsMap.registration_number}
                  errorMessage={errorsMap.registration_number?.message}
                />
              )}
            />
          </div>

          <div>
            {socials.length > 0 &&
              socials.map(social => (
                <div
                  key={social.id}
                  className='mb-4 rounded-md border border-gray-200 px-4 py-2'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center gap-1'>
                        <small>{SOCIAL_MEDIA_TOP.find(s => s.id === social.id)?.icon}</small>
                        <p className='text-sm'>{social.text} Link</p>
                      </div>
                      <ArrowDownIconBlack />
                    </div>
                  </div>

                  <Controller
                    name={social.input_name}
                    control={methods.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='text'
                        className='w-full'
                        hasError={!!errorsMap[social.input_name]}
                        errorMessage={errorsMap[social.input_name]?.message}
                      />
                    )}
                  />
                  <div className='flex w-full justify-end'>
                    <button
                      type='button'
                      className='rounded-md border border-red-500 p-2 text-xs font-semibold text-red-500'
                      onClick={() => {
                        setSocials(prev => prev.filter(s => s.id !== social.id));
                        setValue(social.input_name, '');
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            <div className='flex w-full justify-center'>
              <div className='grid w-[65%] grid-cols-3 gap-y-4 sm:w-[80%] sm:grid-cols-5'>
                {SOCIAL_MEDIA_TOP.map(social => (
                  <button
                    type='button'
                    key={social.id}
                    className='flex h-[60px] w-[45px] flex-col items-center justify-center gap-1 rounded-lg border border-gray-200'
                    onClick={() => {
                      setSocials(prev =>
                        prev.find(s => s.id === social.id) ? prev : [...prev, social]
                      );
                    }}
                  >
                    {social.icon}
                    <span className='text-xs'>Add</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
        </FormProvider>
      </div>
    );
  }
);

BusinessContactAndBusiness.displayName = 'BusinessContactAndBusiness';

export default BusinessContactAndBusiness;
