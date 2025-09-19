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
  BusinessAmenitiesTypeProp,
  BusinessIntroductionProps,
  BusinessShowCaseProps,
} from '@/types/business/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  // clearBusinessData,
  selectBusinessId,
  selectBusinessStep,
  setBusinessRegistrationStage,
} from '@/redux/slices/businessSlice';
import ArrowLeftIconBlackSm from '@/assets/icons/ArrowLeftIconBlackSm';
import { useRouter } from 'next/navigation';
import fileEncoder from '@/utils/fileEncoder';

interface Service {
  title: string;
  description: string;
  image: File | null;
}

interface FormValues {
  services: Service[];
}

interface BusinessFormValues {
  phone_number: string;
  registration_number: string;
  website: string;
  socials: { id: number; url_input: string; text: string }[];
}

const BusinessStepForm = (): JSX.Element => {
  const redirect = useRouter();
  const formStep = useSelector(selectBusinessStep);
  const currentBusinessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(formStep);
  const [businessShowCaseFile, setBusinessShowCaseFile] = useState<File>();
  const [selectedAmenities, setSelectedAmenities] = useState<
    BusinessAmenitiesTypeProp[] | []
  >([]);

  const [businessId, setBusinessId] = useState<number | undefined>(
    currentBusinessId ?? undefined
  );

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const formikValuesRef = useRef<FormikProps<FormValues>>(null);
  const formikValuesContactRef = useRef<FormikProps<BusinessFormValues>>(null);

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

  const hanleAmenitiesFormsSubmittion = async (): Promise<void> => {
    try {
      if (selectedAmenities.length === 0) {
        dispatch(
          setBusinessRegistrationStage({
            business_registration_step: pageNumber + 1,
          })
        );
        return setPageNumber(prev => prev + 1);
      }

      const res = await fetch('/api/business/business-amenities', {
        method: 'PATCH',
        body: JSON.stringify({
          business_id: businessId,
          amenities_ids: selectedAmenities.map(amenity => amenity.id), // send only IDs
        }),
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
          business_registration_step: pageNumber + 1,
        })
      );
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleServicesSubmission = async (
    values: FormValues,
    businessId: number | undefined
  ): Promise<void> => {
    if (!businessId) {
      console.log('❌ No businessId provided');
      return;
    }

    // JSON part of services (with null for files)
    // formData.append(
    //   'services',
    //   JSON.stringify(
    //     values.services.map(s => ({
    //       title: s.title,
    //       description: s.description,
    //       image: s.image instanceof File ? null : s.image,
    //     }))
    //   )
    // );

    // // Append files separately (still under "services")
    // values.services.forEach(s => {
    //   if (s.image instanceof File) {
    //     formData.append('services', s.image);
    //   }
    // });

    try {
      let res: Response;

      if (values.services && values.services.length > 1) {
        console.log('values.services: ', values.services);
        // ✅ Multiple services → JSON only
        const services = await Promise.all(
          values.services.map(async service => ({
            title: service.title,
            description: service.description,
            image: !service.image ? '' : await fileEncoder(service.image),
          }))
        );

        const payload = {
          business_id: businessId,
          services,
        };

        console.log('Converted data: ', payload);

        res = await fetch('/api/business/business-services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else if (values.services && values.services.length === 1) {
        // ✅ Single service → FormData with optional file
        const service = values.services[0];
        if (!service) throw new Error('Service data is missing');

        const formData = new FormData();
        formData.append('business_id', String(businessId));
        formData.append('title', service.title);
        formData.append('description', service.description);

        if (service.image instanceof File) {
          formData.append('image', service.image);
        }

        res = await fetch('/api/business/business-services', {
          method: 'POST',
          body: formData,
        });
      } else {
        console.warn('⚠️ No services provided');
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ Error:', data);
        alert(`Error submitting services: ${data.message || 'Unknown error'}`);
        return;
      }
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
      console.log('✅ Business services submitted successfully:', data);
    } catch (error) {
      console.error('❌ Request failed:', error);
    }
  };

  const handleContinue = async (): Promise<void> => {
    if (pageNumber === 1) {
      return await hanldeShowCaseFormsSubmittion({
        business_id: businessId,
        images: businessShowCaseFile,
      });
    }
    if (pageNumber === 3) {
      return await hanleAmenitiesFormsSubmittion();
    }
    if (pageNumber === 4) {
      if (!formikValuesRef.current) return;

      console.log(formikValuesRef.current.values);
      console.log(businessId);

      if (businessId) {
        return await handleServicesSubmission(
          formikValuesRef.current.values,
          businessId
        );
      }
    }
    if (pageNumber === 6) {
      if (!formikValuesContactRef.current) return;

      if (businessId) {
        await formikValuesContactRef.current.submitForm();
        dispatch(
          setBusinessRegistrationStage({
            business_registration_step: pageNumber + 1,
          })
        );
        setPageNumber(prev => prev + 1);
      }
    }

    // For forms that require formik validations or have formik fields
    if (!formikRef.current) return;

    const errors = await formikRef.current.validateForm();
    console.log(errors);
    console.log(formikRef.current.values);

    if (Object.keys(errors).length > 0) {
      // prevent moving forward
      formikRef.current.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }

    if (pageNumber === 0) {
      return await hanldeIntroductionFormsSubmittion(formikRef.current.values);
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
          }}
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
      component: (
        <BusinessCategoryForm
          setPageNumber={setPageNumber}
          businessId={businessId}
        />
      ),
    },
    {
      id: 3,
      component: (
        <BusinessAmeneties
          setSelectedAmenities={setSelectedAmenities}
          selectedAmenities={selectedAmenities}
        />
      ),
    },
    {
      id: 4,
      component: (
        <BusinessServicesForm
          formikRef={formikValuesRef}
          initialValues={{
            services: [{ title: '', description: '', image: null }],
          }}
          onSubmit={values => console.log('Form submitted:', values)}
        />
      ),
    },
    {
      id: 5,
      component: <BusinessLocationForm />,
    },
    {
      id: 6,
      component: (
        <BusinessContactAndBusiness
          businessId={businessId}
          formikRef={formikValuesContactRef}
          initialValues={{
            phone_number: '',
            registration_number: '',
            website: '',
            socials: [] as { id: number; url_input: string; text: string }[],
          }}
        />
      ),
    },
  ];

  // const handleLogOut = (): void => {
  //   dispatch(clearBusinessData());
  //   signOut({ redirect: true, callbackUrl: '/auth/signin-signup' });
  // };
  return (
    <section className='relative h-full w-full sm:pb-0'>
      {/* <Button
        className='rounded bg-primary px-3 py-1 text-white'
        onClick={handleLogOut}
      >
        Sign Out
      </Button> */}

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

          <Button
            onClick={handleContinue}
            isSubmitting={
              formikRef.current?.isSubmitting ??
              (false || formikValuesRef.current?.isSubmitting) ??
              false
            }
          >
            {`${pageNumber === 6 ? 'Submit' : 'Continue '} `}
            {formikRef.current?.isSubmitting ||
            formikValuesRef.current?.isSubmitting ? (
              <ArrowRightIconWhite />
            ) : (
              'Loading...'
            )}
          </Button>

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
      {pageNumber != 2 && (
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
      )}
    </section>
  );
};

export default BusinessStepForm;
