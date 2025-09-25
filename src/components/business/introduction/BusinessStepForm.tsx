'use client';
import React, { useEffect, useRef, useState } from 'react';
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
import Loader from '@/components/ui/Loader';
// import Loader from '@/components/ui/Loader';
// import Spinner from '@/components/business/Spinner';
// import fileEncoder from '@/utils/fileEncoder';

interface Service {
  title: string;
  description: string;
  image_field: File | null;
}

interface FormValues {
  services: Service[];
}

interface BusinessFormValuesContactAndInformation {
  phone_number: string;
  registration_number: string;
  socials: { id: number; input_name: string; text: string }[];
  whatsapp_link: '';
  instagram_link: '';
  facebook_link: '';
  twitter_link: '';
  tiktok_link: '';
}

const BusinessStepForm = (): JSX.Element => {
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const formikRefServices = useRef<FormikProps<FormValues>>(null);
  const formikRefContactAndInformation =
    useRef<FormikProps<BusinessFormValuesContactAndInformation>>(null);

  const redirect = useRouter();
  const formStep = useSelector(selectBusinessStep);
  const currentBusinessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(formStep);
  const [businessShowCaseFile, setBusinessShowCaseFile] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<
    BusinessAmenitiesTypeProp[] | []
  >([]);
  const [showSubBusinessCategories, setShowSubBusinessCategories] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<number | undefined>(
    currentBusinessId ?? undefined
  );

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
      console.log('Request failed:', error);
    }
  };

  const hanldeShowCaseFormsSubmittion = async (
    values: BusinessShowCaseProps
  ): Promise<void> => {
    if (!values.images || values.images.length === 0) {
      return alert('Provide at least one image');
    }

    const formData = new FormData();

    // Add business_id if present
    if (values.business_id) {
      formData.append('business_id', String(values.business_id));
    }

    // Append multiple files
    values.images.forEach(file => {
      formData.append('images', file);
      // OR `formData.append(`images[${index}]`, file)` if backend expects indexed keys
    });

    try {
      const res = await fetch('/api/business/business-showcase', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error submitting showcase: ${data}`);
        return;
      }

      console.log('✅ Business showcase submitted successfully:', data);

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
      console.log('Request failed:', error);
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
      console.log('Request failed:', error);
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

    console.log('values.services.length', values.services.values);

    // Check if ALL services are empty
    const nonEmptyServices = values.services.filter(
      service =>
        service.title.trim() !== '' ||
        service.description.trim() !== '' ||
        service.image_field !== null
    );

    console.log('nonEmptyServices:', nonEmptyServices);

    if (nonEmptyServices.length === 0) {
      // ⏩ Skip to next page
      setPageNumber(prev => prev + 1);
      return;
    }
    const formData = new FormData();

    formData.append('business_id', businessId.toString());

    try {
      if (values.services && values.services.length > 1) {
        const services: {
          title: string;
          description: string;
          image_field?: string; // store the field name, not the File
        }[] = [];

        let imageIndex = 0;

        values.services.forEach(service => {
          const serviceObj: {
            title: string;
            description: string;
            image_field?: string;
          } = {
            title: service.title,
            description: service.description,
          };

          if (service.image_field instanceof File) {
            const imageFieldName = `image_field_${imageIndex}`;
            formData.append(imageFieldName, service.image_field);
            serviceObj.image_field = imageFieldName;
            imageIndex++;
          }

          services.push(serviceObj);
        });

        // attach services JSON with references to image_field_x keys
        formData.append('services', JSON.stringify(services));
      } else if (values.services && values.services.length === 1) {
        // ✅ Single service → FormData with optional file
        const service = values.services[0];
        if (!service) throw new Error('Service data is missing');

        formData.append('business_id', String(businessId));
        formData.append('title', service.title);
        formData.append('description', service.description);

        if (service.image_field instanceof File) {
          formData.append('image_field', service.image_field);
        }
      } else {
        console.warn('⚠️ No services provided');
        return;
      }
      const res = await fetch('/api/business/business-services', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        console.log('❌ Error:', data);
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
      console.log('❌ Request failed:', error);
    }
  };

  const handleContinue = async (): Promise<void> => {
    setIsSubmitting(true);
    if (pageNumber === 5) {
      setIsSubmitting(false);
      setPageNumber(6);
    }
    if (pageNumber === 1) {
      setIsSubmitting(false);
      return await hanldeShowCaseFormsSubmittion({
        business_id: businessId,
        images: businessShowCaseFile,
      });
    }
    if (pageNumber === 3) {
      setIsSubmitting(false);
      return await hanleAmenitiesFormsSubmittion();
    }
    if (pageNumber === 4) {
      if (!formikRefServices.current) {
        setIsSubmitting(false);
        dispatch(
          setBusinessRegistrationStage({
            business_registration_step: pageNumber + 1,
            business_id: currentBusinessId,
          })
        );
        return setPageNumber(prev => prev + 1);
      } else if (
        businessId &&
        formikRefServices.current.values.services.length
      ) {
        setIsSubmitting(false);
        return await handleServicesSubmission(
          formikRefServices.current.values,
          businessId
        );
      }
    }
    if (pageNumber === 6) {
      if (!formikRefContactAndInformation.current) return;

      const errors =
        await formikRefContactAndInformation.current.validateForm();
      console.log(errors);
      console.log(formikRefContactAndInformation.current.values);

      if (Object.keys(errors).length > 0) {
        // prevent moving forward
        formikRefContactAndInformation.current.setTouched(
          Object.keys(errors).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          )
        );
        return;
      }

      if (businessId) {
        setIsSubmitting(true);
        await formikRefContactAndInformation.current.submitForm();
        dispatch(
          setBusinessRegistrationStage({
            business_registration_step: pageNumber + 1,
          })
        );
        setIsSubmitting(false);

        // setPageNumber(prev => prev + 1);
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
    setIsSubmitting(false);
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
          setShowSubBusinessCategories={setShowSubBusinessCategories}
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
          formikRef={formikRefServices}
          initialValues={{
            services: [{ title: '', description: '', image_field: null }],
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
          formikRef={formikRefContactAndInformation}
        />
      ),
    },
  ];

  const [formState, setFormState] = useState({
    isValid: false,
    isDirty: false,
  });

  // Keep watching formikRef updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (formikRef.current) {
        setFormState({
          isValid: formikRef.current.isValid,
          isDirty: formikRef.current.dirty,
        });
      }
      if (formikRefContactAndInformation.current) {
        setFormState({
          isValid: formikRefContactAndInformation.current.isValid,
          isDirty: formikRefContactAndInformation.current.dirty,
        });
      }
    }, 200); // polling (Formik doesn’t emit events)

    return (): void => clearInterval(interval);
  }, []);

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

          {!showSubBusinessCategories && (
            <Button
              onClick={handleContinue}
              // isSubmitting={
              //   formikRef.current?.isSubmitting ||
              //   formikRefServices.current?.isSubmitting ||
              //   formikRefContactAndInformation.current?.isSubmitting ||
              //   false
              // }
              disabled={
                (pageNumber === 0 &&
                  !(formState.isValid && formState.isDirty)) ||
                (pageNumber === 1 && businessShowCaseFile.length < 1) ||
                (pageNumber === 3 && false) ||
                (pageNumber === 4 && false) ||
                (pageNumber === 6 && !(formState.isValid && formState.isDirty))
                // (pageNumber === 4 && !formikRefServices.current?.isValid) ||
                // (pageNumber === 6 &&
                //   !formikRefContactAndInformation.current?.isValid)
              }
            >
              {`${pageNumber === 6 ? 'Submit' : 'Continue '} `}
              {isSubmitting ? <Loader /> : <ArrowRightIconWhite />}
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
              isSubmitting={
                formikRef.current?.isSubmitting ??
                formikRefServices.current?.isSubmitting ??
                formikRefContactAndInformation.current?.isSubmitting ??
                false
              }
              disabled={
                (pageNumber === 0 &&
                  !(formState.isValid && formState.isDirty)) ||
                (pageNumber === 1 && businessShowCaseFile.length < 1)
                // (pageNumber === 4 && !formikRefServices.current?.isValid) ||
                // (pageNumber === 6 &&
                //   !formikRefContactAndInformation.current?.isValid)
              }
            >
              {`${pageNumber === 6 ? 'Submit' : 'Continue '} `}
              {isSubmitting ? <Loader /> : <ArrowRightIconWhite />}
            </Button>
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
