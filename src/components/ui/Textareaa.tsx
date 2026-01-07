import * as React from 'react';
import { cn } from '@/lib/utils';
import { formFieldVariants, type FormFieldVariants } from './FormVariants';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldVariants {
  haserror?: boolean;
  errormessage?: string | undefined;
  errormessageClass?: string;
  labelClassName?: string;
  containerClassName?: string;
  label?: string;
  footer?: React.ReactNode;
  optional?: boolean;
  showCharCount?: boolean;
  maxCharCount?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      haserror,
      errormessageClass,
      labelClassName,
      label,
      footer,
      optional,
      variant,
      size,
      showCharCount,
      maxCharCount,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = String(value || '').length;
    
    return (
      <div className={cn('flex flex-col gap-2', containerClassName)}>
        {label && (
          <label className={cn('text-sm font-medium text-[#0F172B]', labelClassName )}htmlFor={label}>
            {label}
            {!optional && <span className='font-medium text-red-400'> *</span>}
          </label>
        )}
        <div className='relative'>
          <textarea
            className={cn(
              formFieldVariants({ variant, size }),
              'min-h-[80px] resize-none',
              haserror && 'border-destructive focus-visible:border-destructive',
              showCharCount && 'pb-7',
              className
            )}
            ref={ref}
            id={label}
            value={value}
            {...props}
          />
          {showCharCount && (
            <div className='absolute bottom-2 right-3 text-xs text-gray-500'>
              {charCount}/{maxCharCount || '∞'}
            </div>
          )}
        </div>
        {footer && footer}
        {haserror && props.errormessage && (
          <p className={cn('text-sm text-destructive', errormessageClass)}>
            {props.errormessage}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
