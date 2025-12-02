'use client';


import { EmptyState } from '@/components/ui';

import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import FeaturedListingCard from './ListingCard';
import { EmptySavedBusinessesIcon } from '../icons';
import React from 'react';

type CollaborationFormBusinessSelectorProps = {
  selectedBusinesses: number[];
  setSelectedBusinesses: (businesses: number[]) => void;
};

export default function CollaborationFormBusinessSelector({
  selectedBusinesses,
  setSelectedBusinesses,
}: CollaborationFormBusinessSelectorProps) {
  const { savedBusinesses, isLoading } = useSavedBusinessesContext();

  const [localListOfSelectedBusinesses, setLocalListOfSelectedBusinesses] =
    React.useState<number[]>(selectedBusinesses);
  // const flattendBusinessList
  return (
    <div className='grid h-screen w-full grid-rows-[max-content,1fr] gap-3 overflow-hidden py-16 xl:pb-24 xl:pt-32'>
      {isLoading ? (
        <></>
      ) : savedBusinesses.length === 0 ? (
        <EmptyState
          media={<EmptySavedBusinessesIcon />}
          title='No Saved Businesses'
          description='You have not saved any businesses yet. Start exploring and save businesses to see them here.'
        />
      ) : (
        savedBusinesses.map(business => (
          <FeaturedListingCard key={business.id} business={business} />
        ))
      )}
    </div>
  );
}
