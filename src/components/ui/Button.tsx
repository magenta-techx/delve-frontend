import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'neutral'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
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
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center w-full capitalize font-inter justify-center rounded-md text-sm font-medium focus:outline-none focus:border-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground';

    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/50',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'bg-transparent',
      link: 'text-primary underline-offset-4 hover:underline',
      neutral: 'bg-neutral text-neutral-foreground border border-neutral-200',
    };

    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={classes} ref={ref} {...props}>
        <span className='inline-flex items-center gap-2'>
          {icon && icon}
          {children}
        </span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
