'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories, useSubcategories } from '@/app/(business)/misc/api/business';
import { Button } from '@/components/ui/Button';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryId: number, subcategoryIds: number[]) => void;
  categoryId: number | null;
  existingSubcategoryIds?: number[];
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryId,
  existingSubcategoryIds = []
}) => {
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);
  
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubcategories(categoryId);

  // Reset selections when modal opens/closes or initialize with existing selections
  useEffect(() => {
    if (!isOpen) {
      setSelectedSubcategoryIds([]);
    } else if (categoryId) {
      // Only keep existing subcategory selections if we're editing the same category
      setSelectedSubcategoryIds(existingSubcategoryIds);
    }
  }, [isOpen, categoryId, existingSubcategoryIds]);

  const toggleSubcategory = (subcategoryId: number) => {
    setSelectedSubcategoryIds(prev => 
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleSubmit = () => {
    if (categoryId && selectedSubcategoryIds.length > 0) {
      onSubmit(categoryId, selectedSubcategoryIds);
      onClose();
    }
  };

  if (!isOpen) return null;

  // If we have a categoryId, show subcategories directly
  if (categoryId) {
    const selectedCategory = categories.find(c => c.id === categoryId);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <h2 className="mb-2 text-2xl md:text-3xl font-semibold font-karma text-balance text-[#0F0F0F]">
            Choose your {selectedCategory?.name.toLowerCase()} business type
          </h2>
          <p className="mb-8 text-gray-600 ">
            Select the subcategories that best describe your {selectedCategory?.name.toLowerCase()} business
          </p>

          {subcategoriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {subcategories.map((subcategory) => {
                  const isSelected = selectedSubcategoryIds.includes(subcategory.id);
                  
                  return (
                    <button
                      key={subcategory.id}
                      type="button"
                      onClick={() => toggleSubcategory(subcategory.id)}
                      className={cn(
                        'rounded-lg border px-4 py-3 text-left transition-all duration-200',
                        isSelected
                          ? 'border-[#A48AFB] bg-[#FBFAFF] text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subcategory.name}</span>
                        {isSelected && (
                          <div className="size-3 rounded-full bg-[#A48AFB]"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={selectedSubcategoryIds.length === 0}
                size="lg"
              >
                Submit & Continue
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return null;
};

export default CategorySelectionModal;