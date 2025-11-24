'use client';
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { UploadIcon } from '../icons';

interface Service {
  title: string;
  description: string;
  image: File | null;
  imagePreview?: string;
}

interface CreateServicesProps {
  onServicesChange?: (services: Service[]) => void;
  onSubmit?: (services: Service[]) => void;
}

const CreateServices: React.FC<CreateServicesProps> = ({
  onServicesChange,
  onSubmit
}) => {
  const [services, setServices] = useState<Service[]>([
    { title: '', description: '', image: null }
  ]);

  // Helper to update parent whenever services change
  const updateParent = (newServices: Service[]) => {
    setServices(newServices);
    onServicesChange?.(newServices);
  };

  const addService = () => {
    const newServices = [
      ...services,
      { title: '', description: '', image: null }
    ];
    updateParent(newServices);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      const newServices = services.filter((_, i) => i !== index);
      updateParent(newServices);
    }
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    const newServices = services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    );
    updateParent(newServices);
  };

  // Get services ready for submission (only complete ones)
  const getValidServices = () => {
    return services.filter(service => 
      service.title.trim() !== '' && service.description.trim() !== ''
    );
  };

  // Submit handler
  const handleSubmit = () => {
    const validServices = getValidServices();
    if (validServices.length > 0) {
      onSubmit?.(validServices);
    }
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) {
      updateService(index, 'image', null);
      updateService(index, 'imagePreview', undefined);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateService(index, 'imagePreview', reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Store the file
    updateService(index, 'image', file);
  };

  return (
    <div className='mx-auto max-w-xl space-y-6'>
      <div className='divide-y divide-[#CDD5DF] space-y-8'>
        {services.map((service, index) => (
          <div key={index} className='pb-8 pt-5'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='font-inter text-sm font-semibold text-gray-900'>
                Service {index + 1}
              </h3>
              {services.length > 1 && (
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
                  onChange={e => updateService(index, 'title', e.target.value)}
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
                  onChange={e => updateService(index, 'description', e.target.value)}
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
                          <span className='flex items-center justify-center px-4 py-1.5 rounded-full bg-white text-black text-sm font-medium'>
                            Click to change
                          </span>
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
                        updateService(index, 'image', null);
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
        ))}
      </div>

      <Button
        type='button'
        variant='unstyled'
        size='sm'
        onClick={addService}
        className='border-2 !border-[#A48AFB]'
      >
        <Plus size={20} className='mr-2' />
        Add Service
      </Button>

      {/* Submit Section */}
      {getValidServices().length > 0 && (
        <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-green-800'>
                {getValidServices().length} service{getValidServices().length !== 1 ? 's' : ''} ready for submission
              </p>
              <p className='mt-1 text-xs text-green-600'>
                All required fields are completed
              </p>
            </div>
            {onSubmit && (
              <Button
                onClick={handleSubmit}
                className='bg-green-600 hover:bg-green-700 text-white'
              >
                Submit Services
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateServices;
