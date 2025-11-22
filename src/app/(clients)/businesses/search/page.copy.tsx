'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSearchBusinesses } from '@/app/(clients)/misc/api/business';
import {
  useBusinessCategories,
  useBusinessStates,
} from '@/app/(clients)/misc/api/metadata';
import type { BusinessSummary } from '@/types/api';
import { Button, buttonVariants, EmptyState, Input } from '@/components/ui';
import { BaseIcons } from '@/assets/icons/base/Icons';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';
import { cn } from '@/lib/utils';

type SearchPatch = {
  searchText?: string | null;
  categoryName?: string | null;
  locationName?: string | null;
};

type SectionKey = 'cities' | 'categories';

const ResultSkeleton = (): JSX.Element => (
  <div className='flex flex-col overflow-hidden rounded-3xl border border-[#E3E8EF] bg-white shadow-sm'>
    <div className='h-44 w-full animate-pulse bg-[#F1F5F9]' />
    <div className='flex flex-col gap-3 p-6'>
      <div className='h-5 w-2/3 rounded bg-[#E2E8F0]' />
      <div className='h-4 w-full rounded bg-[#E2E8F0]' />
      <div className='h-4 w-3/4 rounded bg-[#E2E8F0]' />
      <div className='flex gap-3 pt-2'>
        <div className='h-5 w-24 rounded bg-[#E2E8F0]' />
        <div className='h-5 w-20 rounded bg-[#E2E8F0]' />
      </div>
      <div className='h-10 w-28 rounded-lg bg-[#E2E8F0]' />
    </div>
  </div>
);

const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}): JSX.Element => (
  <button
    type='button'
    onClick={onRemove}
    className='inline-flex items-center gap-2 rounded-full border border-[#E3E8EF] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#0F172B] transition hover:border-[#6E44FF] hover:text-[#5B36D4]'
  >
    <span className='truncate'>{label}</span>
    <span className='text-sm font-semibold text-[#6E44FF]'>x</span>
  </button>
);

const SearchResultCard = ({
  business,
}: {
  business: BusinessSummary;
}): JSX.Element => {
  const ratingValue =
    typeof business.average_review_rating === 'number'
      ? business.average_review_rating
      : null;
  const ratingLabel =
    ratingValue && ratingValue > 0 ? ratingValue.toFixed(1) : 'New';

  return (
    <article className='flex flex-col overflow-hidden rounded-3xl border border-[#E3E8EF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
      <div className='relative h-48 w-full bg-[#F8FAFC]'>
        {business.thumbnail ? (
          <Image
            src={business.thumbnail}
            alt={`${business.name} cover`}
            fill
            unoptimized
            className='object-cover'
            sizes='(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw'
            priority={false}
          />
        ) : null}
      </div>
      <div className='flex flex-col gap-4 p-6'>
        <div className='flex items-center gap-3'>
          {business.logo ? (
            <div className='relative h-12 w-12 overflow-hidden rounded-full bg-[#F4F3FF]'>
              <Image
                src={business.logo}
                alt={`${business.name} logo`}
                fill
                unoptimized
                className='object-cover'
                sizes='48px'
                priority={false}
              />
            </div>
          ) : (
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F3FF] text-sm font-semibold text-[#6E44FF]'>
              {business.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
          )}

          <div className='flex flex-col'>
            <Link
              href={`/businesses/${business.id}`}
              className='text-lg font-semibold text-[#0F172B] transition hover:text-[#5B36D4]'
            >
              {business.name ?? 'Untitled business'}
            </Link>
            {business.address ? (
              <span className='text-sm text-[#64748B]'>{business.address}</span>
            ) : null}
          </div>
        </div>

        <p className='text-sm leading-relaxed text-[#475467]'>
          {business.description
            ? business.description
            : 'This business has not provided a description yet.'}
        </p>

        <div className='flex flex-wrap items-center gap-4 text-sm text-[#475467]'>
          <span className='inline-flex items-center gap-1 text-[#F59E0B]'>
            <BaseIcons value='star-yellow' />
            <span className='font-medium'>{ratingLabel}</span>
          </span>
        </div>

        <Link
          href={`/businesses/${business.id}`}
          className={cn(
            buttonVariants({ variant: 'neutral', size: 'md' }),
            'w-fit transition hover:border-[#6E44FF] hover:text-[#5B36D4]'
          )}
        >
          View profile
        </Link>
      </div>
    </article>
  );
};

const BusinessSearchPage = (): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTextParam = searchParams.get('search_text');
  const categoryParam = searchParams.get('category');
  const locationParam = searchParams.get('location');

  const { data: categoriesData } = useBusinessCategories();
  const { data: statesData } = useBusinessStates();

  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      cities: true,
      categories: true,
    }
  );
  const toggleSection = useCallback((section: SectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const categoryMatch = useMemo(() => {
    if (!categoryParam) return null;
    const list = categoriesData?.data ?? [];
    return (
      list.find(
        category => category.name.toLowerCase() === categoryParam.toLowerCase()
      ) ?? null
    );
  }, [categoriesData, categoryParam]);

  const locationMatch = useMemo(() => {
    if (!locationParam) return null;
    const list = statesData?.data ?? [];
    return (
      list.find(
        state => state.name.toLowerCase() === locationParam.toLowerCase()
      ) ?? null
    );
  }, [statesData, locationParam]);

  const categoryIdForApi = categoryMatch
    ? String(categoryMatch.id ?? categoryMatch.name)
    : undefined;
  const locationIdForApi = locationMatch
    ? String(
        (locationMatch as { id?: string | number }).id ?? locationMatch.name
      )
    : undefined;

  const {
    data: searchData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useSearchBusinesses({
    q: searchTextParam ?? '',
    ...(categoryIdForApi && { category: categoryIdForApi }),
    ...(locationIdForApi && { state: locationIdForApi }),
  });

  const businesses = searchData?.data ?? [];
  const isSearching = isLoading || isFetching;

  const applyFilters = useCallback(
    (patch: SearchPatch) => {
      const nextSearch =
        patch.searchText !== undefined
          ? patch.searchText
          : (searchTextParam ?? null);
      const nextCategory =
        patch.categoryName !== undefined
          ? patch.categoryName
          : (categoryParam ?? null);
      const nextLocation =
        patch.locationName !== undefined
          ? patch.locationName
          : (locationParam ?? null);

      const params = new URLSearchParams();
      if (nextSearch) params.set('search_text', nextSearch);
      if (nextCategory) params.set('category', nextCategory);
      if (nextLocation) params.set('location', nextLocation);

      const query = params.toString();
      router.push(query ? `/businesses/search?${query}` : '/businesses/search');
    },
    [router, searchTextParam, categoryParam, locationParam]
  );

  const handleClearFilters = useCallback(() => {
    applyFilters({ searchText: null, categoryName: null, locationName: null });
  }, [applyFilters]);

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; onRemove: () => void }> =
      [];
    if (searchTextParam) {
      filters.push({
        key: 'search',
        label: `Keyword: "${searchTextParam}"`,
        onRemove: () => applyFilters({ searchText: null }),
      });
    }
    if (categoryParam) {
      const label = categoryMatch?.name ?? categoryParam;
      filters.push({
        key: 'category',
        label,
        onRemove: () => applyFilters({ categoryName: null }),
      });
    }
    if (locationParam) {
      const label = locationMatch?.name ?? locationParam;
      filters.push({
        key: 'location',
        label,
        onRemove: () => applyFilters({ locationName: null }),
      });
    }
    return filters;
  }, [
    applyFilters,
    searchTextParam,
    categoryParam,
    categoryMatch,
    locationParam,
    locationMatch,
  ]);

  const normalizedFilterSearch = filterSearchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    const list = categoriesData?.data ?? [];
    if (!normalizedFilterSearch) return list;
    return list.filter(category =>
      category.name.toLowerCase().includes(normalizedFilterSearch)
    );
  }, [categoriesData, normalizedFilterSearch]);

  const filteredLocations = useMemo(() => {
    const list = statesData?.data ?? [];
    if (!normalizedFilterSearch) return list;
    return list.filter(state =>
      state.name.toLowerCase().includes(normalizedFilterSearch)
    );
  }, [statesData, normalizedFilterSearch]);

  const hasAnyFilter = activeFilters.length > 0;
  const heading = searchTextParam
    ? `Results for "${searchTextParam}"`
    : 'Search results';
  const resultLabel = isSearching
    ? 'Searching businesses…'
    : `${businesses.length} result${businesses.length === 1 ? '' : 's'} found`;

  const errormessage =
    error instanceof Error
      ? error.message
      : 'We could not complete the search. Please try again.';

  return (
    <div className='relative mx-auto flex min-h-screen w-full max-w-7xl flex-1 flex-col gap-10 bg-[#F8FAFC] px-4 pb-24 pt-32 lg:flex-row lg:px-6'>
      {/* Mobile Bottom Drawer - Slides up from bottom */}
      {isMobileFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden'
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Drawer - slides from bottom */}
          <div className='fixed inset-x-0 bottom-0 z-50 max-h-[85vh] animate-slide-up overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:hidden'>
            <div className='flex h-full flex-col'>
              {/* Drawer Header */}
              <div className='flex items-center justify-between border-b border-[#E3E8EF] px-4 py-4'>
                <h2 className='text-lg font-semibold text-[#0F172B]'>
                  Filter Search
                </h2>
                <button
                  type='button'
                  onClick={() => setIsMobileFilterOpen(false)}
                  className='flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172B]'
                >
                  <span>Cancel</span>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 4L4 12M4 4L12 12'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className='flex-1 overflow-y-auto px-4 py-6'>
                <div className='flex flex-col gap-6'>
                  <Input
                    value={filterSearchTerm}
                    onChange={event => setFilterSearchTerm(event.target.value)}
                    placeholder='Search'
                    size='sm'
                    leftIcon={<BaseIcons value='search-black' />}
                    leftIconContainerClass='text-[#94A3B8]'
                    className='h-11 rounded-2xl border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0F172B] placeholder:text-[#94A3B8] focus:border-[#6E44FF] focus-visible:border-[#6E44FF]'
                  />

                  {/* States */}
                  <div className='border-t border-[#E3E8EF] pt-4'>
                    <button
                      type='button'
                      onClick={() => toggleSection('cities')}
                      className='flex w-full items-center justify-between py-2 text-left text-sm font-medium text-[#64748B]'
                    >
                      <span>By States</span>
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className={cn(
                          'transition-transform duration-200',
                          openSections.cities ? 'rotate-0' : '-rotate-90'
                        )}
                      >
                        <path
                          d='M10.5 4.5L6 9L1.5 4.5'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                    {openSections.cities && (
                      <div className='mt-3 space-y-2'>
                        <button
                          type='button'
                          onClick={() => {
                            applyFilters({ locationName: null });
                            setIsMobileFilterOpen(false);
                          }}
                          className={cn(
                            'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                            !locationParam
                              ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                              : 'text-[#475467] hover:bg-[#F8FAFC]'
                          )}
                        >
                          All States
                        </button>
                        {filteredLocations.map(state => {
                          const isActive = locationParam?.toLowerCase() === state.name.toLowerCase();
                          return (
                            <button
                              key={state.name}
                              type='button'
                              onClick={() => {
                                applyFilters({ locationName: state.name });
                                setIsMobileFilterOpen(false);
                              }}
                              className={cn(
                                'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                                isActive
                                  ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                                  : 'text-[#475467] hover:bg-[#F8FAFC]'
                              )}
                            >
                              {state.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div className='border-t border-[#E3E8EF] pt-4'>
                    <button
                      type='button'
                      onClick={() => toggleSection('categories')}
                      className='flex w-full items-center justify-between py-2 text-left text-sm font-medium text-[#64748B]'
                    >
                      <span>Category</span>
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className={cn(
                          'transition-transform duration-200',
                          openSections.categories ? 'rotate-0' : '-rotate-90'
                        )}
                      >
                        <path
                          d='M10.5 4.5L6 9L1.5 4.5'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                    {openSections.categories && (
                      <div className='mt-3 space-y-2'>
                        {filteredCategories.map(category => {
                          const isActive = categoryParam?.toLowerCase() === category.name.toLowerCase();
                          const iconKey = (category.name ?? '').split(' ')[0]?.toLowerCase() ?? '';
                          return (
                            <button
                              key={category.name}
                              type='button'
                              onClick={() => {
                                applyFilters({ categoryName: category.name });
                                setIsMobileFilterOpen(false);
                              }}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition',
                                isActive
                                  ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                                  : 'text-[#475467] hover:bg-[#F8FAFC]'
                              )}
                            >
                              <BusinessCategoryIcons
                                value={iconKey as never}
                                className='h-5 w-5 flex-shrink-0'
                              />
                              <span>{category.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {hasAnyFilter && (
                    <div className='border-t border-[#E3E8EF] pt-4'>
                      <Button
                        variant='neutral'
                        size='sm'
                        className='w-full'
                        onClick={() => {
                          handleClearFilters();
                          setIsMobileFilterOpen(false);
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className='top-24 hidden h-fit w-full shadow-sm lg:sticky lg:block lg:w-72 lg:flex-shrink-0'>
        <div className='flex flex-col gap-6'>
          <div className='space-y-4'>
            <h2 className='text-base font-semibold text-[#0F172B]'>
              Filter Search
            </h2>
            <Input
              value={filterSearchTerm}
              onChange={event => setFilterSearchTerm(event.target.value)}
              placeholder='Search'
              size='sm'
              leftIcon={<BaseIcons value='search-black' />}
              leftIconContainerClass='text-[#94A3B8]'
              className='h-11 rounded-2xl border-[#E2E8F0] bg-[#FFFFFF] text-sm text-[#0F172B] placeholder:text-[#94A3B8] focus:border-[#6E44FF] focus-visible:border-[#6E44FF]'
            />
          </div>

          <div className='border-t border-[#F1F5F9] pt-6'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-[#0F172B]'>
              Active filters
            </h3>
            {hasAnyFilter ? (
              <div className='mt-4 flex flex-wrap gap-2'>
                {activeFilters.map(filter => (
                  <FilterChip
                    key={filter.key}
                    label={filter.label}
                    onRemove={filter.onRemove}
                  />
                ))}
              </div>
            ) : (
              <p className='mt-3 text-sm text-[#64748B]'>
                You have not added any filters yet. Use the search bar or quick
                filters below to start exploring.
              </p>
            )} 
          </div>

          <section className=''>
            <div className='border-t border-[#E3E8EF] pt-2'>
              <button
                type='button'
                onClick={() => toggleSection('cities')}
                className='flex w-full items-center justify-between text-left text-sm font-semibold text-[#0F172B]'
              >
                <span>By States</span>
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className={cn(
                    'text-[#475467] transition-transform duration-200',
                    openSections.cities ? 'rotate-0' : '-rotate-90'
                  )}
                >
                  <path
                    d='M10.5 4.5L6 9L1.5 4.5'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>

              <div
                className={cn(
                  'mt-4 space-y-2 text-sm transition-all duration-200',
                  openSections.cities
                    ? 'max-h-80 overflow-y-auto opacity-100'
                    : 'max-h-0 overflow-hidden opacity-0'
                )}
              >
                <button
                  type='button'
                  onClick={() => applyFilters({ locationName: null })}
                  className={cn(
                    'w-full rounded-xl px-3 py-2 text-left transition',
                    !locationParam
                      ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                      : 'text-[#475467] hover:bg-[#F8FAFC]'
                  )}
                >
                  All States
                </button>
                {filteredLocations.map(state => {
                  const name = state.name;
                  const isActive =
                    locationParam?.toLowerCase() === name.toLowerCase();
                  return (
                    <button
                      key={name}
                      type='button'
                      onClick={() => applyFilters({ locationName: name })}
                      className={cn(
                        'w-full rounded-xl px-3 py-2 text-left transition',
                        isActive
                          ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                          : 'text-[#475467] hover:bg-[#F8FAFC]'
                      )}
                    >
                      {state.name}
                    </button>
                  );
                })}
                {normalizedFilterSearch && filteredLocations.length === 0 ? (
                  <p className='rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs text-[#64748B]'>
                    No cities match “{filterSearchTerm}”.
                  </p>
                ) : null}
              </div>
            </div>

            <div className='border-t border-[#E3E8EF] pt-2'>
              <button
                type='button'
                onClick={() => toggleSection('categories')}
                className='flex w-full items-center justify-between text-left text-sm font-semibold text-[#0F172B]'
              >
                <span>Category</span>
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className={cn(
                    'text-[#475467] transition-transform duration-200',
                    openSections.categories ? 'rotate-0' : '-rotate-90'
                  )}
                >
                  <path
                    d='M10.5 4.5L6 9L1.5 4.5'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>

              <div
                className={cn(
                  'mt-4 space-y-2 text-sm transition-all duration-200',
                  openSections.categories
                    ? 'max-h-80 overflow-y-auto opacity-100'
                    : 'max-h-0 overflow-hidden opacity-0'
                )}
              >
                <button
                  type='button'
                  onClick={() => applyFilters({ categoryName: null })}
                  className={cn(
                    'w-full rounded-xl px-3 py-2 text-left transition',
                    !categoryParam
                      ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                      : 'text-[#475467] hover:bg-[#F8FAFC]'
                  )}
                >
                  All Categories
                </button>
                {filteredCategories.map(category => {
                  const name = category.name;
                  const isActive =
                    categoryParam?.toLowerCase() === name.toLowerCase();
                  const iconKey = (name ?? '').split(' ')[0]?.toLowerCase() ?? '';
                  return (
                    <button
                      key={name}
                      type='button'
                      onClick={() => applyFilters({ categoryName: name })}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition',
                        isActive
                          ? 'bg-[#F4F3FF] font-medium text-[#5B36D4]'
                          : 'text-[#475467] hover:bg-[#F8FAFC]'
                      )}
                    >
                      <BusinessCategoryIcons
                        value={iconKey as never}
                        className='h-5 w-5 flex-shrink-0'
                      />
                      <span>{name}</span>
                    </button>
                  );
                })}
                {normalizedFilterSearch && filteredCategories.length === 0 ? (
                  <p className='rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs text-[#64748B]'>
                    No categories match “{filterSearchTerm}”.
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {hasAnyFilter ? (
            <div className='border-t border-[#E3E8EF] pt-4'>
              <Button
                variant='neutral'
                size='sm'
                className='w-full'
                onClick={handleClearFilters}
              >
                Clear all filters
              </Button>
            </div>
          ) : null}
        </div>
      </aside>

      <div className='flex-1'>
        {/* Mobile Filter Button - Only visible on mobile */}
        <div className='mb-4 flex items-center gap-3 lg:hidden'>
          <button
            type='button'
            onClick={() => setIsMobileFilterOpen(true)}
            className='flex items-center gap-2 rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172B] shadow-sm transition hover:border-[#6E44FF] hover:shadow'
          >
            <BaseIcons value='filter-outlined-black' />
            <span>Filter</span>
          </button>
          <div className='h-11 flex-1'>
            <Input
              placeholder='Search'
              size='sm'
              leftIcon={<BaseIcons value='search-black' />}
              leftIconContainerClass='text-[#94A3B8]'
              className='h-full rounded-2xl border-[#E2E8F0] text-sm placeholder:text-[#94A3B8]'
            />
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-semibold text-[#0F172B]'>{heading}</h2>
            <p className='text-sm text-[#64748B]'>{resultLabel}</p>
          </div>
          {hasAnyFilter ? (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearFilters}
              className='text-[#5B36D4] hover:bg-[#F4F3FF]'
            >
              Reset filters
            </Button>
          ) : null}
        </div>

        <div className='mt-8'>
          {isError ? (
            <EmptyState
              title='Something went wrong'
              description={errormessage}
              actions={
                <Button variant='neutral' onClick={() => router.refresh()}>
                  Retry search
                </Button>
              }
              className='rounded-3xl border border-[#E3E8EF] bg-white py-12'
            />
          ) : isSearching ? (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {Array.from({ length: 6 }).map((_, index) => (
                <ResultSkeleton key={index} />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <EmptyState
              title='No businesses found'
              description='Try adjusting your filters or searching with a different keyword.'
              className='rounded-3xl border border-[#E3E8EF] bg-white py-16'
            />
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {businesses.map(business => (
                <SearchResultCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessSearchPage;
