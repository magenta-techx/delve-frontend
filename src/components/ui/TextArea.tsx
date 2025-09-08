'use client';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Field, FieldProps } from 'formik';

type TextAreaProps = {
  name: string;
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
  inputClass?: string;
  validate?: (value: string) => string | undefined;
  maxLength?: number; // optional limit
  rows?: number;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      name,
      label,
      placeholder,
      className = '',
      inputClass = 'sm:p-3 focus:border-primary sm:text-[13px]',
      validate,
      maxLength,
      rows = 4,
    },
    ref
  ) => {
    return (
      <Field name={name} validate={validate}>
        {({ field, meta }: FieldProps) => {
          const value = field.value || '';

          return (
            <div className={`flex flex-col gap-1 ${className}`}>
              {label && (
                <label htmlFor={name} className='text-sm font-medium'>
                  {label}
                </label>
              )}

              <div className='relative'>
                <textarea
                  id={name}
                  placeholder={placeholder}
                  rows={rows}
                  {...field}
                  ref={ref}
                  className={`w-full resize-none rounded-md border p-2 font-inter text-[16px] focus:outline-none ${
                    meta.touched && meta.error
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } ${inputClass}`}
                  maxLength={maxLength}
                />

                {/* Character counter (bottom right) */}
                {maxLength && (
                  <span className='absolute bottom-5 right-3 text-xs text-gray-400'>
                    {value.length}/{maxLength} words
                  </span>
                )}
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

TextArea.displayName = 'TextArea';

export default TextArea;
export type { TextAreaProps };
