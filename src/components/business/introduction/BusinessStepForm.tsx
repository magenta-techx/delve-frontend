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
import {
  BusinessIntroductionProps,
  BusinessShowCaseProps,
} from '@/types/business/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearBusinessData,
  selectBusinessId,
  selectBusinessStep,
  setBusinessRegistrationStage,
} from '@/redux/slices/businessSlice';
import ArrowLeftIconBlackSm from '@/assets/icons/ArrowLeftIconBlackSm';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const BusinessStepForm = (): JSX.Element => {
  const redirect = useRouter();
  const formStep = useSelector(selectBusinessStep);
  const currentBusinessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(formStep);
  const [businessShowCaseFile, setBusinessShowCaseFile] = useState<File>();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenity, setAmenity] = useState<string | File>('');
  const [businessId, setBusinessId] = useState<number | undefined>(
    currentBusinessId ?? undefined
  );

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const handleContinue = async (): Promise<void> => {
    if (pageNumber === 1) {
      return hanldeShowCaseFormsSubmittion({
        business_id: businessId,
        images: businessShowCaseFile,
      });
    }

    // For forms that require formik validations or have formik fields
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
  };

  const handleBack = async (): Promise<void> => {
    if (pageNumber === 0) {
      redirect.push('/business/get-started');
    } else {
      setPageNumber(prev => prev - 1);
      dispatch(
        setBusinessRegistrationStage({
          business_registration_step: pageNumber - 1,
        })
      );
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
        alert(`Error submitting business intro: ${data}`);
        // optionally show toast or set error state
        return;
      }

      console.log('✅ Business intro submitted successfully:', data);
      console.log('data?.data?.id:', data?.data?.id);

      // move to next step only if success
      if (data?.data?.id) {
        setBusinessId(data?.data?.id);
        dispatch(
          setBusinessRegistrationStage({
            business_registration_step: pageNumber + 1,
            business_id: data?.data?.id,
          })
        );
        setPageNumber(prev => prev + 1);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const hanldeShowCaseFormsSubmittion = async (
    values: BusinessShowCaseProps
  ): Promise<void> => {
    if (!values.images) {
      return alert('Provide at least one image');
    }
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'name' in value) {
        formData.append(key, value as File);
      } else if (value) {
        formData.append(key, String(value));
      }
    });

    try {
      const res = await fetch('/api/business/business-showcase', {
        method: 'POST',
        body: formData, // ✅ automatically multipart/form-data
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error submitting business intro: ${res}`);
        // optionally show toast or set error state
        return;
      }

      console.log('✅ Business intro submitted successfully:', data);

      // move to next step only if success
      if (data?.status) {
        dispatch(
          setBusinessRegistrationStage({
            business_registration_step: pageNumber + 1,
            business_id: data?.data?.id,
          })
        );
        setPageNumber(prev => prev + 1);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // const handleBUsinessDelete = async (): Promise<void> => {
  //   const res = await fetch('/api/business/business-delete', {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ business_id: businessId }),
  //   });
  //   console.log('Deleted business: ', res);
  // };

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
      component: (
        <BusinessShowCaseForm
          setBusinessShowCaseFile={File => setBusinessShowCaseFile(File)}
        />
      ),
    },
    {
      id: 2,
      component: <BusinessCategoryForm setPageNumber={setPageNumber} />,
    },
    {
      id: 3,
      component: (
        <BusinessAmeneties
          setAmenity={setAmenity}
          setAmenities={setAmenities}
          amenities={amenities}
          amenity={amenity}

          // formikRef={formikRef}
          // initialValues={{
          //   business_name: '',
          //   description: '',
          //   website: '',
          //   logo: '',
          // }} // ✅ still works fine
          // onSubmit={values => console.log('Form submitted:', values)}
        />
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

  const handleLogOut = (): void => {
    dispatch(clearBusinessData());
    signOut({ redirect: true, callbackUrl: '/auth/signin-signup' });
  };
  return (
    <section className='relative h-full w-full sm:pb-0'>
      <Button
        className='rounded bg-primary px-3 py-1 text-white'
        onClick={handleLogOut}
      >
        Sign Out
      </Button>

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

        {/* Desktop  */}
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

      {/* Mobile  */}
      <div className='flex flex-col gap-20 sm:hidden'>
        <div className='flex items-center gap-10'>
          {/* {pageNumber !== 0 && (
            <Button
              onClick={() => setPageNumber(prev => prev - 1)}
              variant='black'
            >
              <ArrowLefttIconWhite /> Back
            </Button>
          )} */}

          <Button
            onClick={handleContinue}
            isSubmitting={formikRef.current?.isSubmitting ?? false}
          >
            {`${pageNumber === 6 ? 'Submit' : 'Continue '} `}
            {pageNumber === 6 ? ' ' : <ArrowRightIconWhite />}
          </Button>
          {/* <Button
            onClick={handleBUsinessDelete}
            isSubmitting={formikRef.current?.isSubmitting ?? false}
          >
            Delete business
          </Button>

          {} */}
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
