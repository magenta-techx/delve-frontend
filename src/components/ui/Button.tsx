import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#5F2EEA] text-primary-foreground shadow hover:bg-primary/90 disabled:!bg-[#E3E8EF] disabled:text-black/50',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        light: 'bg-[#FBFAFF] text-black hover:bg-[#F0F0FF]',
        black: 'bg-black text-white',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        neutral: 'bg-[#F8FAFC] border border-[#E3E8EF] text-black font-inter',
        unstyled: '',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        md: 'h-10 rounded-lg px-6',
        lg: 'h-12 rounded-lg px-8 text-[0.9rem]',
        xl: 'h-14 rounded-xl px-8 text-[0.9rem] font-medium',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  isloading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      isloading,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const loading = Boolean(isLoading ?? isloading);
    const iconNode =
      !loading && icon ? (
        <span aria-hidden className='inline-flex items-center'>
          {icon}
        </span>
      ) : null;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-busy={loading}
        data-loading={loading ? 'true' : undefined}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 aria-hidden className='h-4 w-4 animate-spin' />
            {children}
          </>
        ) : iconNode && iconPosition === 'right' ? (
          <>
            {children}
            {iconNode}
          </>
        ) : (
          <>
            {iconNode}
            {children}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
