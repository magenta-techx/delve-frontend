'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { FieldArray, Form, useFormikContext, FormikContextType } from 'formik';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Service {
  service_title: string;
  description: string;
  image: File | null;
}
interface FormValues {
  services: Service[];
}

type ServiceItemProps = {
  service: Service;
  index: number;
  fileInputRefs: React.MutableRefObject<
    Record<number, HTMLInputElement | null>
  >; // ✅ fixed extra '>'
  setFieldValue: FormikContextType<FormValues>['setFieldValue']; // ✅ no 'any'
  remove: (index: number) => void;
  canRemove: boolean;
};

const ServiceItemComponent = ({
  service,
  index,
  fileInputRefs,
  setFieldValue,
  remove,
  canRemove,
}: ServiceItemProps): JSX.Element => {
  // Stable preview URL for the selected file
  const imageUrl = useMemo(
    () => (service.image ? URL.createObjectURL(service.image) : null),
    [service.image]
  );

  // Revoke blob URL when it changes/unmounts
  useEffect(() => {
    return (): void => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className='flex flex-col gap-3'>
      <Input
        name={`services[${index}].service_title`}
        type='text'
        label='Title of Service'
        className='w-full'
      />

      <TextArea
        name={`services[${index}].description`}
        label='Description'
        className='w-full'
        placeholder='Write a description'
        maxLength={250}
      />

      {imageUrl ? (
        <div className='relative mt-2 flex h-[200px] w-full items-center justify-center'>
          <Image
            src={imageUrl}
            alt='Service Preview'
            width={100}
            height={100}
            className='h-[200px] w-full rounded-md object-cover'
            unoptimized
            priority={false}
          />

          {/* Hidden input per service to change the file */}
          <input
            ref={el => {
              fileInputRefs.current[index] = el ?? null;
            }}
            type='file'
            multiple={false}
            accept='image/png, image/jpeg, image/jpg'
            className='hidden'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] ?? null;
              setFieldValue(`services[${index}].image`, file);
            }}
          />

          <button
            className='absolute w-[100px] rounded-full bg-white p-2 text-sm font-medium shadow-md'
            onClick={() => fileInputRefs.current[index]?.click()}
            type='button'
          >
            Change
          </button>
        </div>
      ) : (
        <FileUpload
          label='Service Image'
          mutipleUploads={false}
          onFileSelect={files =>
            setFieldValue(`services[${index}].image`, files?.[0] ?? null)
          }
        />
      )}

      {canRemove && (
        <Button
          type='button'
          variant='destructive'
          onClick={() => remove(index)}
        >
          Remove
        </Button>
      )}
    </div>
  );
};

const ServiceItem = React.memo(ServiceItemComponent);
ServiceItem.displayName = 'ServiceItem'; // ✅ satisfies react/display-name

const BusinessServicesForm = (): JSX.Element => {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro='Business account setup'
        header='Add Business Services'
        paragraph='Showcase your services to attract the right clients and boost bookings'
      />

      <Form className='mt-3 w-full'>
        <FieldArray name='services'>
          {({ push, remove }) => (
            <div className='flex flex-col gap-6'>
              {values.services.map((service, index) => (
                <ServiceItem
                  key={index}
                  service={service}
                  index={index}
                  fileInputRefs={fileInputRefs}
                  setFieldValue={setFieldValue}
                  remove={remove}
                  canRemove={values.services.length > 1}
                />
              ))}

              <div className='w-[70px]'>
                {' '}
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='border border-gray-200 bg-transparent text-primary hover:bg-transparent'
                  onClick={() =>
                    push({ service_title: '', description: '', image: null })
                  }
                >
                  + Add
                </Button>
              </div>
            </div>
          )}
        </FieldArray>
      </Form>
    </div>
  );
};

export default BusinessServicesForm;
