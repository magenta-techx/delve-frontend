import React, { useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Button } from '@/components/ui/Button';

interface SubCategoriesProps {
  id: number;
  title: string;
}

interface CategoriesProps {
  id: number;
  icon: string;
  title: string;
  subCategories: SubCategoriesProps[];
}

interface BusinessCategoryFormProps {
  setPageNumber: (value: number) => void;
}

const BusinessCategoryForm = ({
  setPageNumber,
}: BusinessCategoryFormProps): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<CategoriesProps>({
    id: 0,
    icon: '',
    title: '',
    subCategories: [],
  });
  const [selectedSubCategories, setSelectSubCategories] = useState<
    SubCategoriesProps[]
  >([{ id: 0, title: '' }]);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const BUSINESS_CATEGORIES = [
    {
      id: 1,
      icon: '',
      title: 'Beauty',
      subCategories: [
        {
          id: 1,
          title: 'Barber Shops',
        },
        {
          id: 2,
          title: 'Makeup Artist',
        },
        {
          id: 3,
          title: 'Hair retails / brands',
        },
        {
          id: 4,
          title: 'Makeup brands',
        },
        {
          id: 5,
          title: 'Hair care brands',
        },
        {
          id: 6,
          title: 'Nail studio / technicians',
        },
        {
          id: 7,
          title: 'Laser beauty clinic',
        },
        {
          id: 8,
          title: 'salon & hair stylist',
        },
        {
          id: 9,
          title: 'lash & brow studio',
        },
        {
          id: 10,
          title: 'skincare brand / shops',
        },
        {
          id: 11,
          title: 'make up & beauty shops',
        },
        {
          id: 12,
          title: 'spas and wellness',
        },
      ],
    },
    {
      id: 2,
      icon: '',
      title: 'branding & printing',
      subCategories: [],
    },
    {
      id: 3,
      icon: '',
      title: 'business',
      subCategories: [],
    },
    {
      id: 4,
      icon: '',
      title: 'health & fitness',
      subCategories: [],
    },
    {
      id: 5,
      icon: '',
      title: 'clothing & fashion',
      subCategories: [],
    },
    {
      id: 6,
      icon: '',
      title: 'education',
      subCategories: [],
    },
    {
      id: 7,
      icon: '',
      title: 'electronics',
      subCategories: [],
    },
    {
      id: 8,
      icon: '',
      title: 'entertainment & leisure',
      subCategories: [],
    },
    {
      id: 9,
      icon: '',
      title: 'event',
      subCategories: [],
    },
    {
      id: 10,
      icon: '',
      title: 'food',
      subCategories: [],
    },
    {
      id: 11,
      icon: '',
      title: 'housing & accommodation',
      subCategories: [],
    },
    {
      id: 12,
      icon: '',
      title: 'kids',
      subCategories: [],
    },
    {
      id: 13,
      icon: '',
      title: 'logistics',
      subCategories: [],
    },
    {
      id: 14,
      icon: '',
      title: 'media & production',
      subCategories: [],
    },
    {
      id: 15,
      icon: '',
      title: 'night life',
      subCategories: [],
    },
    {
      id: 16,
      icon: '',
      title: 'pr & advertising',
      subCategories: [],
    },
    {
      id: 17,
      icon: '',
      title: 'sanitation',
      subCategories: [],
    },
    {
      id: 18,
      icon: '',
      title: 'shopping',
      subCategories: [],
    },
    {
      id: 19,
      icon: '',
      title: 'sport',
      subCategories: [],
    },
    {
      id: 20,
      icon: '',
      title: 'travel',
      subCategories: [],
    },
  ];

  const hanldeSelectCategorySubmittion = async (values: {
    id: number;
    subCategories: SubCategoriesProps[];
  }): Promise<void> => {
    try {
      const res = await fetch('/api/auth/category', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });

      console.log(res);
    } catch (error) {
      console.log(error);
      setPageNumber(3);
    }
    setPageNumber(3);
  };

  const handleSubCategories = ({ id, title }: SubCategoriesProps): void => {
    const selectedSubCategoryExists = selectedSubCategories.some(
      subCat => subCat.id === id
    );
    if (selectedSubCategoryExists) {
      return setSelectSubCategories(
        selectedSubCategories.filter(category => category.id != id)
      );
    }
    setSelectSubCategories([...selectedSubCategories, { id, title }]);
  };
  return (
    <div className='relative'>
      <div className='flex w-full justify-center'>
        <BusinessIntroductionFormHeader
          intro={'Business account setup'}
          header='Select category that best describe your business '
          paragraph='Select business category'
        />
      </div>
      <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {BUSINESS_CATEGORIES.map((category, key) => {
          return (
            <button
              key={key}
              className={`rounded-md border bg-white px-4 py-3 text-left text-[11px] font-semibold uppercase sm:text-xs ${selectedCategory.id === category.id ? 'border-white bg-neutral-50 text-primary sm:border-primary' : ''} ${showSubCategories && selectedCategory.id !== category.id ? 'border-white text-gray-400' : 'border-gray-400'}`}
              onClick={() => {
                setSelectedCategory(category);
                setShowSubCategories(true);
              }}
            >
              <small className=''>icon</small>
              <h1 className=''>{category.title}</h1>
            </button>
          );
        })}
        {selectedCategory.id && showSubCategories && (
          <div className='absolute top-0 flex h-full sm:w-full sm:items-center sm:justify-center'>
            <div className='rounded-md bg-white sm:min-h-[280px] sm:w-[480px] sm:p-5 sm:shadow-2xl'>
              <button
                className='hidden sm:flex'
                onClick={() => setShowSubCategories(false)}
              >
                x
              </button>
              <BusinessIntroductionFormHeader
                header={`Choose your ${selectedCategory.title} business type`}
                paragraph={`Select the categories taht best describe your ${selectedCategory.title} business`}
              />
              <div className='mb-8 mt-5 grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2'>
                {selectedCategory.subCategories.map((category, key) => {
                  return (
                    <button
                      key={key}
                      className={`${selectedSubCategories.some(subCat => subCat.id === category.id) ? 'border-primary bg-neutral-50 text-primary' : 'border-gray-400'} flex w-full items-center justify-between truncate rounded-md border bg-white px-4 py-3 text-left text-xs font-semibold capitalize sm:w-[200px]`}
                      onClick={() => handleSubCategories(category)}
                    >
                      <p>{category.title}</p>
                      {selectedSubCategories.some(
                        subCat => subCat.id === category.id
                      ) && (
                        <div className='h-[6px] w-[6px] rounded-full bg-primary'></div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div
                className='w-full sm:w-[200px]'
                onClick={() =>
                  hanldeSelectCategorySubmittion({
                    id: selectedCategory.id,
                    subCategories: selectedSubCategories,
                  })
                }
              >
                <Button className='text-xs'>Submit & Continue</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCategoryForm;
