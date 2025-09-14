import React, { useEffect, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Form, Formik } from 'formik';
import Input from '@/components/ui/Input';
import { amenitySchema } from '@/schemas/businessSchema';
import { BusinessAmenitiesTypeProp } from '@/types/business/types';
// import Input from '@/components/ui/Input';
// import { Form } from 'formik';
// // Formik
// import { Button } from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { amenitySchema } from '@/schemas/businessSchema';

interface amenitiesType {
  id: number | null;
  icon_name: string;
  name: string;
}

interface BusinessAmenetiesProps {
  // amenity: string | File;
  selectedAmenities: BusinessAmenitiesTypeProp[];
  setSelectedAmenities: (value: BusinessAmenitiesTypeProp[]) => void;
}

const BusinessAmeneties = ({
  setSelectedAmenities,

  selectedAmenities,
}: BusinessAmenetiesProps): JSX.Element => {
  // Grab Formik values
  // const { values, setFieldValue } = useFormikContext<{
  //   amenity: string;
  // }>();
  // const AMENITY_LIST = [
  //   {
  //     icon:<
  //   }
  // ]

  const [amenities, setAmenities] = useState<amenitiesType[]>([
    {
      id: null,
      icon_name: '',
      name: '',
    },
  ]);
  const handleAdd = (amenity: amenitiesType): void => {
    setSelectedAmenities([...selectedAmenities, amenity]);
  };

  useEffect(() => {
    const fetchAmenities = async (): Promise<void> => {
      try {
        const res = await fetch('/api/business/business-amenities', {
          method: 'GET',
        });

        const data = await res.json();
        console.log('amenities: ', data);
        if (data?.status) {
          setAmenities(data?.data);
        }
      } catch (error) {
        console.log('Error amennities: ', error);
      }
    };
    fetchAmenities();
  }, []);
  return (
    <div className='sm:w-[400px]'>
      {' '}
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Add your business ameneties'
        paragraph='Select the ameneties your business offers from the list of available options'
      />
      <Formik
        initialValues={{ name: '' }}
        validationSchema={amenitySchema}
        onSubmit={values => {
          const { name } = values;
          setSelectedAmenities([
            ...selectedAmenities,
            { name: name, id: 0, icon_name: '' },
          ]);
        }}
      >
        {({ setFieldValue, errors }) => (
          <Form className='mt-4 flex w-full flex-col gap-3'>
            <Input
              name='name'
              label='Amenities (Optional)'
              onChange={(e: string | File) => {
                if (typeof e === 'string') {
                  setFieldValue('name', e);
                }
              }}
            />
            {errors.name && (
              <div className='text-sm text-red-600'>{errors.name}</div>
            )}
          </Form>
        )}
      </Formik>
      <div className='mb-2 grid grid-cols-2 gap-x-7 gap-y-4 sm:grid-cols-3'>
        {selectedAmenities.length > 0 &&
          selectedAmenities.map((amenity, key) => (
            <div
              key={key}
              className='relative rounded-lg border border-gray-200 bg-neutral-50 px-4 py-2 text-xs text-black text-primary'
            >
              <span className='truncate text-sm'>{amenity.name} </span>
              <button
                type='button'
                onClick={() => {
                  setSelectedAmenities(
                    selectedAmenities.filter(a => a !== amenity)
                  );
                }}
                className='absolute -left-4 top-[6px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white'
              >
                X
              </button>
            </div>
          ))}
      </div>
      {amenities && (
        <div className='flex flex-col justify-start gap-4 rounded-md bg-neutral py-3 shadow-md lg:w-[50%]'>
          {amenities.map((amenity, key) => {
            return (
              <button
                key={key}
                onClick={() => handleAdd(amenity)}
                className='flex items-center px-10 text-left text-sm capitalize focus:text-primary'
              >
                <span>{amenity?.icon_name}</span>
                <span className='truncate'>{amenity?.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BusinessAmeneties;
