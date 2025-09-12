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
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBusinessStep,
  setBusinessRegistrationStage,
} from '@/redux/slices/businessSlice';
import ArrowLeftIconBlackSm from '@/assets/icons/ArrowLeftIconBlackSm';
import { useRouter } from 'next/navigation';

const BusinessStepForm = (): JSX.Element => {
  const redirect = useRouter();
  const formStep = useSelector(selectBusinessStep);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(formStep);
  const [amenities, setAmeneties] = useState<string[]>([]);

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const handleContinue = async (): Promise<void> => {
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
    dispatch(setBusinessRegistrationStage(pageNumber));
  };

  const handleBack = async (): Promise<void> => {
    if (pageNumber === 0) {
      redirect.push('/business/get-started');
    } else {
      setPageNumber(prev => prev - 1);
      dispatch(setBusinessRegistrationStage(pageNumber));
    }
  };

  const hanldeIntroductionFormsSubmittion = async (
    values: BusinessIntroductionProps
  ): Promise<void> => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'name' in value) {
        formData.append(key, value as File);
      } else if (value) {
        formData.append(key, String(value));
      }
    });

    try {
      const res = await fetch('/api/business/business-introduction', {
        method: 'POST',
        body: formData, // ✅ automatically multipart/form-data
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error submitting business intro:', data);
        // optionally show toast or set error state
        return;
      }

      console.log('✅ Business intro submitted successfully:', data);

      // move to next step only if success
      setPageNumber(prev => prev + 1);
      dispatch(setBusinessRegistrationStage(pageNumber + 1));
    } catch (error) {
      console.error('Request failed:', error);
    }
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

        <button
          onClick={handleBack}
          className='flex items-center gap-2 text-sm text-gray-600 sm:hidden'
        >
          <ArrowLeftIconBlackSm /> <p>Back</p>
        </button>
      </div>
      <div className='flex h-full w-full items-center justify-center'>
        <div
          className={`flex h-full w-full items-center justify-center py-10 sm:mb-0 sm:pt-14`}
        >
          {PAGE_CONTENTS[pageNumber]?.component}
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
