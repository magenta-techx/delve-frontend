'use client';
import React, { useRef, useState } from 'react';
import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import Logo from '@/components/ui/Logo';
import BusinessIntroductionForm from './BusinessIntroductionForm';
import { Button } from '@/components/ui/Button';
import ArrowRightIconWhite from '@/assets/icons/ArrowRightIconWhite';
import ArrowLefttIconWhite from '@/assets/icons/ArrowLeftIconWhite';
import BusinessShowCaseForm from './BusinessShowCaseForm';
import BusinessCategoryForm from './BusinessCategoryForm';
import BusinessAmeneties from './BusinessAmeneties';
import BusinessServicesForm from './BusinessServicesForm';
import BusinessLocationForm from './BusinessLocationForm';
import BusinessContactAndBusiness from './BusinessContactAndBusiness';
import { FormikProps, FormikValues } from 'formik';
import { BusinessIntroductionProps } from '@/types/business/types';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { businessSchema } from '@/schemas/businessSchema';
// import { useRouter } from 'next/navigation';

const BusinessStepForm = (): JSX.Element => {
  // const redirect = useRouter();

  const [pageNumber, setPageNumber] = useState(1);
  const [amenities, setAmeneties] = useState<string[]>([]);

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const handleContinue = async (): Promise<void> => {
    if (pageNumber === 1) {
      setPageNumber(prev => prev + 1);
      return;
    }

    if (!formikRef.current) return;

    const errors = await formikRef.current.validateForm();
    console.log(errors);

    if (Object.keys(errors).length > 0) {
      // prevent moving forward
      formikRef.current.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }

    console.log(formikRef.current.values);

    if (pageNumber === 0) {
      return hanldeIntroductionFormsSubmittion(formikRef.current.values);
    }

    await formikRef.current.submitForm();
    setPageNumber(prev => prev + 1);
  };

  const hanldeIntroductionFormsSubmittion = async (
    values: BusinessIntroductionProps
  ): Promise<void> => {
    console.log('hanldeIntroductionFormsSubmittion: ', values);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'name' in value) {
        formData.append(key, value as File);
      } else if (value) {
        formData.append(key, String(value));
      }
    });

    await fetch('/api/business/business-introduction', {
      method: 'POST',
      body: formData, // 👈 this makes it multipart/form-data
      // ❌ don’t set Content-Type, fetch will set the boundary automatically
    });
  };

  // const hanldeShowcaseBusinessFormsSubmittion = async (
  //   values: BusinessOnboardingFormProps
  // ): Promise<void> => {
  //   try {
  //     const res = await fetch('/api/auth/home', {
  //       method: 'POST',
  //       body: JSON.stringify(values),
  //       headers: { 'Content-Type': 'application/json' },
  //     });

  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const hanldeBusinessAmenetiesFormsSubmittion = async (
  //   values: string[]
  // ): Promise<void> => {
  //   try {
  //     const res = await fetch('/api/auth/amenities', {
  //       method: 'POST',
  //       body: JSON.stringify(values),
  //       headers: { 'Content-Type': 'application/json' },
  //     });

  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const hanldeBusinessServicesFormsSubmittion = async (
  //   values: BusinessOnboardingFormProps
  // ): Promise<void> => {
  //   try {
  //     const res = await fetch('/api/auth/amenities', {
  //       method: 'POST',
  //       body: JSON.stringify(values),
  //       headers: { 'Content-Type': 'application/json' },
  //     });

  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const hanldeBusinessContactAndBusinessFormsSubmittion = async (
  //   values: BusinessOnboardingFormProps
  // ): Promise<void> => {
  //   try {
  //     const res = await fetch('/api/auth/amenities', {
  //       method: 'POST',
  //       body: JSON.stringify(values),
  //       headers: { 'Content-Type': 'application/json' },
  //     });

  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   return redirect.push('/business/business-submitted');
  // };

  const PAGE_CONTENTS = [
    {
      id: 0,
      component: (
        <BusinessIntroductionForm
          formikRef={formikRef}
          initialValues={{
            business_name: '',
            description: '',
            website: '',
            logo: '',
          }} // ✅ still works fine
          onSubmit={values => console.log('Form submitted:', values)}
        />
      ),
    },
    {
      id: 1,
      component: <BusinessShowCaseForm />,
    },
    {
      id: 2,
      component: <BusinessCategoryForm setPageNumber={setPageNumber} />,
    },
    {
      id: 3,
      component: (
        <BusinessAmeneties amenities={amenities} setAmeneties={setAmeneties} />
      ),
    },
    {
      id: 4,
      component: <BusinessServicesForm />,
    },
    {
      id: 5,
      component: <BusinessLocationForm />,
    },
    {
      id: 6,
      component: <BusinessContactAndBusiness />,
    },
  ];
  return (
    <section className='relative h-full w-full sm:pb-0'>
      <div className='-mt-4 mb-2 hidden w-full items-center gap-1 sm:flex'>
        {PAGE_CONTENTS.map((content, key) => {
          return (
            <div
              key={key}
              id={`${content.id}`}
              className={`${content.id === pageNumber ? 'bg-primary' : 'bg-[#F0F0F0]'} h-1 w-[33.33%] rounded-xl`}
            ></div>
          );
        })}
      </div>
      <div className='flex w-full items-center justify-between'>
        <Logo icon={<DefaultLogoTextIcon />} />
        <div className='hidden items-center gap-2 sm:flex'>
          {pageNumber !== 0 && (
            <Button
              onClick={() => setPageNumber(prev => prev - 1)}
              variant='black'
            >
              <ArrowLefttIconWhite /> Back
            </Button>
          )}
          {pageNumber < PAGE_CONTENTS.length - 1 && (
            <Button onClick={handleContinue}>
              Continue <ArrowRightIconWhite />
            </Button>
          )}
          {}
        </div>
        <button className='flex text-sm text-gray-600 sm:hidden'>Cancel</button>
      </div>
      <div className='flex h-full w-full items-center justify-center'>
        <div
          className={`flex h-full w-full items-center justify-center py-10 sm:mb-0 sm:pt-14`}
        >
          {/* <Formik
            innerRef={formikRef}
            initialValues={{
              business_name: '',
              about_business: '',
              website: '',
              amenity: '',
              services: [
                {
                  service_title: '',
                  description: '',
                  file: '',
                },
              ],
              business_location: '',
            }}
            validationSchema={businessSchema[pageNumber]}
            onSubmit={values => {
              if (pageNumber === 0) {
                return hanldeIntroductionFormsSubmittion(values);
              }
              if (pageNumber === 1) {
                return hanldeShowcaseBusinessFormsSubmittion(values);
              }
              if (pageNumber === 2) {
                return;
              }
              if (pageNumber === 3 && amenities.length > 0) {
                return hanldeBusinessAmenetiesFormsSubmittion(amenities);
              }
              if (pageNumber === 4) {
                return hanldeBusinessServicesFormsSubmittion(values);
              }
              if (pageNumber === 6) {
                return hanldeBusinessContactAndBusinessFormsSubmittion(values);
              }
              return undefined;
            }}
          > */}
          {PAGE_CONTENTS[pageNumber]?.component}
          {/* </Formik> */}
        </div>
      </div>

      <div className='flex flex-col gap-20 sm:hidden'>
        <div className='flex items-center gap-10'>
          {pageNumber !== 0 && (
            <Button
              onClick={() => setPageNumber(prev => prev - 1)}
              variant='black'
            >
              <ArrowLefttIconWhite /> Back
            </Button>
          )}

          <Button onClick={handleContinue}>
            {`${pageNumber === 6 ? 'Submit' : 'Continue '} `}
            {pageNumber === 6 ? ' ' : <ArrowRightIconWhite />}
          </Button>

          {}
        </div>
        <div className='mb-2 flex w-full items-center gap-1'>
          {PAGE_CONTENTS.map((content, key) => {
            return (
              <div
                key={key}
                id={`${content.id}`}
                className={`${content.id === pageNumber ? 'bg-primary' : 'bg-[#F0F0F0]'} h-1 w-[33.33%] rounded-xl`}
              ></div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessStepForm;
