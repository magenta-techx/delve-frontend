import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import Loader from './Loader';
// import Loader from '../business/Loader';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'neutral'
    | 'black'
    | 'white'
    | 'link';

  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  isSubmitting?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      asChild = false,
      children,
      icon,
      isSubmitting = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center w-full hover:cursor-pointer capitalize font-inter justify-center rounded-md sm:text-sm text-xs font-medium focus:outline-none focus:border-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground';

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/50',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: ' bg-tranparent text-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'bg-transparent',
      link: 'text-primary underline-offset-4 hover:underline',
      neutral: 'bg-neutral text-neutral-foreground border border-neutral-200',
      black: 'bg-black text-white',
      white: 'bg-white text-black',
    };

    const sizeClasses = {
      default: 'h-12 px-4',
      sm: 'h-9 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${size && sizeClasses[size]} ${className}`;

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={classes} ref={ref} {...props}>
        <span className='inline-flex items-center gap-2'>
          {icon && icon}
          {children}
          {isSubmitting && <Loader />}
        </span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
