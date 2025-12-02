'use client';
import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import CategorySelectionModal from './CreateListingFormStep3CategorySelectionModal';
import { useCategories } from '@/app/(business)/misc/api/business';
import {
  AccessoriesIcon,
  BrandingIcon,
  BusinessIcon,
  ClothingIcon,
  EducationIcon,
  ElectronicsIcon,
  EntertainmentIcon,
  EventsIcon,
  FitnessIcon, 
  FoodIcon, 
  HousingIcon, 
  KidsIcon, 
  LogisticsIcon, 
  MarketingIcon, 
  MediaIcon, 
  NightLifeIcon, 
  SanitationIcon, 
  ShoppingIcon, 
  SportsIcon, 
  TravelIcon  } from '../icons/categories';

interface BusinessCategoryFormProps {
  onCategorySelected: (categoryId: number, subcategoryIds: number[]) => void;
  selectedCategoryId: number | null;
  selectedSubcategoryIds: number[];
  subcategoryCount: number;
}

// Icon mapping for categories
const getCategoryIcon = (categoryName: string): ReactNode => {
  const iconMap: Record<string, ReactNode> = {
    'accessories': <AccessoriesIcon />,
    'beauty': <ClothingIcon />,
    'branding': <BrandingIcon />,
    'branding & printing': <BrandingIcon />,
    'business': <BusinessIcon />,
    'health': <FitnessIcon />,
    'clothing': <ClothingIcon />,
    'education': <EducationIcon />,
    'electronics': <ElectronicsIcon />,
    'entertainment': <EntertainmentIcon />,
    'events': <EventsIcon />,
    'food': <FoodIcon />,
    'housing': <HousingIcon />,
    'kids': <KidsIcon />,
    'logistics': <LogisticsIcon />,
    'media': <MediaIcon />,
    'night': <NightLifeIcon />,
    'pr': <MarketingIcon />,
    'sanitation': <SanitationIcon />,
    'shopping': <ShoppingIcon />,
    'sports': <SportsIcon />,
    'travel': <TravelIcon />
  };
  
  const key = categoryName.toLowerCase().split(' ')[0];
  return iconMap[key as keyof typeof iconMap] || <BusinessIcon />;
};

const BusinessCategoryForm: React.FC<BusinessCategoryFormProps> = ({
  onCategorySelected,
  selectedCategoryId: parentSelectedCategoryId,
  selectedSubcategoryIds: parentSelectedSubcategoryIds,
  subcategoryCount,
}) => {
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: categories = [], isLoading: categoriesLoading, error } = useCategories();

  const handleCategoryClick = (categoryId: number) => {
    // If clicking the same category that's already selected, deselect it
    if (parentSelectedCategoryId === categoryId) {
      onCategorySelected(0, []); // Clear selection (use 0 or null to indicate no selection)
      setCurrentCategoryId(null);
      return;
    }
    
    // If clicking a different category, open modal (subcategories will be cleared)
    setCurrentCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (categoryId: number, subcategoryIds: number[]) => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    if (selectedCategory) {
      onCategorySelected(categoryId, subcategoryIds);
      setIsModalOpen(false);
      setCurrentCategoryId(null);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div>
        
          <p className="text-gray-600 mb-6">
            Loading categories...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <p className="text-red-600 mb-6">
            Error loading categories. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto">
        

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {categories.map((category) => {
            const isSelected = parentSelectedCategoryId === category.id;
            const isOtherCategorySelected = parentSelectedCategoryId && parentSelectedCategoryId !== category.id;
            
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  'flex justify-between rounded-xl border p-4 text-left transition-all duration-200 relative',
                  isSelected
                    ? 'border-purple-500 bg-purple-100 text-[#551FB9] hover:border-purple-600'
                    : isOtherCategorySelected
                    ? 'border-gray-200 bg-gray-100 text-gray-400 opacity-50 hover:opacity-70'
                    : 'border-[#E6E6E6] bg-white text-[#131316] hover:border-purple-300 hover:bg-purple-50'
                )}
              >
                <div className="flex flex-col gap-3">
                    <span className="text-xl">{getCategoryIcon(category.name)}</span>
                  <span className="font-medium text-xs sm:text-sm font-inter">{category.name.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isSelected && subcategoryCount > 0 && (
                    <div className="bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {subcategoryCount}
                    </div>
                  )}
                  {isSelected && (
                    <div className="h-4 w-4 rounded-full bg-purple-600"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <CategorySelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentCategoryId(null);
        }}
        onSubmit={handleModalSubmit}
        categoryId={currentCategoryId}
        existingSubcategoryIds={
          currentCategoryId === parentSelectedCategoryId ? parentSelectedSubcategoryIds : []
        }
      />
    </>
  );
};

export default BusinessCategoryForm;