'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import ArrowRightIconWhite from '@/assets/icons/ArrowRightIconWhite';

import BusinessIntroductionForm from './CreateListingFormStep1Introduction';
import BusinessShowCaseForm from './CreateListingFormStep2Showcase';
import BusinessCategoryForm from './CreateListingFormStep3Category';
import BusinessAmenities from './CreateListingFormStep4Amenities';
import BusinessServicesForm from './CreateListingFormStep5Services';
import BusinessLocationForm from './CreateListingFormStep6Location';
import BusinessContactAndBusiness from './CreateListingFormStep7Contact';
import CreateListingFormStep8Success from './CreateListingFormStep8Success';
import { BusinessShowCaseProps } from '@/types/business/types';
import { useBusinessRegistrationStore } from '@/stores/businessRegistrationStore';
import ArrowLeftIconBlackSm from '@/assets/icons/ArrowLeftIconBlackSm';

import {
  useUploadBusinessImages,
  useUpdateBusinessAmenities,
  useUpdateBusinessCategory,
  useUpdateLocationAndContact,
  useCreateServices,
  useUpdateService,
  useOngoingBusinessOnboarding,
  useDeleteBusinessImages,
} from '@/app/(business)/misc/api/business';
import { Logo } from '@/assets/icons';
import {
  servicesZodSchema,
  locationZodSchema,
} from '@/schemas/businessZodSchema';
import { toast } from 'sonner';
import z from 'zod';

export type CreateListingLocation = z.infer<typeof locationZodSchema>;
const BusinessStepForm = (): JSX.Element => {
  type IntroFormHandle = {
    submit: () => Promise<void>;
    isValid: () => boolean;
  };

  const introFormRef = useRef<IntroFormHandle | null>(null);

  const {
    business_registration_step: savedStep,
    business_id: currentBusinessId,
    setStep,
    setBusinessId,
  } = useBusinessRegistrationStore();

  // Fetch ongoing onboarding data
  const {
    data: onboardingData,
    isLoading: isLoadingOnboarding,
    refetch: refetchOnboarding,
  } = useOngoingBusinessOnboarding();

  // API hooks
  const uploadImagesMutation = useUploadBusinessImages();
  const deleteImagesMutation = useDeleteBusinessImages();
  const createServicesMutation = useCreateServices();
  const updateServiceMutation = useUpdateService();
  const updateAmenitiesMutation = useUpdateBusinessAmenities();
  const updateLocationMutation = useUpdateLocationAndContact();
  const updateCategoryMutation = useUpdateBusinessCategory();

  const [pageNumber, setPageNumber] = useState(savedStep);
  const [businessShowCaseFile, setBusinessShowCaseFile] = useState<File[]>([]);
  const [cloudImages, setCloudImages] = useState<
    { id: number; image: string; uploaded_at: string }[]
  >([]);
  const [initialCloudImages, setInitialCloudImages] = useState<
    { id: number; image: string; uploaded_at: string }[]
  >([]);

  // Services: Cloud (from onboarding) and Local (newly created)
  interface CloudService {
    id: number;
    title: string;
    description: string;
    image: string;
    uploaded_at: string;
  }

  interface LocalService {
    title: string;
    description?: string;
    image?: File | null;
  }

  const [cloudServices, setCloudServices] = useState<CloudService[]>([]);
  const [initialCloudServices, setInitialCloudServices] = useState<
    CloudService[]
  >([]);
  const [localServices, setLocalServices] = useState<LocalService[]>([]);

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

  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    Array.isArray(onboardingData?.data?.amenities) 
      ? onboardingData.data.amenities.map(amenity => amenity.id) 
      : []
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    onboardingData?.data?.category?.id || null
  );
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<
    number[]
  >(
    Array.isArray(onboardingData?.data?.category?.subcategories)
      ? onboardingData.data.category.subcategories.map(sub => sub.id)
      : []
  );
  const [subcategoryCount, setSubcategoryCount] = useState<number>(
    Array.isArray(onboardingData?.data?.category?.subcategories)
      ? onboardingData.data.category.subcategories.length
      : 0
  );

  // Old services state kept for backward compatibility - combines cloud and local
  const [services, setServices] = useState<
    {
      title: string;
      description?: string;
      image?: File | null;
    }[]
  >([]);

  const [location, setLocation] = useState<CreateListingLocation | null>(null);
  const [contactInfo, setContactInfo] = useState<CombinedContactInfo | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [businessId, setLocalBusinessId] = useState<number | undefined>(
    currentBusinessId ?? undefined
  );
  const [isIntroFormValid, setIsIntroFormValid] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // Map onboarding phases to step numbers
  const phaseToStepMap: Record<string, number> = {
    introduction: 1,
    media: 2,
    categories: 3,
    amenities: 4,
    services: 5,
    location: 6,
    contact_and_socials: 7,
  };

  // Initialize form from onboarding data
  useEffect(() => {
    if (!isLoadingOnboarding && onboardingData?.data) {
      // Check if data is a valid object (not an array or empty)
      if (Array.isArray(onboardingData.data) || typeof onboardingData.data !== 'object') {
        // Data is empty or invalid, just mark first load as done
        if (isFirstLoad) {
          setIsFirstLoad(false);
        }
        return;
      }

      const onboarding = onboardingData.data;

      // Set business ID
      if (onboarding.id) {
        setLocalBusinessId(onboarding.id);
        setBusinessId(onboarding.id);
      }

      // Set the current step based on onboarding phase - ONLY on first load
      if (isFirstLoad) {
        const stepFromPhase = onboarding.onboarding_phase 
          ? (phaseToStepMap[onboarding.onboarding_phase] ?? 0)
          : 0;
        setPageNumber(stepFromPhase);
        setStep(stepFromPhase);
        setIsFirstLoad(false);
      }

      // Pre-populate form fields based on available data
      if (onboarding.category?.id) {
        setSelectedCategoryId(onboarding.category.id);
      }

      if (Array.isArray(onboarding.category?.subcategories) && onboarding.category.subcategories.length > 0) {
        setSelectedSubcategoryIds(onboarding.category.subcategories.map(sub => sub.id));
        setSubcategoryCount(onboarding.category.subcategories.length);
      }

      // Set amenities from onboarding
      if (Array.isArray(onboarding.amenities) && onboarding.amenities.length > 0) {
        setSelectedAmenities(onboarding.amenities.map(amenity => amenity.id));
      }

      // Set location from onboarding
      if (onboarding.state || onboarding.address) {
        setLocation({
          state: onboarding.state || '',
          address: onboarding.address || '',
          operates_without_location: !onboarding.address,
          latitude: undefined,
          longitude: undefined,
        });
      }

      // Set contact info from onboarding
      if (
        onboarding.phone_number ||
        onboarding.registration_number ||
        onboarding.social_links
      ) {
        setContactInfo({
          phone_number: onboarding.phone_number || '',
          registration_number: onboarding.registration_number || '',
          whatsapp_link: onboarding.social_links?.whatsapp || '',
          facebook_link: onboarding.social_links?.facebook || '',
          instagram_link: onboarding.social_links?.instagram || '',
          twitter_link: onboarding.social_links?.twitter || '',
          tiktok_link: onboarding.social_links?.tiktok || '',
        });
      }

      // Set cloud images from onboarding
      if (Array.isArray(onboarding.images) && onboarding.images.length > 0) {
        setInitialCloudImages(onboarding.images);
        setCloudImages(onboarding.images);
      }

      // Set cloud services from onboarding
      if (Array.isArray(onboarding.services) && onboarding.services.length > 0) {
        setInitialCloudServices(onboarding.services);
        setCloudServices(onboarding.services);
      }

      // Note: Services, images, and other complex data should be handled
      // by the individual form components that fetch and manage them
    } else if (isFirstLoad && isLoadingOnboarding === false) {
      // Only mark first load as done if we're not loading and have no data
      setIsFirstLoad(false);
    }
  }, [onboardingData, isLoadingOnboarding, setBusinessId, setStep]);

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
    if (!businessId) {
      toast.error('Error', {
        description:
          'Business ID not found. Please try again from the beginning.',
      });
      return;
    }

    try {
      // Determine which cloud images were deleted
      // by comparing initial IDs with current IDs
      const deletedImageIds: number[] = [];
      const currentImageIds = new Set(cloudImages.map(img => img.id));

      for (const img of initialCloudImages) {
        if (!currentImageIds.has(img.id)) {
          deletedImageIds.push(img.id);
        }
      }

      // If there are deletions, call the delete endpoint
      if (deletedImageIds.length > 0) {
        await deleteImagesMutation.mutateAsync({
          image_ids: deletedImageIds,
        });
      }

      // Upload new local images
      if (values.images && values.images.length > 0) {
        await uploadImagesMutation.mutateAsync({
          business_id: businessId,
          images: values.images,
        });
      }

      toast.success('Step completed!', {
        description: 'Showcase images saved successfully.',
      });

      // Refetch onboarding data after step change
      await refetchOnboarding();

      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.log('Request failed:', error);
      toast.error('Error', {
        description: `Error submitting showcase. ${error}`,
      });
    }
    setIsSubmitting(false);
  };

  // Step 3: Categories
  const handleCategorySelection = (
    categoryId: number,
    subcategoryIds: number[]
  ) => {
    // If categoryId is 0 or falsy, clear selection
    if (!categoryId) {
      setSelectedCategoryId(null);
      setSelectedSubcategoryIds([]);
      setSubcategoryCount(0);
      return;
    }

    // If changing to a different category, clear previous subcategories
    if (categoryId !== selectedCategoryId) {
      setSelectedCategoryId(categoryId);
      setSelectedSubcategoryIds(subcategoryIds);
      setSubcategoryCount(subcategoryIds.length);
    } else {
      // Same category, just update subcategories
      setSelectedSubcategoryIds(subcategoryIds);
      setSubcategoryCount(subcategoryIds.length);
    }
  };

  const handleCategoryFormsSubmission = async (): Promise<void> => {
    if (
      !businessId ||
      !selectedCategoryId ||
      selectedSubcategoryIds.length === 0
    ) {
      await handleStepComplete();
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
      await handleStepComplete();
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      await handleStepComplete();
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
        await handleStepComplete();
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
      await handleStepComplete();
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      await handleStepComplete();
      toast.error('New Error', {
        description: `Error updating amenities. ${error}`,
      });
    }
    setIsSubmitting(false);
  };

  // Step 5: Services
  const handleServicesFormsSubmission = async (): Promise<void> => {
    if (!businessId) {
      await handleStepComplete();
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
      setIsSubmitting(false);
      return;
    }

    try {
      // Determine which cloud services were edited
      // by comparing initial cloud services with current cloud services
      const editedCloudServices: typeof cloudServices = [];

      for (const service of cloudServices) {
        const initialService = initialCloudServices.find(
          s => s.id === service.id
        );
        if (initialService) {
          // Check if title, description, or image changed
          const titleChanged = service.title !== initialService.title;
          const descriptionChanged =
            service.description !== initialService.description;
          const imageFileAdded = 'imageFile' in service && service.imageFile;

          if (titleChanged || descriptionChanged || imageFileAdded) {
            editedCloudServices.push(service);
          }
        }
      }

      // Update edited cloud services
      if (editedCloudServices.length > 0) {
        for (const service of editedCloudServices) {
          const updateData: any = {
            business_id: businessId,
            service_id: service.id,
            service: {
              title: service.title,
              description: service.description,
            },
          };
          // If image was changed (has imageFile), include it
          if ('imageFile' in service && service.imageFile) {
            updateData.service.image = service.imageFile;
          }

          await updateServiceMutation.mutateAsync(updateData);
        }
      }

      // Create new local services
      if (localServices.length > 0) {
        // Transform services to ensure description is always present and image is undefined instead of null
        const servicesWithDescription = localServices.map(service => ({
          ...service,
          description: service.description || '',
          image: !!service.image ? service.image : null,
        }));

        await createServicesMutation.mutateAsync({
          business_id: businessId,
          services: servicesWithDescription,
        });
      }

      toast.success('Step completed!', {
        description: 'Business services saved successfully.',
      });
      await handleStepComplete();
      setStep(pageNumber + 1);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.log('Request failed:', error);
      await handleStepComplete();
      toast.error('Error', {
        description: 'Error saving services. Please try again.',
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
      const errormessage =
        locationResult.error.issues[0]?.message ||
        'Please complete the location information.';
      toast.error('Validation Error', {
        description: errormessage,
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

      await handleStepComplete();

      // Move to success page (step 7)
      setStep(7);
      setPageNumber(7);
    } catch (error) {
      console.log('Request failed:', error);
      await handleStepComplete();
      toast.error('Error', {
        description: 'Error updating information. Please try again.',
      });
    }
    setIsSubmitting(false);
  };

  const getButtonText = (): string => {
    // Success page (step 7) - don't show button
    if (pageNumber === 7) {
      return '';
    }

    if (pageNumber === 6) {
      return 'Submit';
    }

    if (
      (pageNumber === 3 && selectedAmenities.length === 0) ||
      (pageNumber === 4 && services.length === 0 && cloudServices.length === 0)
    ) {
      return 'Skip';
    }

    return 'Continue';
  };

  // Check if current step is valid (for button disabled state)
  const isCurrentStepValid = (): boolean => {
    switch (pageNumber) {
      case 0:
        // Introduction form validation from state
        return isIntroFormValid;
      case 1:
        // Showcase - optional, always valid
        return true;
      case 2:
        // Category - requires selection
        return !!(selectedCategoryId && selectedSubcategoryIds.length > 0);
      case 3:
        // Amenities - optional, always valid
        return true;
      case 4:
        // Services - optional or must be valid
        if (services.length === 0) return true;
        const servicesResult = servicesZodSchema.safeParse({ services });
        return servicesResult.success;
      case 5:
        // Location - required and must be valid
        if (!location) return false;
        const locationResult = locationZodSchema.safeParse(location);
        return locationResult.success;
      case 6:
        // Contact - requires phone number
        return !!(contactInfo && contactInfo.phone_number);
      case 7:
        // Success page - always valid (no button shown anyway)
        return true;
      default:
        return true;
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
          // Showcase - allow skipping if no images
          await handleShowCaseFormsSubmission({
            business_id: businessId,
            images: businessShowCaseFile,
          });
          break;
        case 2:
          // Validate category selection
          if (!selectedCategoryId || selectedSubcategoryIds.length === 0) {
            toast.error('Validation Error', {
              description:
                'Please select a category and at least one subcategory.',
            });
            setIsSubmitting(false);
            return;
          }
          await handleCategoryFormsSubmission();
          break;
        case 3:
          // Amenities - optional step
          await handleAmenitiesFormsSubmission();
          break;
        case 4:
          // Services - validate if services exist
          if (services.length > 0) {
            const servicesResult = servicesZodSchema.safeParse({
              services: services,
            });
            if (!servicesResult.success) {
              const errormessage =
                servicesResult.error.issues[0]?.message ||
                'Please add at least one service.';
              toast.error('Validation Error', {
                description: errormessage,
              });
              setIsSubmitting(false);
              return;
            }
          }
          await handleServicesFormsSubmission();
          break;
        case 5:
          // Location validation
          if (!location) {
            toast.error('Validation Error', {
              description: 'Please provide your business location information.',
            });
            setIsSubmitting(false);
            return;
          }

          const locationResult = locationZodSchema.safeParse(location);
          if (!locationResult.success) {
            const errormessage =
              locationResult.error.issues[0]?.message ||
              'Please complete the location information.';
            toast.error('Validation Error', {
              description: errormessage,
            });
            setIsSubmitting(false);
            return;
          }
          await handleLocationValidation();
          break;
        case 6:
          // Contact validation
          if (!contactInfo || !contactInfo.phone_number) {
            toast.error('Validation Error', {
              description: 'Please provide your phone number.',
            });
            setIsSubmitting(false);
            return;
          }
          await handleLocationAndContactSubmission();
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
    // Don't allow going back from success page
    if (pageNumber === 7) {
      return;
    }
    if (pageNumber > 0) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      setStep(newPageNumber);
    }
  };

  // Refetch onboarding data after step changes (but not on initial load)
  const handleStepComplete = async (): Promise<void> => {
    if (!isFirstLoad) {
      await refetchOnboarding();
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
          onValidationChange={setIsIntroFormValid}
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
          setCloudImages={setCloudImages}
          initialCloudImages={initialCloudImages}
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
      component: (
        <BusinessServicesForm
          onServicesChange={e => setServices(e)}
          onLocalServicesChange={setLocalServices}
          initialCloudServices={initialCloudServices}
          cloudServices={cloudServices}
          onCloudServicesChange={setCloudServices}
        />
      ),
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
    {
      id: 7,
      title: 'Your business profile has been submitted!',
      subtitle: '',
      component: (
        <CreateListingFormStep8Success
          businessId={businessId}
        />
      ),
    },
  ];

  const currentStep = steps[pageNumber];

  return (
    <div className=''>
      {isLoadingOnboarding && (
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='mb-4 inline-block'>
              <Logo textColor={'black'} />
            </div>
            <p className='text-gray-600'>Loading your onboarding progress...</p>
          </div>
        </div>
      )}

      {!isLoadingOnboarding && (
        <>
          {/* Progress Bar - Hidden on success page */}
          {pageNumber !== 7 && (
            <div className='px-4 py-4 sm:px-6'>
              <div className='mx-auto max-w-5xl'>
                <div className='mb-2 flex items-center justify-between text-sm'>
                  <span className='sr-only font-medium text-gray-900'>
                    Step {pageNumber + 1} of {steps.length - 1}
                  </span>
                </div>
                <div className='flex gap-2'>
                  {steps.slice(0, -1).map((_, index) => (
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
          )}
          {/* Header and Buttons - Hidden on success page */}
          {pageNumber !== 7 && (
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

                  {getButtonText() && (
                    <Button
                      onClick={handleContinue}
                      disabled={isSubmitting || !isCurrentStepValid()}
                      isloading={isSubmitting}
                      className='flex items-center gap-2 max-md:hidden'
                      size='xl'
                    >
                      {getButtonText()}
                      {!isSubmitting && <ArrowRightIconWhite />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Logo on success page */}
          {pageNumber === 7 && (
            <div className='px-4 py-4 sm:px-6'>
              <div className='mx-auto max-w-5xl'>
                <Logo textColor={'black'} />
              </div>
            </div>
          )}
          {/* Content */}
          <div className='mx-auto px-4 py-8 sm:px-6'>
            {pageNumber !== 7 && (
              <header className='mx-auto mb-6 max-w-xl lg:mb-12'>
                <p className='mb-5 font-inter text-sm text-[#4B5565]'>
                  Business account setup
                </p>
                <h2 className='font-karma text-2xl font-semibold text-gray-900 lg:text-4xl'>
                  {currentStep?.title}
                </h2>
                <p className='mt-2 text-sm text-[#000000]'>
                  {currentStep?.subtitle}
                </p>
              </header>
            )}
            {currentStep?.component}
          </div>

          {/* Footer Actions - Hidden on success page */}
          {pageNumber !== 7 && getButtonText() && (
            <div className='mx-auto flex max-w-xl items-center justify-between px-4 py-4 sm:px-6'>
              <Button
                onClick={handleContinue}
                disabled={isSubmitting || !isCurrentStepValid()}
                isloading={isSubmitting}
                className='flex w-full items-center gap-2 md:hidden'
                size='xl'
              >
                {getButtonText()}
                {!isSubmitting && <ArrowRightIconWhite />}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessStepForm;
