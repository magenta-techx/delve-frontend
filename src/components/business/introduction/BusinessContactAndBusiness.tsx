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
// import { setBusinessRegistrationStage } from '@/redux/slices/businessSlice';

// interface BusinessContactAndBusinessProps {
//   id: number;
//   text: string;
//   input_name: string;
//   icon: React.ReactNode;
// }

// Define your form values
interface BusinessFormValues {
  phone_number: string;
  registration_number: string;
  socials: { id: number; input_name: string; text: string }[];
  whatsapp_link: '';
  instagram_link: '';
  facebook_link: '';
  twitter_link: '';
  tiktok_link: '';
}

const initialValues: BusinessFormValues = {
  phone_number: '',
  registration_number: '',
  socials: [],
  whatsapp_link: '',
  instagram_link: '',
  facebook_link: '',
  twitter_link: '',
  tiktok_link: '',
};

type FormProps<T extends FormikValues> = {
  formikRef: React.Ref<FormikProps<T>>;
  businessId: number | undefined;
};

function BusinessContactAndBusiness({
  formikRef,
  businessId,
}: FormProps<BusinessFormValues>): JSX.Element {
  // const [socials, setSocials] = useState<BusinessContactAndBusinessProps[]>([]);

  const SOCIAL_MEDIA_TOP = [
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

  const onSubmit = async (values: BusinessFormValues): Promise<void> => {
    // remove socials before sending
    const { socials, ...payload } = values;
    console.log(socials);

    console.log('Contact values: ', payload);

    try {
      const res = await fetch('/api/business/business-contact-location', {
        method: 'PATCH',
        body: JSON.stringify({
          business_id: businessId, // add your ID
          ...payload,
        }),
      });

      // const data = await res.json();

      if (!res.ok) {
        alert(`Error submitting business intro: ${res}`);
        // optionally show toast or set error state
        console.log('res data: ', res);

        return;
      }
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
        {({ values, setFieldValue }) => (
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
            <FieldArray
              name='socials'
              render={arrayHelpers => (
                <div>
                  {values.socials &&
                    values.socials.length > 0 &&
                    values.socials.map((social, index) => (
                      <div
                        key={social.id}
                        className='mb-4 rounded-md border border-gray-200 px-4 py-2'
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
                          name={social.input_name}
                          type='text'
                          className='w-full'
                        />
                        <div className='flex w-full justify-end'>
                          <button
                            type='button'
                            onClick={() => {
                              arrayHelpers.remove(index);

                              setFieldValue(social.input_name, '');
                            }}
                          >
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
                            arrayHelpers.push({
                              id: social.id,
                              text: social.text,
                              input_name: social.input_name,
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
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessContactAndBusiness;
