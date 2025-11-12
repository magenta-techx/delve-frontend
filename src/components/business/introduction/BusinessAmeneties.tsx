import React, { useEffect, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
// import { amenitySchema } from '@/schemas/businessSchema';
import { BusinessAmenitiesTypeProp } from '@/types/business/types';
import Amenity from '@/assets/icons/business/Amenity';
import Loader from '@/components/ui/Loader';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';
import { amenityZodSchema } from '@/schemas/businessZodSchema';
import { z } from 'zod';

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
  const [isLoadingAmenities, setIsloadingAmenities] = useState<boolean>(false);
  // const [isSendingCategories, setIsSendingCategories] =
  //   useState<boolean>(false);
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
        setIsloadingAmenities(true);
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
      setIsloadingAmenities(false);
    };
    fetchAmenities();
  }, []);
  type AmenityInput = z.infer<typeof amenityZodSchema>;
  const methods = useForm<AmenityInput>({
    resolver: zodResolver(amenityZodSchema),
    defaultValues: { amenity: '' },
    mode: 'onTouched',
  });

  const { setValue, watch } = methods;
  const selectedAmenityName = watch('amenity');

  return (
    <div className='sm:w-[500px]'>
      {' '}
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Add your business ameneties'
        paragraph='Select the ameneties your business offers from the list of available options'
      />
      <FormProvider {...methods}>
        <form className='mt-4 flex w-full flex-col gap-3' onSubmit={e => e.preventDefault()}>
          <Input
            type='text'
            value={selectedAmenityName ?? ''}
            disabled={true}
            placeholder='click to select amenities'
            label='Amenities (Optional)'
            readOnly
          />
        </form>
      </FormProvider>
      <div className='mb-2 grid grid-cols-2 gap-x-7 gap-y-4 sm:grid-cols-3'>
        {selectedAmenities.length
          ? selectedAmenities.map((amenity, key) => (
              <div
                key={key}
                className='relative flex items-center gap-2 rounded-lg border border-gray-200 bg-neutral-50 px-4 py-2 text-xs text-black text-primary'
              >
                <span>{<Amenity />}</span>
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
                  <BusinessCategoryIcons value='close' />
                </button>
              </div>
            ))
          : ''}
      </div>
      {isLoadingAmenities ? (
        <div className='flex w-full items-center gap-1'>
          <Loader borderColor='border-primary' /> Loading amenities...
        </div>
      ) : (
        amenities.length && (
          <div className='flex flex-col justify-start gap-4 rounded-md bg-neutral py-3 shadow-md lg:w-[50%]'>
            {amenities.map((amenity, key) => {
              return (
                <button
                  key={key}
                  onClick={() => {
                    handleAdd(amenity);
                    setValue('amenity', amenity.name);
                  }}
                  className='flex items-center px-10 text-left text-sm capitalize focus:text-primary'
                >
                  <span>{amenity?.icon_name}</span>
                  <span className='truncate'>{amenity?.name}</span>
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default BusinessAmeneties;
