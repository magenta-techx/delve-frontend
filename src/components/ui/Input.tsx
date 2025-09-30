'use client';
import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Field, FieldProps } from 'formik';
import EyeOpenIcon from '@/assets/icons/form/EyeOpenIcon';
import EyeClosedIcon from '@/assets/icons/form/EyeClosedIcon';

type InputProps = {
  name: string;
  label?: string | ReactNode;
  placeholder?: string;
  type?: string;
  accepts?: string;
  className?: string;
  inputClass?: string;
  disabled?: boolean;
  validate?: (value: string) => string | undefined;
  onChange?: (value: File | string) => void;
  icon?: ReactNode;
  iconPosition?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      placeholder,
      type = 'text',
      className = '',
      inputClass = 'sm:px-3 sm:py-4 focus:border-primary sm:text-[13px]',
      accepts = 'image/*',
      icon,
      iconPosition = 'right',
      disabled = false,
      validate,
      onChange,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Field name={name} validate={validate}>
        {({ field, form, meta }: FieldProps) => {
          const isPassword = type === 'password';
          const isFile = type === 'file';
          const inputType = isPassword
            ? showPassword
              ? 'text'
              : 'password'
            : type;

          const hasValue = !!field.value;

          return (
            <div className={`flex flex-col gap-1 ${className}`}>
              {label && (
                <label htmlFor={name} className='text-sm font-medium'>
                  {label}
                </label>
              )}

              <div className='relative flex items-center'>
                <input
                  id={name}
                  disabled={disabled}
                  type={inputType}
                  placeholder={placeholder}
                  accept={isFile ? accepts : undefined}
                  ref={ref}
                  // ✅ spread Formik's field props only for non-file inputs
                  {...(!isFile ? field : {})}
                  className={`w-full rounded-md border ${iconPosition === 'left' ? 'pl-8' : 'p-2'} font-inter text-[16px] focus:outline-none ${
                    meta.touched && meta.error
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } ${inputClass}`}
                  onChange={e => {
                    if (isFile) {
                      const file = e.currentTarget.files?.[0] ?? null;
                      form.setFieldValue(name, file);
                      onChange?.(file as File);
                    } else {
                      form.setFieldValue(name, e.target.value);
                      onChange?.(e.target.value);
                    }
                  }}
                />
                {icon && iconPosition === 'left' && (
                  <span className='absolute left-3 text-gray-400 hover:text-gray-600'>
                    {icon}
                  </span>
                )}
                {/* Clear button (for text fields only) */}
                {icon &&
                  iconPosition === 'right' &&
                  hasValue &&
                  !isPassword &&
                  !isFile && (
                    <button
                      type='button'
                      className='absolute right-3 text-gray-400 hover:text-gray-600'
                      onClick={() => form.setFieldValue(name, '')}
                    >
                      {icon}
                    </button>
                  )}
                {/* Password toggle */}
                {isPassword && (
                  <button
                    type='button'
                    className='absolute right-3 text-gray-400 hover:text-gray-600'
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                )}
              </div>

              {/* Validation message */}
              <div className='-mt-2 min-h-[20px] p-0'>
                {meta.touched && meta.error && (
                  <span className='text-xs text-red-500'>
                    {meta.error as string}
                  </span>
                )}
              </div>
            </div>
          );
        }}
      </Field>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export type { InputProps };
