'use client';
import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAmenities } from '@/app/(business)/misc/api/business';

interface BusinessAmenitiesProps {
  setSelectedAmenities: (amenityIds: number[]) => void;
  selectedAmenityIds?: number[];
}

const BusinessAmenities: React.FC<BusinessAmenitiesProps> = ({
  setSelectedAmenities,
  selectedAmenityIds = [],
}) => {
  const [selectedAmenities, setLocalSelectedAmenities] =
    useState<number[]>(selectedAmenityIds);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: amenities = [], isLoading, error } = useAmenities();

  // Filter amenities based on search term
  const filteredAmenities = amenities.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLocalSelectedAmenities(selectedAmenityIds);
  }, [selectedAmenityIds]);

  const toggleAmenity = (amenityId: number) => {
    const newAmenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter(id => id !== amenityId)
      : [...selectedAmenities, amenityId];

    setLocalSelectedAmenities(newAmenities);
    setSelectedAmenities(newAmenities);
  };

  const removeAmenity = (amenityId: number) => {
    const newAmenities = selectedAmenities.filter(id => id !== amenityId);
    setLocalSelectedAmenities(newAmenities);
    setSelectedAmenities(newAmenities);
  };

  const getAmenityName = (amenityId: number): string => {
    const amenity = amenities.find(a => a.id === amenityId);
    return amenity?.name || '';
  };

  if (isLoading) {
    return (
      <div className='mx-auto max-w-xl space-y-6'>
        <div>
          <p className='text-sm text-gray-600'>
            Loading available amenities...
          </p>
        </div>
        <div className='animate-pulse'>
          <div className='mb-4 h-12 rounded-lg bg-gray-200'></div>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='h-16 rounded-lg bg-gray-200' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto max-w-xl space-y-6'>
        <div>
          <p className='text-sm text-red-600'>
            Failed to load amenities. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-xl space-y-6'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Enter keyword...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
        />

        {/* Dropdown Results */}
        {searchTerm && (
          <div className='absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg'>
            {filteredAmenities.length > 0 ? (
              filteredAmenities.map(amenity => {
                const isSelected = selectedAmenities.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type='button'
                    onClick={() => {
                      toggleAmenity(amenity.id);
                      setSearchTerm('');
                    }}
                    className={cn(
                      'flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50',
                      isSelected
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700'
                    )}
                  >
                    <span className='font-medium'>{amenity.name}</span>
                    {isSelected && (
                      <Check size={20} className='text-purple-600' />
                    )}
                  </button>
                );
              })
            ) : (
              <div className='px-4 py-3 text-sm text-gray-500'>
                No amenities found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Amenities Tags */}
      {selectedAmenities.length > 0 && (
        <div className='space-y-3'>
          {/* <h3 className="font-medium text-gray-900">Selected Amenities</h3> */}
          <div className='flex flex-wrap gap-x-6 gap-y-3'>
            {selectedAmenities.map(amenityId => (
              <div
                key={amenityId}
                className='relative inline-flex items-center gap-3 rounded-xl border border-[#ECE9FE] bg-[#FBFAFF] p-3 text-sm text-[#7839EE] lg:px-4'
              >
                <button
                  onClick={() => removeAmenity(amenityId)}
                  className='absolute -left-[9px] top-1/2 -translate-y-1/2 rounded-full border-[0.6px] border-[#E3E8EF] bg-[#FFFFFF] p-1 cursor-pointer hover:bg-red-500'
                >
                  <X size={16} className='text-[#9AA4B2]' />
                </button>
                <span className='text-purple-600'>🏢</span>
                <span className='font-inter text-sm'>
                  {getAmenityName(amenityId)}
                </span>
              </div>
            ))}
          </div>
          <p className='text-sm text-gray-600'>
            {selectedAmenities.length} amenit
            {selectedAmenities.length !== 1 ? 'ies' : 'y'} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessAmenities;
