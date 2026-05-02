'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  EmptyState,
  Carousel,
  CarouselContent,
  CarouselItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  Button,
} from '@/components/ui';

import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import FeaturedListingCard from './ListingCard';
import { EmptySavedBusinessesIcon } from '../icons';
import React from 'react';
import { convertToTitleCase } from '@/utils/strings';
import {
  BusinessCategoriesIconsType,
  BusinessCategoryIcons,
} from '@/assets/icons/business/BusinessCategoriesIcon';
import { useIsMobile } from '@/hooks/useMobile';

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
  const { savedBusinesses, rawCategorizedBusinesses, isLoading } =
    useSavedBusinessesContext();
  const { isMobile } = useIsMobile();

  const [localListOfSelectedBusinesses, setLocalListOfSelectedBusinesses] =
    React.useState<number[]>(selectedBusinesses);
  const [query, setQuery] = React.useState('');
  const category = 'all';

  // Update local list when modal opens
  React.useEffect(() => {
    if (isBusinessSelectorModalOpen) {
      setLocalListOfSelectedBusinesses(selectedBusinesses);
    }
  }, [isBusinessSelectorModalOpen, selectedBusinesses]);

  const availableCategories = React.useMemo(() => {
    return rawCategorizedBusinesses.map(item => item.category?.name);
  }, [rawCategorizedBusinesses]);

  const filteredFlat = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return savedBusinesses.filter(b => {
      const matchesQuery = q
        ? b.name?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
        : true;
      const matchesCategory = category === 'all';
      return matchesQuery && matchesCategory;
    });
  }, [savedBusinesses, query, category]);

  const filteredCategorized = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rawCategorizedBusinesses
      .map(item => {
        if (category !== 'all' && item.category?.name !== category) return null;

        const matchingBusinesses = item.businesses.filter((b: any) => {
          if (!q) return true;
          return (
            b.name?.toLowerCase().includes(q) ||
            b.description?.toLowerCase().includes(q)
          );
        });

        if (matchingBusinesses.length === 0) return null;

        return { ...item, businesses: matchingBusinesses };
      })
      .filter(Boolean);
  }, [rawCategorizedBusinesses, query, category]);

  const handleSelectToggle = (businessId: number) => {
    if (localListOfSelectedBusinesses.includes(businessId)) {
      setLocalListOfSelectedBusinesses(prev =>
        prev.filter(id => id !== businessId)
      );
    } else {
      setLocalListOfSelectedBusinesses(prev => [...prev, businessId]);
    }
  };

  const MobileContent = (
    <div className='relative flex h-full flex-col'>
      <div className='flex flex-col-reverse justify-between px-4 pb-4 md:items-center md:border-b'>
        <SheetHeader>
          <SheetTitle className='text-lg font-semibold max-md:mt-4 max-md:text-left'>
            Saved Businesses
          </SheetTitle>
        </SheetHeader>
        <div className='flex items-center gap-2 pr-2'>
          <span className='border-r border-gray-200 pr-2 text-xs text-yellow-500'>
            {localListOfSelectedBusinesses.length} selected
          </span>
          <button
            type='button'
            className='text-xs text-[#0D121C] hover:underline'
            onClick={() => setLocalListOfSelectedBusinesses([])}
          >
            Clear
          </button>
        </div>
      </div>

      <div className='flex items-center gap-3 px-4 pb-4'>
        <div className='flex w-full items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1.5 text-xs'>
              <svg
                width='14'
                height='14'
                viewBox='0 0 14 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M4.60978 5.10018C4.41668 5.85666 3.73069 6.41602 2.91406 6.41602C1.94756 6.41602 1.16406 5.63251 1.16406 4.66602C1.16406 3.69952 1.94756 2.91602 2.91406 2.91602C3.73069 2.91602 4.41668 3.47537 4.60978 4.23185C4.62757 4.22965 4.64568 4.22852 4.66406 4.22852L12.2474 4.22852C12.489 4.22852 12.6849 4.42439 12.6849 4.66602C12.6849 4.90764 12.489 5.10352 12.2474 5.10352L4.66406 5.10352C4.64568 5.10352 4.62757 5.10238 4.60978 5.10018ZM3.78906 4.66602C3.78906 5.14926 3.39731 5.54102 2.91406 5.54102C2.43081 5.54102 2.03906 5.14926 2.03906 4.66602C2.03906 4.18277 2.43081 3.79102 2.91406 3.79102C3.39731 3.79102 3.78906 4.18277 3.78906 4.66602Z'
                  fill='#363538'
                />
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M12.8307 9.33268C12.8307 10.2992 12.0472 11.0827 11.0807 11.0827C10.2641 11.0827 9.57811 10.5233 9.38501 9.76685C9.36722 9.76905 9.34911 9.77018 9.33073 9.77018L1.7474 9.77018C1.50577 9.77018 1.3099 9.57431 1.3099 9.33268C1.3099 9.09106 1.50577 8.89518 1.7474 8.89518L9.33073 8.89518C9.34911 8.89518 9.36722 8.89632 9.38501 8.89852C9.57811 8.14204 10.2641 7.58268 11.0807 7.58268C12.0472 7.58268 12.8307 8.36618 12.8307 9.33268ZM11.9557 9.33268C11.9557 9.81593 11.564 10.2077 11.0807 10.2077C10.5975 10.2077 10.2057 9.81593 10.2057 9.33268C10.2057 8.84943 10.5975 8.45768 11.0807 8.45768C11.564 8.45768 11.9557 8.84943 11.9557 9.33268Z'
                  fill='#363538'
                />
              </svg>
              Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-max !min-w-max' align='start'>
              {availableCategories.map(category => (
                <DropdownMenuItem
                  key={category}
                  className='max-w-[180px] !p-1 text-xs'
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='flex-1 rounded-xl border px-3 py-2'>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Search'
              className='w-full bg-transparent text-sm outline-none'
            />
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto pb-6'>
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600'></div>
          </div>
        ) : filteredCategorized.length === 0 ? (
          <div className='py-8'>
            <EmptyState
              media={<EmptySavedBusinessesIcon />}
              title='No Saved Businesses'
              description='You have not saved any businesses yet.'
            />
          </div>
        ) : (
          filteredCategorized.map((item: any) => (
            <div key={item.category.name} className='mb-6'>
              <div className='mb-2 flex items-center gap-1.5 px-4'>
                <BusinessCategoryIcons
                  value={
                    item.category.name.toLowerCase() as BusinessCategoriesIconsType
                  }
                  className='size-4 text-[#5F2EEA]'
                />
                <h1 className='text-sm font-semibold'>
                  {convertToTitleCase(item.category.name)}
                </h1>
              </div>
              <Carousel
                opts={{ align: 'start', loop: false }}
                className='w-full'
              >
                <CarouselContent className='-ml-2 gap-2 px-4'>
                  {item.businesses.map((business: any) => (
                    <CarouselItem
                      key={business.id}
                      className='basis-[75%] pl-2'
                    >
                      <FeaturedListingCard
                        business={business}
                        isSelected={localListOfSelectedBusinesses.includes(
                          business.id
                        )}
                        onSelectToggle={() => handleSelectToggle(business.id)}
                        isSelectable={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ))
        )}
      </div>

      <div className='absolute bottom-[5%] left-0 right-0 flex w-full items-center justify-center'>
        <Button
          type='button'
          size='lg'
          className='w-[80%]'
          disabled={localListOfSelectedBusinesses.length === 0}
          onClick={() => {
            setSelectedBusinesses(localListOfSelectedBusinesses);
            closeBusinessSelectorModal();
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );

  const DesktopContent = (
    <>
      <div className='flex flex-row items-center justify-between border-b pb-4'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Saved Businesses
          </DialogTitle>
        </DialogHeader>
        <div className='flex items-center gap-4 pr-4'>
          <span className='border-r border-gray-200 pr-4 text-sm text-yellow-500'>
            {localListOfSelectedBusinesses.length} selected
          </span>
          <button
            type='button'
            className='text-sm text-[#0D121C] hover:underline'
            onClick={() => setLocalListOfSelectedBusinesses([])}
          >
            Clear
          </button>
        </div>
      </div>

      <div className='flex items-center gap-3 px-6 py-4'>
        <div className='flex flex-1 items-center gap-3'>
          <div className='flex-[0.5] rounded-xl border px-4 py-2'>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Search businesses'
              className='w-full bg-transparent text-sm outline-none'
            />
          </div>
          <button
            type='button'
            className='rounded-xl bg-[#551FB9] px-5 py-2 text-sm font-medium text-white'
          >
            Search
          </button>
        </div>
        <button
          type='button'
          className='ml-auto rounded-lg bg-[#551FB9] px-4 py-2 text-sm font-medium text-white'
          onClick={() => {
            setSelectedBusinesses(localListOfSelectedBusinesses);
            closeBusinessSelectorModal();
          }}
        >
          Done
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 pb-6'>
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600'></div>
          </div>
        ) : filteredFlat.length === 0 ? (
          <EmptyState
            media={<EmptySavedBusinessesIcon />}
            title='No Saved Businesses'
            description='You have not saved any businesses yet. Start exploring and save businesses to see them here.'
          />
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredFlat.map(business => (
              <div key={business.id} className='px-1'>
                <FeaturedListingCard
                  business={business}
                  isSelected={localListOfSelectedBusinesses.includes(
                    business.id
                  )}
                  onSelectToggle={() => handleSelectToggle(business.id)}
                  isSelectable={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet
        open={isBusinessSelectorModalOpen}
        onOpenChange={closeBusinessSelectorModal}
      >
        <SheetContent
          side='bottom'
          className='custom-scrollbar max-h-[85svh] overflow-y-auto px-0 pt-6 sm:max-w-none'
        >
          {MobileContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog
      open={isBusinessSelectorModalOpen}
      onOpenChange={closeBusinessSelectorModal}
    >
      <DialogContent className='flex max-h-[85vh] w-full max-w-[1200px] flex-col overflow-hidden p-2 sm:!rounded-3xl sm:border md:p-6'>
        {DesktopContent}
      </DialogContent>
    </Dialog>
  );
}
