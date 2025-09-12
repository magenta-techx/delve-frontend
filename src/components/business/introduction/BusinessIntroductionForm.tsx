'use client';
import React, { useRef, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import Input from '@/components/ui/Input';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import TextArea from '@/components/ui/TextArea';
import { businessIntroductionSchema } from '@/schemas/businessSchema';
import Image from 'next/image';

type FormProps<T extends FormikValues> = {
  formikRef: React.Ref<FormikProps<T>>;
  initialValues: T;
  onSubmit: (values: T) => void;
};

function BusinessIntroductionForm<T extends FormikValues>({
  formikRef,
  initialValues,
  onSubmit,
}: FormProps<T>): JSX.Element {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const convertToBase64 = (
  //   file: File
  // ): Promise<string | ArrayBuffer | null> => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(file);
  //     fileReader.onload = (): void => {
  //       resolve(fileReader.result);
  //     };
  //     fileReader.onerror = (error): void => {
  //       reject(error);
  //     };
  //   });
  // };

  return (
    <div className='sm:w-[400px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Introduce us to your business'
        paragraph='This is the name, website, and description customers will see.'
      />
      <Formik<T>
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={businessIntroductionSchema}
      >
        {({ setFieldValue }) => (
          <Form className='mt-3 w-full'>
            <div className='flex flex-col gap-1 sm:items-center'>
              <div className='my-4 flex w-full items-end justify-start gap-3 text-xs font-medium'>
                <Input
                  ref={fileInputRef}
                  name='logo'
                  type='file'
                  accepts='image/*'
                  className='hidden'
                  onChange={file => {
                    console.log('fiel is :', typeof file);
                    if (typeof file === 'object') {
                      // ✅ update Formik field
                      setFieldValue('logo', file);

                      // ✅ generate preview
                      const previewUrl = URL.createObjectURL(file);
                      setPreview(previewUrl);
                    }
                  }}
                />
                {preview ? (
                  <Image
                    src={preview}
                    alt='Business preview'
                    className='mt-2 h-24 w-24 rounded object-cover'
                    height={100}
                    width={200}
                  />
                ) : (
                  <div
                    className='flex h-20 w-36 items-center justify-center rounded-md border border-dashed border-primary hover:cursor-pointer sm:h-24 sm:w-24'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className=''>
                      <p className='text-primary'>Upload logo</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className='mb-3 w-full text-gray-600 sm:w-[235px]'>
                    .png, .jpeg up to 8MB. Recommended size is 256 x 256
                  </p>
                  {preview && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      type='button'
                      className='rounded-sm border border-primary-50 bg-neutral px-2 py-1 text-primary'
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              <Input
                name='business_name'
                type='text'
                label='Business name'
                className='w-full'
              />

              <TextArea
                name='description'
                label='About business'
                className='w-full'
                maxLength={250}
              />

              <Input
                name='website'
                type='text'
                label={
                  <>
                    Website <span className='text-[#6A6A6A]'>(Optional)</span>
                  </>
                }
                placeholder='https://www.your_domain.com'
                className='w-full'
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessIntroductionForm;
