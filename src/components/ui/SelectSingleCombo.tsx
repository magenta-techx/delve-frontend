'use client';

import * as React from 'react';
import { CheckIcon, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Loader from './Loader';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './Select';

type CustomLabelFormat<T> = string | ((item: T) => string);

export function generateCustomLabel<T extends Record<string, unknown>>(item: T, format: CustomLabelFormat<T>): string {
  if (typeof format === 'function') return format(item);
  return format.replace(/\{(\w+)\}/g, (_match, key) => (item[key] !== undefined ? String(item[key]) : _match));
}

interface SelectProps<T extends Record<string, unknown>> {
  value: string | boolean | undefined;
  onChange: (value: string) => void;
  options: T[] | undefined;
  disabled?: boolean;
  name: string;
  hasError?: boolean;
  errorMessage?: string;
  label?: string | React.ReactNode;
  bottomItem?: React.ReactNode;
  placeholder: string;
  className?: string;
  containerClass?: string;
  itemClass?: string;
  isLoadingOptions?: boolean;
  valueKey: keyof T;
  labelKey: keyof T | CustomLabelFormat<T>;
  searchKey?: keyof T;
  placeHolderClass?: string;
  allowDisselect?: boolean;
  optional?: boolean;
}

function toString(value: unknown): string {
  return value == null ? '' : String(value);
}

const SelectSingleCombo = <T extends Record<string, unknown>>({
  value,
  onChange,
  options,
  disabled,
  hasError,
  errorMessage,
  label,
  name,
  placeholder,
  className,
  containerClass,
  itemClass,
  placeHolderClass,
  isLoadingOptions,
  valueKey,
  labelKey,
  searchKey,
  allowDisselect = false,
  optional,
  bottomItem,
}: SelectProps<T>): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const currentValue = value === false ? 'false' : value === true ? 'true' : (value as string | undefined);

  const filtered = React.useMemo(() => {
    if (!options) return [] as T[];
    if (!open) return options;
    if (!searchText.trim()) return options;
    const key: keyof T | undefined = searchKey ?? (typeof labelKey === 'string' ? (labelKey as keyof T) : undefined);
    if (!key) return options;
    const s = searchText.toLowerCase();
    return options.filter(opt => toString(opt[key]).toLowerCase().includes(s));
  }, [options, open, searchText, searchKey, labelKey]);

  const getOptionLabel = (option: T | undefined): string => {
    if (!option) return placeholder;
    if (typeof labelKey === 'string') return toString(option[labelKey as keyof T]);
    return generateCustomLabel(option, labelKey as CustomLabelFormat<T>);
  };

  const handleChange = (next: string): void => {
    if (allowDisselect && toString(currentValue) === next) {
      onChange('');
    } else {
      onChange(next);
    }
  };

  const selected = toString(currentValue || '') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', containerClass)}>
      {label && (
        <label className='text-sm text-[#0F172B] font-medium' htmlFor={name}>
          {label}
          {!optional && <span className='text-red-400 font-medium'> *</span>}
        </label>
      )}
      <Select
        {...(selected !== undefined ? { value: selected } : {})}
        onValueChange={handleChange}
        open={open}
        onOpenChange={(o): void => {
          setOpen(o);
          if (!o) setSearchText('');
        }}
        disabled={!!(disabled || isLoadingOptions)}
      >
        <SelectTrigger
          id={name}
          className={cn('w-full', className)}
          hasError={!!hasError}
          {...(errorMessage ? { errorMessage } : {})}
          {...(placeHolderClass ? { valueClassName: placeHolderClass } : {})}
          optional={Boolean(optional)}
        >
          <SelectValue placeholder={isLoadingOptions ? 'Loading options...' : placeholder} />
        </SelectTrigger>
        <SelectContent className='p-0'>
          <div className='relative px-3 py-2 border-b border-[#E6E6E6]'>
            <SearchIcon className='absolute top-1/2 left-2 -translate-y-1/2 text-[#032282] h-4 w-4' />
            <input
              className='focus:outline-none bg-transparent pl-6 pr-2 py-1.5 text-sm placeholder:text-[#86898ec7] w-full'
              placeholder={placeholder || 'Search'}
              type='text'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <div className='max-h-[450px] overflow-y-auto p-1'>
            {isLoadingOptions ? (
              <div className='flex items-center justify-center gap-2 text-main-solid py-2 font-medium'>
                <Loader /> Loading options...
              </div>
            ) : (
              (filtered?.length ?? 0) > 0 ? (
                filtered!.map((option, idx) => {
                  const v = toString(option[valueKey]);
                  return (
                    <SelectItem
                      key={`${v}-${idx}`}
                      value={v}
                      className={cn('hover:bg-blue-100 w-full text-sm py-2 rounded-lg', itemClass)}
                    >
                      <CheckIcon className={cn('mr-2 h-4 w-4', v === toString(currentValue) ? 'opacity-100' : 'opacity-0')} />
                      {getOptionLabel(option)}
                    </SelectItem>
                  );
                })
              ) : (
                <div className='text-[0.8125rem] px-3 py-2'>There&apos;s no option to select from</div>
              )
            )}
          </div>
          {bottomItem}
        </SelectContent>
      </Select>
      {hasError && errorMessage && (
        <p className='text-sm text-destructive'>{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectSingleCombo;
