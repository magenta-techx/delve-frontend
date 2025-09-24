'use client';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Field, FieldProps } from 'formik';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
  selectClass?: string;
  validate?: (value: string) => string | undefined;
  options: SelectOption[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      name,
      label,
      placeholder = 'Select an option',
      className = '',
      selectClass = 'sm:p-3 focus:border-primary sm:text-[13px]',
      validate,
      options,
    },
    ref
  ) => {
    return (
      <Field name={name} validate={validate}>
        {({ field, meta }: FieldProps) => {
          return (
            <div className={`flex flex-col gap-1 ${className}`}>
              {label && (
                <label htmlFor={name} className='text-sm font-medium'>
                  {label}
                </label>
              )}

              <div className='relative flex items-center'>
                <select
                  id={name}
                  {...field}
                  ref={ref}
                  className={`w-full appearance-none rounded-md border p-2 font-inter text-[16px] focus:outline-none ${
                    meta.touched && meta.error
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } ${selectClass}`}
                >
                  <option value={placeholder}>{placeholder}</option>
                  {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Dropdown arrow */}
                <span className='pointer-events-none absolute right-3 text-gray-400'>
                  <BusinessCategoryIcons value='arrow-down' />
                </span>
              </div>

              <div className='-mt-2 min-h-[20px] p-0'>
                {meta.touched && meta.error && (
                  <span className='text-xs text-red-500'>{meta.error}</span>
                )}
              </div>
            </div>
          );
        }}
      </Field>
    );
  }
);

Select.displayName = 'Select';

export default Select;
export type { SelectProps, SelectOption };
