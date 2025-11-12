'use client';
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { UploadIcon } from '../icons';

interface Service {
  title: string;
  description: string;
  image?: string | undefined; 
  imagePreview?: string | undefined; 
}

// Type for parent component (API-compatible)
interface ApiService {
  title: string;
  description: string;
  image?: string | undefined;
}

interface BusinessServicesFormProps {
  setServices: (services: ApiService[]) => void;
  initialServices?: ApiService[];
}

const BusinessServicesForm: React.FC<BusinessServicesFormProps> = ({
  setServices,
  initialServices = [],
}) => {
  const [servicesList, setServicesList] = useState<Service[]>(
    initialServices.length > 0 
      ? initialServices.map(service => ({ ...service, imagePreview: undefined }))
      : [{ title: '', description: '', image: undefined, imagePreview: undefined }]
  );

  const addService = () => {
    const newServices = [
      ...servicesList,
      { title: '', description: '', image: undefined, imagePreview: undefined },
    ];
    setServicesList(newServices);
    // Send only API-compatible data to parent
    const apiServices = newServices.map(({ imagePreview, ...service }) => service);
    setServices(apiServices);
  };

  const removeService = (index: number) => {
    if (servicesList.length > 1) {
      const newServices = servicesList.filter((_, i) => i !== index);
      setServicesList(newServices);
      const apiServices = newServices.map(({ imagePreview, ...service }) => service);
      setServices(apiServices);
    }
  };

  const updateService = (
    index: number,
    field: keyof Service,
    value: string | undefined
  ) => {
    console.log('updateService called', { index, field, value: field === 'imagePreview' ? 'base64 data...' : value });
    
    const newServices = servicesList.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    );
    console.log('newServices after update:', newServices.map((s, i) => ({ index: i, hasImagePreview: !!s.imagePreview })));
    
    setServicesList(newServices);
    // Send only API-compatible data to parent
    const apiServices = newServices.map(({ imagePreview, ...service }) => service);
    setServices(apiServices);
  };

  const getValidServicesCount = () => {
    return servicesList.filter(
      service =>
        service.title.trim() !== '' && service.description.trim() !== ''
    ).length;
  };

  const isServiceValid = (service: Service) => {
    return service.title.trim() !== '' && service.description.trim() !== '';
  };

  const handleImageUpload = (index: number, file: File | null) => {
    console.log('handleImageUpload called', { index, file: file?.name });
    
    if (!file) {
      const newServices = servicesList.map((service, i) =>
        i === index ? { ...service, image: undefined, imagePreview: undefined } : service
      );
      setServicesList(newServices);
      const apiServices = newServices.map(({ imagePreview, ...service }) => service);
      setServices(apiServices);
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      
      console.log('File converted to base64, updating both fields for index:', index);
      
      // Update both fields in a single state update
      const newServices = servicesList.map((service, i) =>
        i === index ? { ...service, imagePreview: base64String, image: base64Data } : service
      );
      console.log('newServices after single update:', newServices.map((s, i) => ({ index: i, hasImagePreview: !!s.imagePreview })));
      
      setServicesList(newServices);
      const apiServices = newServices.map(({ imagePreview, ...service }) => service);
      setServices(apiServices);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='mx-auto max-w-xl space-y-6'>
      <div className='divide-y divide-[#CDD5DF] space-y-8'>
        {servicesList.map((service, index) => {
          const isValid = isServiceValid(service);
          return (
            <div
              key={index}
              // className={`rounded-lg border-2 bg-gray-50 p-6 transition-colors ${
              //   isValid ? 'border-green-200 bg-green-50' : 'border-gray-200'
              // }`}
              className='pb-8 pt-5  '
            >
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-inter text-sm font-semibold text-gray-900'>
                    Service {index + 1}
                  </h3>
                  {isValid && (
                    <div className='flex items-center text-green-600'>
                      <svg
                        className='h-4 w-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='ml-1 text-xs'>Complete</span>
                    </div>
                  )}
                </div>
                {servicesList.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeService(index)}
                    className='h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700'
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor={`service-title-${index}`}
                    className='mb-2 block font-inter text-sm font-medium text-gray-700'
                  >
                    Service Title *
                  </label>
                  <Input
                    id={`service-title-${index}`}
                    placeholder='e.g., Hair Cut, Web Design, Consultation'
                    value={service.title}
                    onChange={e =>
                      updateService(index, 'title', e.target.value)
                    }
                    className='w-full'
                  />
                </div>

                <div>
                  <label
                    htmlFor={`service-description-${index}`}
                    className='mb-2 block font-inter text-sm font-medium text-gray-700'
                  >
                    Description *
                  </label>
                  <Textarea
                    id={`service-description-${index}`}
                    placeholder='Describe what this service includes and what clients can expect...'
                    value={service.description}
                    onChange={e =>
                      updateService(index, 'description', e.target.value)
                    }
                    rows={4}
                    className='w-full'
                  />
                </div>

                <div>
                  <label
                    htmlFor={`service-image-${index}`}
                    className='mb-2 block font-inter text-sm font-medium text-gray-700'
                  >
                    Service Image (Optional)
                  </label>
                  <div className='relative'>
                    <input
                      type='file'
                      id={`service-image-${index}`}
                      accept='image/*'
                      onChange={e => {
                        const file = e.target.files?.[0] || null;
                        handleImageUpload(index, file);
                      }}
                      className='hidden'
                    />
                    <label
                      htmlFor={`service-image-${index}`}
                      className='flex h-[10.5rem] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-purple-400 hover:bg-purple-50'
                    >
                      {service.imagePreview ? (
                        <div className='relative h-full w-full rounded-lg overflow-hidden'>
                          <img
                            src={service.imagePreview}
                            alt='Service preview'
                            className='h-full w-full object-cover rounded-lg'
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                            <span className='flex items-center justify-center px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium'>Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center space-x-2 text-gray-500'>
                          <UploadIcon className='h-12 w-12 text-purple-600' />
                          <span className='text-sm'>Click to upload image</span>
                        </div>
                      )}
                    </label>
                    {service.imagePreview && (
                      <button
                        type='button'
                        onClick={() => {
                          updateService(index, 'image', undefined);
                          updateService(index, 'imagePreview', undefined);
                        }}
                        className='absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 z-10'
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

        <Button
          type='button'
          variant='unstyled'
          size='sm'
          onClick={addService}
          className='border-2 !border-[#A48AFB]'
        >
          <Plus size={20} className='mr-2' />
          Add
        </Button>

      {servicesList.length > 0 && (
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-blue-800'>
                {getValidServicesCount()} of {servicesList.length} service
                {servicesList.length !== 1 ? 's' : ''} ready
              </p>
              <p className='mt-1 text-xs text-blue-600'>
                Services need both title and description to be complete
              </p>
            </div>
            {getValidServicesCount() > 0 && (
              <div className='text-green-600'>
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessServicesForm;
