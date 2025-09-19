'use client';

import BusinessIntroductionFormHeader from './BusinessFormHeader';
import Input from '@/components/ui/Input';
import { FieldArray, Form, Formik, FormikProps, FormikValues } from 'formik';
import InstagramIconColored from '@/assets/icons/business/InstagramIconColored';
import { contactInformationSchema } from '@/schemas/businessSchema';
import WhatsAppIconGreen from '@/assets/icons/business/WhatsAppIconGreen';
import TelegramIconBlue from '@/assets/icons/business/TelegramIconBlue';
import XIconBlack from '@/assets/icons/business/XIconBlack';
import FacebookIconBlue from '@/assets/icons/business/FacebookIconBlue';
import { setBusinessRegistrationStage } from '@/redux/slices/businessSlice';
import { useDispatch } from 'react-redux';

// interface BusinessContactAndBusinessProps {
//   id: number;
//   text: string;
//   url_input: string;
//   icon: React.ReactNode;
// }

// Define your form values
interface BusinessFormValues {
  phone_number: string;
  registration_number: string;
  website: string;
  socials: { id: number; url_input: string; text: string }[];
}

type FormProps<T extends FormikValues> = {
  formikRef: React.Ref<FormikProps<T>>;
  initialValues: T;
  businessId: number | undefined;
};

function BusinessContactAndBusiness({
  formikRef,
  // businessId,
  initialValues,
}: FormProps<BusinessFormValues>): JSX.Element {
  // const [socials, setSocials] = useState<BusinessContactAndBusinessProps[]>([]);

  const dispatch = useDispatch();

  const SOCIAL_MEDIA_TOP = [
    {
      id: 1,
      icon: <WhatsAppIconGreen />,
      text: 'WhatsApp',
      url_input: 'whatsapp_link',
    },
    {
      id: 2,
      icon: <InstagramIconColored />,
      text: 'Instagram',
      url_input: 'instagram_link',
    },
    {
      id: 3,
      icon: <FacebookIconBlue />,
      text: 'Facebook',
      url_input: 'facebook_link',
    },
    {
      id: 4,
      icon: <XIconBlack />,
      text: 'X/Twitter',
      url_input: 'twitter_link',
    },
    {
      id: 5,
      icon: <TelegramIconBlue />,
      text: 'Telegram',
      url_input: 'tiktok_link',
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

  const onSubmit = async (values: FormikValues): Promise<void> => {
    const { socials, ...rest } = values;

    // Convert socials array → flat key/value pairs
    const socialLinks = socials.reduce(
      (
        acc: Record<string, string>,
        social: { url_input: string; value: string }
      ) => {
        acc[social.url_input] = social.value;
        return acc;
      },
      {}
    );

    const payload = {
      ...rest,
      ...socialLinks,
    };

    console.log('payload socialLinks', payload);

    try {
      const res = await fetch('/api/business/business-contact-location', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('amenities data: ', data);

      if (!res.ok) {
        alert(`Error submitting business intro: ${data}`);
        // optionally show toast or set error state
        return;
      }

      dispatch(
        setBusinessRegistrationStage({
          business_registration_step: 7,
        })
      );
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Complete your contact and business information '
        paragraph='Add your contact and registration number for trust'
      />
      <Formik<BusinessFormValues>
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={contactInformationSchema}
        onSubmit={async values => {
          console.log(values);
          await onSubmit(values);
        }}
      >
        {({ values }) => (
          <Form className='mt-3 w-full'>
            {/* Fields */}

            <div className='flex flex-col gap-1 sm:items-center'>
              {/* Phone number  */}
              <Input
                name='phone_number'
                type='text'
                label='Phone number'
                className='w-full'
              />

              <Input
                name='registration_number'
                type='text'
                label={'Business registration number'}
                className='w-full'
              />
            </div>
            <FieldArray name='socials'>
              {({ push, remove }) => (
                <div className='mb-10 flex flex-col gap-4'>
                  {values.socials.map((social, index) => (
                    <div
                      key={social.id}
                      className='rounded-md border border-gray-200 px-4 py-2'
                    >
                      <div className='mb-3 flex items-center justify-between'>
                        <div className='flex items-center gap-1'>
                          <small>
                            {
                              SOCIAL_MEDIA_TOP.find(s => s.id === social.id)
                                ?.icon
                            }
                          </small>
                          <p className='text-sm'>{social.text} Link</p>
                        </div>

                        {/* <button type='button'>V</button> */}
                      </div>

                      <Input
                        name={`socials[${index}].url_input`}
                        type='text'
                        className='w-full'
                      />
                      <div className='flex w-full justify-end'>
                        <button type='button' onClick={() => remove(index)}>
                          x
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
                          onClick={() =>
                            push({
                              id: social.id,
                              text: social.text,
                              url_input: '',
                            })
                          }
                        >
                          {social.icon}
                          <span className='text-xs'>Add</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessContactAndBusiness;
