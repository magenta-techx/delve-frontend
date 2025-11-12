'use client';

import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Loader from './Loader';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from './Select';

interface SelectProps<T extends Record<string, unknown>> {
  value: string | boolean | undefined;
  onChange: (value: string) => void;
  options: T[] | undefined;
  disabled?: boolean;
  name: string;
  hasError?: boolean;
  errorMessage?: string;
  label?: string | React.ReactNode;
  placeholder: string;
  className?: string;
  containerClass?: string;
  itemClass?: string;
  isLoadingOptions?: boolean;
  valueKey: keyof T;
  labelKey: keyof T;
  placeHolderClass?: string;
  optional?: boolean;
}

function toString(value: unknown): string {
  return value == null ? '' : String(value);
}

const SelectSingleSimple = <T extends Record<string, unknown>>({
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
  optional,
}: SelectProps<T>): JSX.Element => {
  const currentValue = value === false ? 'false' : value === true ? 'true' : (value as string | undefined);

  // Find the selected option to display its label
  const selectedOption = options?.find(option => toString(option[valueKey]) === toString(currentValue || ''));
  const displayValue = selectedOption ? toString(selectedOption[labelKey]) : placeholder;

  return (
    <div className={cn('flex flex-col gap-2', containerClass)}>
      {label && (
        <label className='text-sm text-[#0F172B] font-medium' htmlFor={name}>
          {label}
          {!optional && <span className='text-red-400 font-medium'> *</span>}
        </label>
      )}
      <Select
        {...(toString(currentValue || '') ? { value: toString(currentValue || '') } : {})}
        onValueChange={onChange}
        disabled={!!(disabled || isLoadingOptions)}
      >
        <SelectTrigger
          id={name}
          className={cn('w-full cursor-pointer', className)}
          hasError={!!hasError}
          {...(errorMessage ? { errorMessage } : {})}
          {...(placeHolderClass ? { valueClassName: placeHolderClass } : {})}
          optional={Boolean(optional)}
        >
          <div className={cn('text-left', selectedOption ? 'text-gray-900' : 'text-gray-500')}>
            {isLoadingOptions ? 'Loading options...' : displayValue}
          </div>
        </SelectTrigger>
        <SelectContent>
          {isLoadingOptions ? (
            <div className='flex items-center justify-center gap-2 text-main-solid py-2 font-medium'>
              <Loader /> Loading options...
            </div>
          ) : (
            (options?.length ?? 0) > 0 ? (
              options!.map((option, idx) => {
                const v = toString(option[valueKey]);
                return (
                  <SelectItem
                    key={`${v}-${idx}`}
                    value={v}
                    className={cn('flex hover:!bg-purple-200 w-full text-sm py-2 rounded-lg cursor-pointer', itemClass)}
                  >
                    <CheckIcon className={cn('mr-2 h-4 w-4', v === toString(currentValue) ? 'opacity-100' : 'opacity-0')} />
                    {toString(option[labelKey])}
                  </SelectItem>
                );
              })
            ) : (
              <div className='text-[0.8125rem] px-3 py-2'>There&apos;s no option to select from</div>
            )
          )}
        </SelectContent>
      </Select>
      {hasError && errorMessage && (
        <p className='text-sm text-destructive'>{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectSingleSimple;
