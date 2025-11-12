import * as React from "react";

import { cn } from "@/lib/utils";
type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "default" | "lg";
export type FormFieldVariants = { variant?: Variant | undefined; size?: Size | undefined };

function formFieldVariants({ variant = "default", size = "default" }: { variant?: Variant | undefined; size?: Size | undefined } = {}): string {
  const base =
    "flex w-full min-w-0 rounded-xl transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
  const variants: Record<Variant, string> = {
    default: "border border-[#D9D9D9] bg-white focus:border-primary focus-visible:border-primary ",
    outline: "border border-primary bg-background focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
    ghost: "border-0 bg-transparent focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 py-2 text-sm",
    default: "h-12 px-4 py-3 text-sm",
    lg: "h-14 px-4 py-3 text-lg",
  };
  return [base, variants[variant], sizes[size]].join(" ");
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    FormFieldVariants {
  hasError?: boolean;
  errorMessage?: string | undefined;
  errorMessageClass?: string;
  leftIcon?: React.ReactNode;
  leftIconContainerClass?: string;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  label?: string;
  footer?: React.ReactNode;
  optional?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type,
      hasError,
      leftIcon,
      leftIconContainerClass,
      rightIcon,
      errorMessageClass,
      label,
      footer,
      optional,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = showPassword ? "text" : "password";

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label className="text-sm text-[#0F172B] font-inter font-medium" htmlFor={label}>
            {label}
            {!optional && <span className="text-red-400 font-medium"> *</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer",
                leftIconContainerClass
              )}
            >
              {leftIcon}
            </span>
          )}
          <input
            type={type === "password" ? inputType : type}
            id={label}
            className={cn(
              formFieldVariants({ variant, size }),
              type === "password" && "pr-12",
              Boolean(leftIcon) && "pl-12",
              Boolean(rightIcon) && "pr-12",
              hasError && "border-destructive focus-visible:border-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
              {rightIcon}
            </span>
          )}
          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {footer && footer}
        {hasError && props.errorMessage && (
          <p className={cn("text-sm text-destructive", errorMessageClass)}>
            {props.errorMessage}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
