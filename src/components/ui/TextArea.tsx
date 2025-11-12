import * as React from "react";
import { cn } from "@/lib/utils";
import { formFieldVariants, type FormFieldVariants } from "./FormVariants";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    FormFieldVariants {
  hasError?: boolean;
  errorMessage?: string | undefined;
  errorMessageClass?: string;
  containerClassName?: string;
  label?: string;
  footer?: React.ReactNode;
  optional?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      hasError,
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
    return (
      <div className={cn("flex flex-col gap-2", containerClassName)}>
        {label && (
          <label className="text-sm text-[#0F172B] font-medium" htmlFor={label}>
            {label}
            {!optional && <span className="text-red-400 font-medium"> *</span>}
          </label>
        )}
        <textarea
          className={cn(
            formFieldVariants({ variant, size }),
            "min-h-[80px] resize-none",
            hasError && "border-destructive focus-visible:border-destructive",
            className
          )}
          ref={ref}
          id={label}
          {...props}
        />
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
Textarea.displayName = "Textarea";

export { Textarea };
