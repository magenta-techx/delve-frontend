import React from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Form, Formik } from 'formik';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { amenitySchema } from '@/schemas/businessSchema';
// import Input from '@/components/ui/Input';
// import { Form } from 'formik';
// // Formik
// import { Button } from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { amenitySchema } from '@/schemas/businessSchema';

interface BusinessAmenetiesProps {
  amenity: string | File;
  amenities: string[];
  setAmenities: (value: string[]) => void;
  setAmenity: (value: string | File) => void;
}
const BusinessAmeneties = ({
  setAmenities,
  amenity,
  setAmenity,
  amenities,
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
  const handleAdd = (): void => {
    if (typeof amenity === 'string' && amenity?.length >= 4) {
      setAmenities([...amenities, amenity]);
    }
  };
  return (
    <div className='sm:w-[400px]'>
      {' '}
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Add your business ameneties'
        paragraph='Select the ameneties your business offers from the list of available options'
      />
      <Formik
        initialValues={{}}
        validationSchema={amenitySchema}
        onSubmit={values => {
          console.log(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form className='mt-4 flex w-full flex-col gap-3'>
            <Input
              name='amenity'
              label='Amenities (Optional)'
              onChange={(e: string | File) => {
                // setFieldValue('amenity', e);
                setAmenity(e);
              }}
            />
          </Form>
        )}
      </Formik>
      {/* <Formik
        initialValues={{
          amenity: '',
        }}
        validationSchema={amenitySchema}
        onSubmit={(values, { resetForm }) => {
          // if (pageNumber === 1) {
          //   return handleSubmit(values);
          // }
          // return undefined;
          setAmenities(prev => [...prev, values.amenity]);
          resetForm();
          console.log(values);
        }}
      >
        {() => ( */}
      {/* <Form className='mt-4 flex w-full flex-col gap-3'> */}
      {/* Fields */}
      <>
        {/* <Input
            name='amenity'
            type='text'
            label='Amenities'
            className='w-full'
            placeholder='Type here to add'

            // onChange={e => setAmenity(e.target.value)}
          /> */}
        <div className='mb-4 grid grid-cols-2 gap-x-7 gap-y-4 sm:grid-cols-3'>
          {amenities.map((amenity, key) => (
            <div
              key={key}
              className='relative rounded-lg border border-gray-200 bg-neutral-50 px-4 py-2 text-xs text-black text-primary'
            >
              {amenity}
              <button
                type='button'
                onClick={() => {
                  setAmenities(amenities.filter(a => a !== amenity));
                }}
                className='absolute -left-4 top-[6px] flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white'
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className='w-[120px]'>
          <Button type='button' onClick={handleAdd}>
            {' '}
            + Add
          </Button>
        </div>
      </>
      {/* </Form> */}
      {/* )}
      </Formik> */}
    </div>
  );
};

export default BusinessAmeneties;
