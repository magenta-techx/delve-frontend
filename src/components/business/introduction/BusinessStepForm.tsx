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
import { BusinessAmenitiesTypeProp, BusinessShowCaseProps } from '@/types/business/types';
import { useBusinessRegistrationStore } from '@/stores/businessRegistrationStore';
import ArrowLeftIconBlackSm from '@/assets/icons/ArrowLeftIconBlackSm';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
// import Loader from '@/components/ui/Loader';
// import Spinner from '@/components/business/Spinner';
// import fileEncoder from '@/utils/fileEncoder';

// Service shape is inferred directly from child form values; local interface removed after RHF migration

// Legacy FormValues no longer used after RHF migration for services

const BusinessStepForm = (): JSX.Element => {
  type ContactFormHandle = { submit: () => Promise<void> };
  type IntroFormHandle = { submit: () => Promise<void> };
  type ServicesFormHandle = { submit: () => Promise<void> };
  const contactFormRef = useRef<ContactFormHandle | null>(null);
  const introFormRef = useRef<IntroFormHandle | null>(null);
  const servicesFormRef = useRef<ServicesFormHandle | null>(null);

  const redirect = useRouter();
  const {
    business_registration_step: formStep,
    business_id: currentBusinessId,
    setStep,
    setBusinessId,
  } = useBusinessRegistrationStore();
  const [pageNumber, setPageNumber] = useState(formStep);
  const [businessShowCaseFile, setBusinessShowCaseFile] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<
    BusinessAmenitiesTypeProp[] | []
  >([]);
  const [showSubBusinessCategories, setShowSubBusinessCategories] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [businessId, setLocalBusinessId] = useState<number | undefined>(
    currentBusinessId ?? undefined
  );

  // Introduction form submission is handled within the child via RHF; we trigger it via ref

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
        setStep(pageNumber + 1);
        setPageNumber(prev => prev + 1);
      }
    } catch (error) {
      console.log('Request failed:', error);
    }
    setIsSubmitting(false);
  };

  const hanleAmenitiesFormsSubmittion = async (): Promise<void> => {
    try {
      if (selectedAmenities.length === 0) {
        setStep(pageNumber + 1);
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

      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.log('Request failed:', error);
    }
    setIsSubmitting(false);
  };

  const handleServicesSubmission = async (
    values: { services: { title?: string | undefined; description?: string | undefined; image_field?: unknown }[] },
    businessId: number | undefined
  ): Promise<void> => {
    if (!businessId) {
      console.log('❌ No businessId provided');
      return;
    }

  console.log('values.services.length', values.services.length);

    // Check if ALL services are empty
    const nonEmptyServices = values.services.filter(service =>
      (service.title ?? '').trim() !== '' ||
      (service.description ?? '').trim() !== '' ||
      Boolean(service.image_field)
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
            title: service.title ?? '',
            description: service.description ?? '',
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
        formData.append('title', service.title ?? '');
        formData.append('description', service.description ?? '');

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
        setStep(pageNumber + 1);
        setPageNumber(prev => prev + 1);
      }
      console.log('✅ Business services submitted successfully:', data);
    } catch (error) {
      console.log('❌ Request failed:', error);
    }
    setIsSubmitting(false);
  };

  const handleContinue = async (): Promise<void> => {
    setIsSubmitting(true);
    if (pageNumber === 5) {
      setPageNumber(6);
      setIsSubmitting(false);
    }
    if (pageNumber === 0) {
      await introFormRef.current?.submit();
      setIsSubmitting(false);
      return;
    }
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
      await servicesFormRef.current?.submit();
      setIsSubmitting(false);
      return;
    }
    if (pageNumber === 6) {
      await contactFormRef.current?.submit();
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  const handleBack = async (): Promise<void> => {
    if (pageNumber === 0) {
      redirect.push('/business/get-started');
    } else {
      setPageNumber(prev => prev - 1);
      setStep(pageNumber - 1);
    }
  };

  const PAGE_CONTENTS = [
    {
      id: 0,
      component: (
        <BusinessIntroductionForm
          ref={introFormRef}
          onSuccess={(newId: number) => {
            setBusinessId(newId);
            setLocalBusinessId(newId);
            setStep(pageNumber + 1);
            setPageNumber(prev => prev + 1);
          }}
          setIsSubmitting={setIsSubmitting}
          onFormStateChange={state => setFormState(state)}
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
          ref={servicesFormRef}
          onSubmit={values => {
            if (businessId) {
              handleServicesSubmission(values, businessId);
            } else {
              // If no business id, skip to next step
              setStep(pageNumber + 1);
              setPageNumber(prev => prev + 1);
            }
          }}
          setIsSubmitting={setIsSubmitting}
          onFormStateChange={state => setFormState(state)}
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
          ref={contactFormRef}
          businessId={businessId}
          setIsSubmitting={setIsSubmitting}
          onFormStateChange={state => setFormState(state)}
        />
      ),
    },
  ];

  const [formState, setFormState] = useState({
    isValid: false,
    isDirty: false,
  });

  // Form validity/dirty state is provided by child forms via onFormStateChange

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
