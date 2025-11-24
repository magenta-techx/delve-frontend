"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuContent({ className, align = "end", sideOffset = 8, ...props }: DropdownMenuPrimitive.DropdownMenuContentProps & { className?: string }): JSX.Element {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={clsx(
          "z-50 min-w-[220px] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md focus:outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, inset, ...props }: DropdownMenuPrimitive.DropdownMenuItemProps & { inset?: boolean }): JSX.Element {
  return (
    <DropdownMenuPrimitive.Item
      className={clsx(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 outline-none",
        "focus:bg-gray-100 focus:text-gray-900",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, inset, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }): JSX.Element {
  return (
    <DropdownMenuPrimitive.Label
      className={clsx("px-2 py-1.5 text-xs font-semibold text-gray-500", inset && "pl-8", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>): JSX.Element {
  return (
    <DropdownMenuPrimitive.Separator
      className={clsx("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): JSX.Element {
  return (
    <span className={clsx("ml-auto text-xs tracking-widest text-gray-400", className)} {...props} />
  );
}

export function DropdownMenuSubTrigger({ className, inset, children, ...props }: DropdownMenuPrimitive.DropdownMenuSubTriggerProps & { inset?: boolean }): JSX.Element {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={clsx(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-2 outline-none",
        "focus:bg-gray-100 focus:text-gray-900",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <span className="ml-auto">›</span>
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({ className, ...props }: DropdownMenuPrimitive.DropdownMenuSubContentProps): JSX.Element {
  return (
    <DropdownMenuPrimitive.SubContent
      className={clsx(
        "z-50 min-w-[200px] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md",
        className
      )}
      {...props}
    />
  );
}
