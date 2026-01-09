'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  EmptyState,
} from '@/components/ui';

import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import FeaturedListingCard from './ListingCard';
import { EmptySavedBusinessesIcon } from '../icons';
import React from 'react';

type CollaborationFormBusinessSelectorProps = {
  selectedBusinesses: number[];
  setSelectedBusinesses: (businesses: number[]) => void;
  isBusinessSelectorModalOpen: boolean;
  closeBusinessSelectorModal: () => void;
};

export default function CollaborationFormBusinessSelector({
  selectedBusinesses,
  setSelectedBusinesses,
  isBusinessSelectorModalOpen,
  closeBusinessSelectorModal,
}: CollaborationFormBusinessSelectorProps) {
  const { savedBusinesses, isLoading } = useSavedBusinessesContext();

  const [localListOfSelectedBusinesses, setLocalListOfSelectedBusinesses] =
    React.useState<number[]>(selectedBusinesses);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | 'all'>('all');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return savedBusinesses.filter(b => {
      const matchesQuery = q
        ? (b.name?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q))
        : true;
      // SavedBusiness does not include category info; fallback to all
      const matchesCategory = category === 'all';
      return matchesQuery && matchesCategory;
    });
  }, [savedBusinesses, query, category]);

  return (
    <Dialog
      open={isBusinessSelectorModalOpen}
      onOpenChange={closeBusinessSelectorModal}
    >
      <DialogContent className='flex max-h-[85vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl'>
        <div className='flex items-center justify-between border-b px-6 py-4'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold'>Saved Businesses</DialogTitle>
          </DialogHeader>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-[#551FB9]'>
              {localListOfSelectedBusinesses.length} selected
            </span>
            <button
              type='button'
              className='text-sm text-[#0D121C] hover:underline'
              onClick={() => setLocalListOfSelectedBusinesses([])}
            >
              Clear
            </button>
            <button
              type='button'
              className='rounded-lg bg-[#551FB9] px-4 py-2 text-sm font-medium text-white'
              onClick={() => {
                setSelectedBusinesses(localListOfSelectedBusinesses);
                closeBusinessSelectorModal();
              }}
            >
              Done
            </button>
            <DialogClose className='text-[#0D121C]'>
              <span className='sr-only'>Close</span>
              ×
            </DialogClose>
          </div>
        </div>

        <div className='flex items-center gap-3 px-6 py-4 max-w-xl'>
          <div className='flex-1 rounded-xl border px-4 py-2'>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Search businesses'
              className='w-full bg-transparent text-sm outline-none'
            />
          </div>
          <div className='rounded-xl border px-3 py-2'>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className='bg-transparent text-sm outline-none'
            >
              <option value='all'>Category</option>
              {/* Category options unavailable in SavedBusiness; keep only 'Category' */}
            </select>
          </div>
          <button
            type='button'
            className='rounded-xl bg-[#551FB9] px-5 py-2 text-sm font-medium text-white'
            onClick={() => {/* no-op, filter applies live */}}
          >
            Search
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-6 pb-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600'></div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              media={<EmptySavedBusinessesIcon />}
              title='No Saved Businesses'
              description='You have not saved any businesses yet. Start exploring and save businesses to see them here.'
            />
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filtered.map(business => (
                <div key={business.id} className='px-1'>
                  <FeaturedListingCard
                    business={business}
                    isSelected={localListOfSelectedBusinesses.includes(
                      business.id
                    )}
                    onSelectToggle={() => {
                      if (localListOfSelectedBusinesses.includes(business.id)) {
                        setLocalListOfSelectedBusinesses(prev =>
                          prev.filter(id => id !== business.id)
                        );
                      } else {
                        setLocalListOfSelectedBusinesses(prev => [
                          ...prev,
                          business.id,
                        ]);
                      }
                    }}
                    isSelectable={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
