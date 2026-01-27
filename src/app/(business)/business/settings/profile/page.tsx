'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import SelectSingleSimple from '@/components/ui/SelectSingleSimple';
import { useBusinessContext } from '@/contexts/BusinessContext';
import {
  useCategories,
  useSubcategories,
  useAmenities,
  useUpdateBusinessCategory,
  useUpdateBusinessAmenities,
  useUpdateBusiness,
} from '@/app/(business)/misc/api/business';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LinkButton } from '@/components/ui';
import { GalleryIcon } from '@/app/(clients)/misc/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogoLoadingIcon } from '@/assets/icons';
import { AmenitiesModal } from '@/app/(business)/misc/components/AmenitiesModal';

interface EditableField {
  id: string;
  value: string | string[] | number | number[];
  displayValue?: string | undefined;
}

export default function ProfileSettings() {
  const {
    currentBusiness,
    refetchBusinesses,
    isLoading: isLoadingBusinesses,
  } = useBusinessContext();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, EditableField>>(
    {}
  );
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // Fetch categories, subcategories, and amenities
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const { data: subcategories = [], isLoading: subcategoriesLoading } =
    useSubcategories(selectedCategoryId);
  const { data: amenities = [], isLoading: amenitiesLoading } = useAmenities();

  // Mutations
  const { mutate: updateBusiness, isPending: isUpdating } = useUpdateBusiness();
  const updateCategoryMutation = useUpdateBusinessCategory();
  const updateAmenitiesMutation = useUpdateBusinessAmenities();

  // Set the category ID when current business changes
  useEffect(() => {
    if (currentBusiness?.category?.id) {
      setSelectedCategoryId(currentBusiness.category.id);
    }
  }, [currentBusiness]);

  const handleEdit = useCallback(
    (
      field: string,
      currentValue: string | string[] | number | number[],
      displayValue?: string
    ) => {
      setEditingField(field);

      // For category field, set the selected category for subcategories fetching
      if (field === 'category' && typeof currentValue === 'number') {
        setSelectedCategoryId(currentValue);
      }

      setFieldValues(prev => ({
        ...prev,
        [field]: {
          id: field,
          value: currentValue,
          displayValue: displayValue || undefined,
        },
      }));
    },
    []
  );

  const handleCancel = useCallback(() => {
    setEditingField(null);
    setFieldValues({});
    setShowImageSelector(false);
    setShowSubcategoryModal(false);
    setShowAmenitiesModal(false);

    if (currentBusiness?.category?.id) {
      setSelectedCategoryId(currentBusiness.category.id);
    }
  }, [currentBusiness]);

  const handleFieldChange = useCallback(
    (field: string, newValue: string | string[] | number | number[]) => {
      setFieldValues(prev => {
        const existingField = prev[field];
        if (!existingField) return prev;
        if (field === 'category' && typeof newValue === 'number') {
          setSelectedCategoryId(newValue);
        }

        return {
          ...prev,
          [field]: {
            id: existingField.id,
            value: newValue,
            displayValue: existingField.displayValue,
          },
        };
      });
    },
    []
  );

  const handleSave = useCallback(
    (field: string) => {
      if (!currentBusiness?.id) {
        toast.error('No business selected');
        return;
      }

      const businessId = currentBusiness.id;
      const value = fieldValues[field]?.value;

      switch (field) {
        case 'category':
          if (typeof value === 'number') {
            // When saving category, also need to save subcategories if they exist
            const subcategoryIds =
              currentBusiness.subcategories?.map(s => s.id) || [];
            updateCategoryMutation.mutate(
              {
                business_id: businessId,
                category_id: value,
                subcategory_ids: subcategoryIds,
              },
              {
                onSuccess: () => {
                  toast.success('Category updated successfully');
                  setEditingField(null);
                  setFieldValues({});
                  refetchBusinesses();
                },
                onError: () => {
                  toast.error('Failed to update category');
                },
              }
            );
          }
          break;
        case 'subCategories':
          if (Array.isArray(value) && currentBusiness.category?.id) {
            updateCategoryMutation.mutate(
              {
                business_id: businessId,
                category_id: currentBusiness.category.id,
                subcategory_ids: value as number[],
              },
              {
                onSuccess: () => {
                  toast.success('Subcategories updated successfully');
                  setEditingField(null);
                  setFieldValues({});
                  setShowSubcategoryModal(false);
                  refetchBusinesses();
                },
                onError: () => {
                  toast.error('Failed to update subcategories');
                },
              }
            );
          }
          break;
        case 'amenities':
          if (Array.isArray(value)) {
            updateAmenitiesMutation.mutate(
              {
                business_id: businessId,
                amenities_ids: value as number[],
              },
              {
                onSuccess: () => {
                  toast.success('Amenities updated successfully');
                  setEditingField(null);
                  setFieldValues({});
                  setShowAmenitiesModal(false);
                  refetchBusinesses();
                },
                onError: () => {
                  toast.error('Failed to update amenities');
                },
              }
            );
          }
          break;
        default:
          console.log(`Saving ${field}:`, value);
          setEditingField(null);
          setFieldValues({});
          setShowImageSelector(false);
      }
    },
    [
      fieldValues,
      currentBusiness,
      updateCategoryMutation,
      updateAmenitiesMutation,
      refetchBusinesses,
    ]
  );

  // Helper function to get category name
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'No category selected';
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || 'Unknown category';
  };
  const getBusinessImages = () => {
    if (!currentBusiness?.images) return [];
    return currentBusiness.images.map(img =>
      typeof img === 'string' ? img : img.image
    );
  };

  // Helper function to get current profile picture
  const getCurrentProfilePicture = () => {
    return (
      currentBusiness?.thumbnail ||
      currentBusiness?.logo ||
      getBusinessImages()[0] ||
      null
    );
  };

  if (isLoadingBusinesses) {
    return (
      <div className='flex h-full min-h-[40vh] flex-col items-center justify-center text-center text-muted-foreground'>
        <LogoLoadingIcon />
      </div>
    );
  }
  if (!currentBusiness) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        No business selected
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='space-y-8'>
        {/* Profile Picture */}
        <section className='flex grid-cols-[240px,1fr] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:items-end lg:py-8 xl:grid xl:gap-12'>
          <div className='items-between flex flex-col'>
            <Label className='text-sm font-medium text-[#0F0F0F]'>
              Profile Picture
            </Label>
            <div className=''>
              <p className='mb-1.5 text-xs text-gray-500'>
                Select from your uploads
              </p>

              <Button
                size='sm'
                isLoading={isUpdating}
                variant='outline'
                onClick={() => setShowImageSelector(true)}
                className='w-max border-primary bg-[#FBFAFF] text-primary hover:bg-purple-50 max-lg:hidden'
              >
                <GalleryIcon /> Change
              </Button>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative flex aspect-[15/5] !max-h-[350px] w-full items-center justify-center overflow-hidden rounded-lg border bg-gray-100'>
              {getCurrentProfilePicture() ? (
                <Image
                  src={getCurrentProfilePicture()!}
                  alt='Profile Picture'
                  fill
                  className='object-cover'
                />
              ) : (
                <span className='text-xl font-semibold text-gray-400'>
                  {currentBusiness.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          <Button
            size='sm'
            variant='outline'
            onClick={() => setShowImageSelector(true)}
            className='border-primary bg-[#FBFAFF] text-primary hover:bg-purple-50 lg:hidden'
          >
            <GalleryIcon /> Change
          </Button>
        </section>

        {/* Gallery */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>Gallery</Label>

          <LinkButton
            href='/business/settings/gallery'
            size='sm'
            variant='outline'
            className='w-max border-primary bg-[#FBFAFF] text-primary'
          >
            View and upload
          </LinkButton>
        </section>

        {/* Business Categories */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Business Category
          </Label>

          {editingField === 'category' ? (
            <div className='flex-1'>
              <SelectSingleSimple
                name='category'
                placeholder='Select a category'
                value={String(
                  (fieldValues['category']?.value as number) ||
                    currentBusiness.category?.id ||
                    ''
                )}
                onChange={value =>
                  handleFieldChange('category', parseInt(value))
                }
                options={categories as unknown as Record<string, unknown>[]}
                valueKey='id'
                labelKey='name'
                isLoadingOptions={categoriesLoading}
                className='w-full'
              />
            </div>
          ) : (
            <div className='flex-1'>
              <div className='rounded-xl border bg-gray-50 p-3'>
                <span className='text-sm text-gray-900'>
                  {getCategoryName(currentBusiness.category?.id || null)}
                </span>
              </div>
            </div>
          )}

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            {editingField === 'category' ? (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => handleSave('category')}
                  disabled={!fieldValues['category']?.value}
                >
                  Save
                </Button>
                <Button size='sm' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                variant='outline'
                disabled={!!currentBusiness.category?.id}
                onClick={() =>
                  handleEdit('category', currentBusiness.category?.id || 0)
                }
              >
                Edit
              </Button>
            )}
          </div>
        </section>

        {/* Subcategories */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Subcategories
          </Label>

          <div className='flex-1'>
            {currentBusiness.category?.subcategories &&
            currentBusiness.category?.subcategories.length > 0 ? (
              <div className='flex flex-wrap gap-2.5'>
                {currentBusiness.category?.subcategories.map(subcategory => (
                  <button
                    key={subcategory.id}
                    type='button'
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200',
                      'border-[#E3E8EF] bg-[#FFFFFF] text-[#697586]'
                    )}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-medium'>{subcategory.name}</span>
                      <div className='size-2 rounded-full bg-[#F5F3FF]'></div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className='rounded-xl border bg-gray-50 p-3'>
                <span className='text-sm text-gray-500'>
                  No subcategories selected
                </span>
              </div>
            )}
          </div>

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                // Set the category for fetching subcategories if not already set
                if (currentBusiness.category?.id) {
                  setSelectedCategoryId(currentBusiness.category.id);
                  setEditingField('subCategories');
                  setFieldValues({
                    subCategories: {
                      id: 'subCategories',
                      value:
                        currentBusiness.subcategories?.map(s => s.id) || [],
                    },
                  });
                  setShowSubcategoryModal(true);
                } else {
                  toast.error('Please select a category first');
                }
              }}
              disabled={!currentBusiness.category?.id}
            >
              Edit
            </Button>
          </div>
        </section>

        {/* Business Amenities */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Business Amenities
          </Label>

          <div className='flex-1'>
            {currentBusiness.amenities &&
            currentBusiness.amenities.length > 0 ? (
              <div className='flex flex-wrap gap-2.5'>
                {currentBusiness.amenities.map((amenity, index) => (
                  <button
                    key={index}
                    type='button'
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200',
                      'border-[#E3E8EF] bg-[#FFFFFF] text-[#697586]'
                    )}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-medium'>
                        {typeof amenity === 'object' ? amenity.name : amenity}
                      </span>
                      <div className='size-2 rounded-full bg-[#F5F3FF]'></div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className='rounded-xl border bg-gray-50 p-3'>
                <span className='text-sm text-gray-500'>
                  No amenities selected
                </span>
              </div>
            )}
          </div>

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setEditingField('amenities');
                setFieldValues({
                  amenities: {
                    id: 'amenities',
                    value:
                      currentBusiness.amenities?.map(a =>
                        typeof a === 'object' ? a.id : parseInt(a)
                      ) || [],
                  },
                });
                setShowAmenitiesModal(true);
              }}
            >
              Edit
            </Button>
          </div>
        </section>
      </div>

      {/* Subcategory Selection Modal */}
      <Dialog
        open={showSubcategoryModal && selectedCategoryId !== null}
        onOpenChange={open => {
          setShowSubcategoryModal(open);
          if (!open) {
            setEditingField(null);
            setFieldValues({});
          }
        }}
      >
        <DialogContent className='mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl'>
          <DialogHeader>
            <DialogTitle className='mb-2 text-balance font-karma text-2xl font-semibold text-[#0F0F0F] md:text-3xl'>
              Choose your{' '}
              {categories
                .find(c => c.id === selectedCategoryId)
                ?.name.toLowerCase()}{' '}
              subcategories
            </DialogTitle>
            <p className='mb-8 text-gray-600'>
              Select the subcategories that best describe your business
            </p>
          </DialogHeader>

          {subcategoriesLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent'></div>
            </div>
          ) : (
            <>
              <div className='mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {subcategories.map(subcategory => {
                  const currentIds =
                    (fieldValues['subCategories']?.value as number[]) || [];
                  const isSelected = currentIds.includes(subcategory.id);

                  return (
                    <button
                      key={subcategory.id}
                      type='button'
                      onClick={() => {
                        const currentIds =
                          (fieldValues['subCategories']?.value as number[]) ||
                          [];
                        const newIds = isSelected
                          ? currentIds.filter(id => id !== subcategory.id)
                          : [...currentIds, subcategory.id];
                        handleFieldChange('subCategories', newIds);
                      }}
                      className={cn(
                        'rounded-lg border px-4 py-3 text-left transition-all duration-200',
                        isSelected
                          ? 'border-[#A48AFB] bg-[#FBFAFF] text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      )}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>{subcategory.name}</span>
                        {isSelected && (
                          <div className='size-3 rounded-full bg-[#A48AFB]'></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowSubcategoryModal(false);
                    setEditingField(null);
                    setFieldValues({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave('subCategories')}
                  disabled={updateCategoryMutation.isPending}
                >
                  {updateCategoryMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Amenities Selection Modal */}
      <AmenitiesModal
        open={showAmenitiesModal}
        onOpenChange={open => {
          setShowAmenitiesModal(open);
          if (!open) {
            setEditingField(null);
            setFieldValues({});
          }
        }}
        amenities={amenities}
        selectedAmenityIds={(fieldValues['amenities']?.value as number[]) || []}
        onSelectionChange={ids => handleFieldChange('amenities', ids)}
        onSave={() => handleSave('amenities')}
        isLoading={amenitiesLoading}
        isSaving={updateAmenitiesMutation.isPending}
      />

      {/* Change Profile Picture Modal */}
      <Dialog
        open={showImageSelector}
        onOpenChange={open => {
          setShowImageSelector(open);
        }}
      >
        <DialogContent className='mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl'>
          <DialogHeader>
            <DialogTitle className='mb-6 text-2xl font-semibold'>
              Change profile picture
            </DialogTitle>
          </DialogHeader>

          <div className='grid grid-cols-3 gap-4'>
            {currentBusiness.images?.map(({ image, id }, index) => (
              <button
                key={index}
                onClick={() => {
                  handleFieldChange('profilePicture', image);
                  setShowImageSelector(false);
                  // Find image id from currentBusiness.images
                  const selectedImageObj = currentBusiness.images?.find(
                    img => (typeof img === 'object' ? img.image : img) === image
                  );
                  const imageId =
                    typeof selectedImageObj === 'object'
                      ? selectedImageObj.id
                      : undefined;
                  if (imageId && currentBusiness?.id) {
                    updateBusiness(
                      {
                        business_id: currentBusiness.id,
                        thumbnail_image_id: String(imageId),
                      },
                      {
                        onSuccess: () => {
                          toast.success('Profile picture updated');
                          refetchBusinesses();
                        },
                        onError: () => {
                          toast.error('Failed to update profile picture');
                        },
                      }
                    );
                  }
                }}
                className='group relative aspect-square overflow-hidden rounded-lg border-2 transition-colors hover:border-purple-500'
              >
                <Image
                  src={image}
                  alt={`Business image ${index + 1}`}
                  fill
                  className='object-cover transition-transform group-hover:scale-105'
                />
                {(currentBusiness?.current_thumnail_image_id === id ||
                  index === 0) && (
                  <div className='absolute left-2 top-2 rounded bg-purple-600 px-2 py-1 text-xs text-white'>
                    Default
                  </div>
                )}
              </button>
            ))}
          </div>

          {getBusinessImages().length === 0 && (
            <div className='py-12 text-center'>
              <p className='mb-4 text-gray-500'>No images available</p>
              <p className='text-sm text-gray-400'>
                Upload images in the Gallery section first
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
