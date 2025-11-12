'use client'
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { type VariantProps } from 'class-variance-authority';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formFieldVariants } from './FormVariants';

const SelectContext = React.createContext<{
  value: string | undefined;
}>({ value: undefined });

function Select({
  children,
  value,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>): JSX.Element {
  const rootProps = value === undefined ? props : { ...props, value };
  return (
    <SelectContext.Provider value={{ value }}>
      <SelectPrimitive.Root data-slot='select' {...rootProps}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>): JSX.Element {
  return <SelectPrimitive.Group data-slot='select-group' {...props} />;
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>): JSX.Element {
  return (
    <SelectPrimitive.Value
      data-slot='select-value'
      className={cn('min-w-0 flex-1 text-sm text-inherit', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size,
  variant,
  label,
  hasError,
  errorMessage,
  errorMessageClass,
  containerClassName,
  valueClassName,
  optional,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof formFieldVariants> & {
    label?: string;
    hasError?: boolean;
    errorMessage?: string;
    errorMessageClass?: string;
    containerClassName?: string;
    valueClassName?: string;
    optional?: boolean;
  }): JSX.Element {
  const { value } = React.useContext(SelectContext);
  const isPlaceholder = !value || String(value).trim() === '';

  const trigger = (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn(
        formFieldVariants({ variant, size }),
        'flex cursor-pointer items-center justify-between overflow-hidden',
        hasError && 'border-destructive focus-visible:border-destructive',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate whitespace-nowrap pr-2 text-left',
          valueClassName,
          isPlaceholder && 'text-muted-foreground'
        )}
      >
        {children}
      </span>
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className='size-4 shrink-0 opacity-50' />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );

  if (label || hasError) {
    return (
      <div className={cn('flex flex-col gap-2', containerClassName)}>
        {label && (
          <label
            className='text-sm font-medium text-[#0F172B]'
            htmlFor={props.id}
          >
            {label}
            {!optional && <span className='font-medium text-red-400'> *</span>}
          </label>
        )}
        {trigger}
        {hasError && errorMessage && (
          <p className={cn('text-sm text-destructive', errorMessageClass)}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return trigger;
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>): JSX.Element {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        className={cn(
          'max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) relative z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>): JSX.Element {
  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>): JSX.Element {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        "outline-hidden *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}  
    >
      {children}
      {/* <SelectPrimitive.ItemText></SelectPrimitive.ItemText> */}
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>): JSX.Element {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <ChevronUpIcon className='size-4' />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <ChevronDownIcon className='size-4' />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
