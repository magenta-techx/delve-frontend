import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Field, FieldProps } from 'formik';
import EyeOpenIcon from '@/assets/icons/form/EyeOpenIcon';
import EyeClosedIcon from '@/assets/icons/form/EyeClosedIcon';

type InputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  validate?: (value: string) => string | undefined;
  icon?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { name, label, placeholder, type = 'text', className = '', icon, validate },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Field name={name} validate={validate}>
        {({ field, form, meta }: FieldProps) => {
          const isPassword = type === 'password';
          const inputType = isPassword && !showPassword ? 'password' : 'text';
          const hasValue = !!field.value;

          return (
            <div className={`flex flex-col gap-1 ${className}`}>
              {label && (
                <label htmlFor={name} className='text-sm'>
                  {label}
                </label>
              )}

              <div className='relative flex items-center'>
                <input
                  id={name}
                  type={inputType}
                  placeholder={placeholder}
                  {...field}
                  ref={ref} // forward the ref
                  className={`w-full rounded-md border p-2 font-inter text-[16px] focus:border-primary focus:outline-none sm:p-3 sm:text-xs ${
                    meta.touched && meta.error
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />

                {/* Clear text button */}
                {icon && hasValue && !isPassword && (
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

Input.displayName = 'Input';

export default Input;
export type { InputProps };
