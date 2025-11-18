'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import ArrowRightIconWhite from '@/assets/icons/ArrowRightIconWhite';

import BusinessIntroductionForm from './CreateListingFormStep1Introduction';
import BusinessShowCaseForm from './CreateListingFormStep2Showcase';
import BusinessCategoryForm from './CreateListingFormStep3Category';
import BusinessAmenities from './CreateListingFormStep4Amenities';
import BusinessServicesForm from './CreateListingFormStep5Services';
import BusinessLocationForm from './CreateListingFormStep6Location';
import BusinessContactAndBusiness from './CreateListingFormStep7Contact';
import { BusinessShowCaseProps } from '@/types/business/types';
import { useBusinessRegistrationStore } from '@/stores/businessRegistrationStore';
import ArrowLeftIconBlackSm from '@/assets/icons/ArrowLeftIconBlackSm';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

import {
  useUploadBusinessImages,
  useUpdateBusinessAmenities,
  useCreateBusinessServices,
  useUpdateBusinessCategory,
  useUpdateLocationAndContact,
} from '@/app/(business)/misc/api/business';
import { Logo } from '@/assets/icons';
import {
  businessShowcaseZodSchema,
  servicesZodSchema,
  locationZodSchema,
} from '@/schemas/businessZodSchema';
import { toast } from 'sonner';
import z from 'zod';
import { BusinessService } from '@/types/api';

export type CreateListingLocation = z.infer<typeof locationZodSchema>;
const BusinessStepForm = (): JSX.Element => {
  type IntroFormHandle = { submit: () => Promise<void> };

  const introFormRef = useRef<IntroFormHandle | null>(null);

  const router = useRouter();
  const {
    business_registration_step: savedStep,
    business_id: currentBusinessId,
    setStep,
    setBusinessId,
  } = useBusinessRegistrationStore();

  // API hooks
  const uploadImagesMutation = useUploadBusinessImages();
  const createServicesMutation = useCreateBusinessServices();
  const updateAmenitiesMutation = useUpdateBusinessAmenities();
  const updateLocationMutation = useUpdateLocationAndContact();
  const updateCategoryMutation = useUpdateBusinessCategory();

  const [pageNumber, setPageNumber] = useState(savedStep);
  const [businessShowCaseFile, setBusinessShowCaseFile] = useState<File[]>([]);
  // Combined interface for the API
  interface CombinedContactInfo {
    phone_number: string;
    registration_number: string;
    whatsapp_link?: string;
    facebook_link?: string;
    instagram_link?: string;
    twitter_link?: string;
    tiktok_link?: string;
  }

  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<
    number[]
  >([]);
  const [subcategoryCount, setSubcategoryCount] = useState<number>(0);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [location, setLocation] = useState<CreateListingLocation | null>(null);
  const [contactInfo, setContactInfo] = useState<CombinedContactInfo | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [businessId, setLocalBusinessId] = useState<number | undefined>(
    currentBusinessId ?? undefined
  );

  // Step 1: Introduction
  const handleIntroductionFormSuccess = (createdBusinessId: number) => {
    setLocalBusinessId(createdBusinessId);
    setBusinessId(createdBusinessId);
    setStep(pageNumber + 1);
    setPageNumber(prev => prev + 1);
  };

  // Step 2: Showcase
  const handleShowCaseFormsSubmission = async (
    values: BusinessShowCaseProps
  ): Promise<void> => {
    if (!values.images || values.images.length === 0) {
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
      setIsSubmitting(false);
      return;
    }

    if (!businessId) {
      toast.error('Error', {
        description:
          'Business ID not found. Please try again from the beginning.',
      });
      return;
    }

    try {
      await uploadImagesMutation.mutateAsync({
        business_id: businessId,
        images: values.images,
      });

      toast.success('Step completed!', {
        description: 'Showcase images uploaded successfully.',
      });
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.log('Request failed:', error);
      toast.error('Error', {
        description: `'Error submitting showcase. ${error}.'`,
      });
    }
    setIsSubmitting(false);
  };

  // Step 3: Categories
  const handleCategorySelection = (
    categoryId: number,
    subcategoryIds: number[]
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryIds(subcategoryIds);
    setSubcategoryCount(subcategoryIds.length);
  };

  const handleCategoryFormsSubmission = async (): Promise<void> => {
    if (
      !businessId ||
      !selectedCategoryId ||
      selectedSubcategoryIds.length === 0
    ) {
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateCategoryMutation.mutateAsync({
        business_id: businessId,
        category_id: selectedCategoryId,
        subcategory_ids: selectedSubcategoryIds,
      });

      toast.success('Step completed!', {
        description: 'Business categories updated successfully.',
      });
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
      toast.error('New Error', {
        description: `Error updating categories. ${error}`,
      });
    }
    setIsSubmitting(false);
  };

  // Step 4: Amenities
  const handleAmenitiesFormsSubmission = async (): Promise<void> => {
    try {
      if (selectedAmenities.length === 0 || !businessId) {
        setStep(pageNumber + 1);
        setPageNumber(prev => prev + 1);
        setIsSubmitting(false);
        return;
      }

      await updateAmenitiesMutation.mutateAsync({
        business_id: businessId,
        amenities_ids: selectedAmenities,
      });

      toast.success('Step completed!', {
        description: 'Business amenities updated successfully.',
      });
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      toast.error('New Error', {
        description: `Error updating amenities. ${error}`,
      });
    }
    setIsSubmitting(false);
  };

  // Step 5: Services
  const handleServicesFormsSubmission = async (): Promise<void> => {
    if (!businessId || services.length === 0) {
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
      setIsSubmitting(false);
      return;
    }

    try {
      // Transform services to ensure description is always present and image is undefined instead of null
      const servicesWithDescription = services.map(service => ({
        ...service,
        description: service.description || '',
        image: service.image === null ? undefined : service.image
      }));
      
      await createServicesMutation.mutateAsync({
        business_id: businessId,
        services: servicesWithDescription,
      });

      toast.success('Step completed!', {
        description: 'Business services created successfully.',
      });
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.log('Request failed:', error);
      toast.error('Error', {
        description: 'Error creating services. Please try again.',
      });
    }
    setIsSubmitting(false);
  };

  // Step 5: Location validation only (no submission)
  const handleLocationValidation = async (): Promise<void> => {
    if (!location) {
      toast.error('Validation Error', {
        description: 'Please provide your business location information.',
      });
      setIsSubmitting(false);
      return;
    }

    const locationResult = locationZodSchema.safeParse(location);
    if (!locationResult.success) {
      const errorMessage =
        locationResult.error.issues[0]?.message ||
        'Please complete the location information.';
      toast.error('Validation Error', {
        description: errorMessage,
      });
      setIsSubmitting(false);
      return;
    }

    // Just move to next step, no API call
    setStep(pageNumber + 1);
    setPageNumber(prev => prev + 1);
    setIsSubmitting(false);
  };

  // Step 6: Combined Location and Contact submission
  const handleLocationAndContactSubmission = async (): Promise<void> => {
    if (!businessId) {
      toast.error('Error', {
        description:
          'Business ID not found. Please try again from the beginning.',
      });
      setIsSubmitting(false);
      return;
    }

    if (!location || !contactInfo) {
      toast.error('Validation Error', {
        description: 'Please complete both location and contact information.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Combine location and contact data for the API
      const combinedData = {
        business_id: businessId,
        state: location.state,
        phone_number: contactInfo.phone_number,
        registration_number: contactInfo.registration_number,
        ...(contactInfo.whatsapp_link && {
          whatsapp_link: contactInfo.whatsapp_link,
        }),
        ...(contactInfo.facebook_link && {
          facebook_link: contactInfo.facebook_link,
        }),
        ...(contactInfo.instagram_link && {
          instagram_link: contactInfo.instagram_link,
        }),
        ...(contactInfo.twitter_link && {
          twitter_link: contactInfo.twitter_link,
        }),
        ...(contactInfo.tiktok_link && {
          tiktok_link: contactInfo.tiktok_link,
        }),
        // Only include address and coordinates if they have a physical location
        ...(!location.operates_without_location && {
          address: location.address,
          ...(location.latitude !== undefined && {
            latitude: location.latitude,
          }),
          ...(location.longitude !== undefined && {
            longitude: location.longitude,
          }),
        }),
      };

      await updateLocationMutation.mutateAsync(combinedData);

      console.log('✅ Location and contact information updated successfully');
      toast.success('Success!', {
        description: 'Business registration completed successfully.',
      });

      // Registration complete, redirect to business submitted page
      router.push('/business/business-submitted');
    } catch (error) {
      console.log('Request failed:', error);
      toast.error('Error', {
        description: 'Error updating information. Please try again.',
      });
    }
    setIsSubmitting(false);
  };

  const getButtonText = (): string => {
    if (pageNumber === steps.length - 1) {
      return 'Finish 🚀';
    }

    if (
      (pageNumber === 3 && selectedAmenities.length === 0) ||
      (pageNumber === 4 && services.length === 0)
    ) {
      return 'Skip';
    }

    return 'Continue';
  };

  const validateCurrentStep = (): boolean => {
    try {
      switch (pageNumber) {
        case 0:
          return true;
        case 1:
          const showcaseResult = businessShowcaseZodSchema.safeParse({
            images: businessShowCaseFile,
          });
          if (!showcaseResult.success) {
            return true;
          }
          return true;
        case 2:
          // Validate category selection
          if (!selectedCategoryId || selectedSubcategoryIds.length === 0) {
            toast.error('Validation Error', {
              description:
                'Please select a category and at least one subcategory.',
            });
            return false;
          }
          return true;
        case 3:
          // Amenities - optional step, always allow to continue
          return true;
        case 4:
          // Services step - only validate if not skipping
          if (services.length === 0) {
            // Allow skipping
            return true;
          }
          // Services - validate using schema
          const servicesResult = servicesZodSchema.safeParse({
            services: services,
          });
          if (!servicesResult.success) {
            const errorMessage =
              servicesResult.error.issues[0]?.message ||
              'Please add at least one service.';
            toast.error('Validation Error', {
              description: errorMessage,
            });
            return false;
          }
          return true;
        case 5:
          // Location validation using schema
          if (!location) {
            toast.error('Validation Error', {
              description: 'Please provide your business location information.',
            });
            return false;
          }

          const locationResult = locationZodSchema.safeParse(location);
          if (!locationResult.success) {
            const errorMessage =
              locationResult.error.issues[0]?.message ||
              'Please complete the location information.';
            toast.error('Validation Error', {
              description: errorMessage,
            });
            return false;
          }
          return true;
        case 6:
          // Contact validation (location already validated in step 5)
          if (!contactInfo || !contactInfo.phone_number) {
            toast.error('Validation Error', {
              description: 'Please provide your phone number.',
            });
            return false;
          }
          return true;
        default:
          return true;
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation Error', {
        description: 'An error occurred during validation. Please try again.',
      });
      return false;
    }
  };

  const handleContinue = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      switch (pageNumber) {
        case 0:
          // Trigger introduction form submission (has built-in validation)
          if (introFormRef.current) {
            await introFormRef.current.submit();
          }
          break;
        case 1:
          // Validate and handle showcase submission
          if (validateCurrentStep()) {
            await handleShowCaseFormsSubmission({
              business_id: businessId,
              images: businessShowCaseFile,
            });
          }
          break;
        case 2:
          // Validate and handle categories submission
          if (validateCurrentStep()) {
            await handleCategoryFormsSubmission();
          }
          break;
        case 3:
          // Validate and handle amenities submission
          if (validateCurrentStep()) {
            await handleAmenitiesFormsSubmission();
          }
          break;
        case 4:
          if (validateCurrentStep()) {
            await handleServicesFormsSubmission();
          }
          break;
        case 5:
          // Location validation only
          if (validateCurrentStep()) {
            await handleLocationValidation();
          }
          break;
        case 6:
          // Combined location and contact submission
          if (validateCurrentStep()) {
            await handleLocationAndContactSubmission();
          }
          break;
        default:
          setPageNumber(prev => prev + 1);
          break;
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = (): void => {
    if (pageNumber > 0) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      setStep(newPageNumber);
    }
  };

  const steps = [
    {
      id: 0,
      title: 'Introduce us to your business',
      subtitle:
        'This is the name, website, and description customers will see.',
      component: (
        <BusinessIntroductionForm
          ref={introFormRef}
          onSuccess={handleIntroductionFormSuccess}
        />
      ),
    },
    {
      id: 1,
      title: 'Showcase Your Business',
      subtitle:
        'Showcase your business by uploading multiple photos but only 1 video.',
      component: (
        <BusinessShowCaseForm
          setBusinessShowCaseFile={setBusinessShowCaseFile}
        />
      ),
    },
    {
      id: 2,
      title: 'Select categories that best describe your business',
      subtitle: 'Select business category',
      component: (
        <BusinessCategoryForm
          onCategorySelected={handleCategorySelection}
          selectedCategoryId={selectedCategoryId}
          selectedSubcategoryIds={selectedSubcategoryIds}
          subcategoryCount={subcategoryCount}
        />
      ),
    },
    {
      id: 3,
      title: 'Add your business amenities',
      subtitle:
        'Select the amenities your business offers from the list of available options.',
      component: (
        <BusinessAmenities
          setSelectedAmenities={setSelectedAmenities}
          selectedAmenityIds={selectedAmenities}
        />
      ),
    },
    {
      id: 4,
      title: 'Add business services',
      subtitle:
        'Showcase your services to attract the right clients and boost bookings.',
      component: <BusinessServicesForm onServicesChange={(e)=>setServices(e)} />,
    },
    {
      id: 5,
      title: 'Set your location address',
      subtitle: 'Add your business location to help clients find you easily.',
      component: (
        <BusinessLocationForm
          setLocation={setLocation}
          initialLocation={location ?? undefined}
        />
      ),
    },
    {
      id: 6,
      title: 'Complete your contact & business details',
      subtitle: 'Add your contact info and registration number for trust.',
      component: (
        <BusinessContactAndBusiness
          setContactInfo={setContactInfo}
          initialContactInfo={contactInfo ?? undefined}
        />
      ),
    },
  ];

  const currentStep = steps[pageNumber];

  return (
    <div className=''>
      {/* Progress Bar */}
      <div className='px-4 py-4 sm:px-6'>
        <div className='mx-auto max-w-5xl'>
          <div className='mb-2 flex items-center justify-between text-sm'>
            <span className='sr-only font-medium text-gray-900'>
              Step {pageNumber + 1} of {steps.length}
            </span>
          </div>
          <div className='flex gap-2'>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index <= pageNumber ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='px-4 py-4 sm:px-6'>
        <div className='mx-auto flex max-w-5xl items-center justify-between'>
          <Logo textColor={'black'} />
          <div className='flex items-center gap-4'>
            {pageNumber > 1 && (
              <Button
                variant='black'
                onClick={handleBack}
                className='flex items-center font-medium'
                disabled={isSubmitting}
                size='xl'
              >
                <ArrowLeftIconBlackSm />
                Back
              </Button>
            )}

            <Button
              onClick={handleContinue}
              disabled={isSubmitting}
              isloading={isSubmitting}
              className='flex items-center gap-2 max-md:hidden'
              size='xl'
            >
              {isSubmitting && <Loader />}
              {getButtonText()}
              {!isSubmitting && <ArrowRightIconWhite />}
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className='mx-auto px-4 py-8 sm:px-6'>
        <header className='mx-auto mb-6 max-w-xl lg:mb-12'>
          <p className='mb-5 font-inter text-sm text-[#4B5565]'>
            Business account setup
          </p>
          <h2 className='font-karma text-2xl font-semibold text-gray-900 lg:text-4xl'>
            {currentStep?.title}
          </h2>
          <p className='mt-2 text-sm text-[#000000]'>{currentStep?.subtitle}</p>
        </header>
        {currentStep?.component}
      </div>

      {/* Footer Actions */}
      <div className='mx-auto flex max-w-xl items-center justify-between px-4 py-4 sm:px-6'>
        <Button
          onClick={handleContinue}
          disabled={isSubmitting}
          isloading={isSubmitting}
          className='flex w-full items-center gap-2 md:hidden'
          size='xl'
        >
          {getButtonText()}
          {!isSubmitting && <ArrowRightIconWhite />}
        </Button>
      </div>
    </div>
  );
};

export default BusinessStepForm;
