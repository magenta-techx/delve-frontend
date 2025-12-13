'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui';

interface Amenity {
  id: number;
  name: string;
}

interface AmenitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amenities: Amenity[];
  selectedAmenityIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onSave: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
}

export function AmenitiesModal({
  open,
  onOpenChange,
  amenities,
  selectedAmenityIds,
  onSelectionChange,
  onSave,
  isLoading = false,
  isSaving = false,
}: AmenitiesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAmenities = useMemo(() => {
    if (!searchQuery.trim()) {
      return amenities;
    }
    
    const query = searchQuery.toLowerCase();
    return amenities.filter(amenity =>
      amenity.name.toLowerCase().includes(query)
    );
  }, [amenities, searchQuery]);

  const handleToggleAmenity = (amenityId: number) => {
    const isSelected = selectedAmenityIds.includes(amenityId);
    const newIds = isSelected
      ? selectedAmenityIds.filter(id => id !== amenityId)
      : [...selectedAmenityIds, amenityId];
    onSelectionChange(newIds);
  };

  const handleClose = () => {
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl'>
        <DialogHeader>
          <DialogTitle className='mb-2 text-balance font-karma text-2xl font-semibold text-[#0F0F0F] md:text-3xl'>
            Choose your business amenities
          </DialogTitle>
          <p className='mb-6 text-gray-600'>
            Select the amenities that your business offers
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent'></div>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className='mb-6'>
              <Input
                type='text'
                placeholder='Search amenities...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full'
              />
            </div>

            {/* Amenities Grid */}
            <div className='mb-8 grid max-h-72 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 custom-scrollbar'>
              {filteredAmenities.length > 0 ? (
                filteredAmenities.map(amenity => {
                  const isSelected = selectedAmenityIds.includes(amenity.id);

                  return (
                    <button
                      key={amenity.id}
                      type='button'
                      onClick={() => handleToggleAmenity(amenity.id)}
                      className={cn(
                        'rounded-lg border px-4 py-3 text-left transition-all duration-200',
                        isSelected
                          ? 'border-[#A48AFB] bg-[#FBFAFF] text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      )}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>{amenity.name}</span>
                        {isSelected && (
                          <div className='size-3 rounded-full bg-[#A48AFB]'></div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className='col-span-2 py-8 text-center text-gray-500'>
                  No amenities found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
