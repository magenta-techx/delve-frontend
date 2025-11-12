import React, { useEffect, useState } from 'react';
import BusinessIntroductionFormHeader from './BusinessFormHeader';
import { Button } from '@/components/ui/Button';
import CancleIcon from '@/assets/icons/CancelIcon';
import {
  BusinessCategoryIcons,
  IconsType,
} from '@/assets/icons/business/BusinessCategoriesIcon';
import Loader from '@/components/ui/Loader';
import { useBusinessRegistrationStore } from '@/stores/businessRegistrationStore';

interface SubCategoriesProps {
  id: number;
}

// interface CategoriesProps {
//   id: number;
//   icon_name: string;
//   name: string;
//   subcategories: SubCategoriesProps[];
// }

interface BusinessCategoryFormProps {
  setPageNumber: (value: number) => void;
  businessId: number | undefined;
  setShowSubBusinessCategories: (value: boolean) => void;
}
interface Category {
  id: number | undefined;
  icon_name: string;
  name: string;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
}

const BusinessCategoryForm = ({
  setPageNumber,
  businessId,
  setShowSubBusinessCategories,
}: BusinessCategoryFormProps): JSX.Element => {
  const { setStep, setBusinessId } = useBusinessRegistrationStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: undefined,
    icon_name: '',
    name: '',
    subcategories: [],
  });
  const [selectedSubCategories, setSelectSubCategories] = useState<number[]>(
    []
  );
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingcategories, setIsloadingCategories] =
    useState<boolean>(false);
  const [isSendingCategories, setIsSendingCategories] =
    useState<boolean>(false);

  const hanldeSelectCategorySubmittion = async (values: {
    category_id: number | undefined;
    subcategory_ids: number[];
  }): Promise<void> => {
    try {
      setIsSendingCategories(true);
      if (businessId) {
        const res = await fetch('/api/business/business-categories/', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business_id: businessId, values }),
        });
        console.log(res);
        setShowSubBusinessCategories(false);
        setIsSendingCategories(false);
        setPageNumber(3);
        setStep(3);
        if (businessId) setBusinessId(businessId);
      }
    } catch (error) {
      console.log(error);
      setPageNumber(2);
    }
  };

  const handleSubCategories = ({ id }: SubCategoriesProps): void => {
    const exists = selectedSubCategories.includes(id);

    if (exists) {
      setSelectSubCategories(
        selectedSubCategories.filter(subCatId => subCatId !== id)
      );
    } else {
      setSelectSubCategories([...selectedSubCategories, id]);
    }
  };

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      setIsloadingCategories(true);
      try {
        const res = await fetch(`/api/business/business-categories`);
        if (!res.ok) throw new Error(`Error fetching categories`);

        const data = await res.json();

        // ✅ if API returns an array
        setCategories(data?.data ?? []);

        // ✅ if API returns a single object, wrap it
        // setCategories([data?.data]);

        console.log('categories: ', data?.data);
      } catch (error) {
        console.error(error);
      }

      setIsloadingCategories(false);
    };

    fetchCategories();
  }, []);

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
        {isLoadingcategories ? (
          <div className='flex items-center gap-1'>
            <Loader borderColor='border-primary' /> Loading categories...
          </div>
        ) : categories.length ? (
          categories.map((category, key) => {
            const icon = category?.name
              ?.split(' ')[0]
              ?.toLowerCase() as IconsType;

            return (
              <button
                key={key}
                className={`flex flex-col gap-1 rounded-md border bg-white px-4 py-3 text-left text-[11px] font-semibold uppercase sm:text-xs ${selectedCategory.id === category.id ? 'border-white bg-neutral-50 text-primary sm:border-primary' : ''} ${showSubCategories && selectedCategory.id !== category.id ? 'border-white text-gray-400' : 'border-gray-400'}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowSubCategories(true);
                  setShowSubBusinessCategories(true);
                }}
              >
                <BusinessCategoryIcons value={icon} />
                <small className=''>{category.icon_name}</small>
                <h1 className=''>{category.name}</h1>
              </button>
            );
          })
        ) : (
          ''
        )}
        {selectedCategory.id && showSubCategories ? (
          <div className='absolute top-0 flex h-full sm:w-full sm:items-center sm:justify-center'>
            <div className='rounded-md bg-white sm:min-h-[280px] sm:w-[480px] sm:p-5 sm:shadow-2xl'>
              <div className='flex w-full justify-end'>
                <button
                  className='hidden sm:flex'
                  onClick={() => {
                    setShowSubCategories(false);
                    setShowSubBusinessCategories(false);
                  }}
                >
                  <CancleIcon />
                </button>
              </div>
              <BusinessIntroductionFormHeader
                header={`Choose your ${selectedCategory.name} business type`}
                paragraph={`Select the categories taht best describe your ${selectedCategory.name.toLocaleLowerCase()} business`}
              />
              <div className='mb-8 mt-5 grid h-[500px] grid-cols-1 gap-x-7 overflow-y-scroll sm:h-auto sm:grid-cols-2 sm:gap-y-4 sm:overflow-y-hidden'>
                {selectedCategory.subcategories.length > 1 &&
                  selectedCategory.subcategories.map((category, key) => (
                    <button
                      key={key}
                      className={`${
                        selectedSubCategories.includes(category.id)
                          ? 'border-primary bg-neutral-50 text-primary'
                          : 'border-gray-400'
                      } flex h-[48px] w-full items-center justify-between truncate rounded-md border bg-white px-4 text-left text-xs font-semibold capitalize sm:w-[200px] sm:py-3`}
                      onClick={() => handleSubCategories(category)}
                    >
                      <p>{category.name}</p>
                      {selectedSubCategories.includes(category.id) && (
                        <div className='h-[6px] w-[6px] rounded-full bg-primary'></div>
                      )}
                    </button>
                  ))}
              </div>
              <div
                className='absolute h-[100px] w-full py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:relative sm:-bottom-0 sm:h-auto sm:w-[200px] sm:bg-transparent sm:shadow-none'
                onClick={() =>
                  hanldeSelectCategorySubmittion({
                    category_id: selectedCategory.id,
                    subcategory_ids: selectedSubCategories,
                  })
                }
              >
                <Button className='text-xs'>
                  {isSendingCategories ? (
                    <span className='flex items-center gap-1'>
                      <Loader />
                      Submitting...
                    </span>
                  ) : (
                    'Submit & Continue'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default BusinessCategoryForm;
