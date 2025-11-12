export type Variant = "default" | "outline" | "ghost";
export type Size = "sm" | "default" | "lg";

export function formFieldVariants({ variant = "default", size = "default" }: { variant?: Variant | undefined; size?: Size | undefined } = {}): string {
  const base =
    "flex w-full min-w-0 rounded-lg transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
  const variants: Record<Variant, string> = {
    default: "border-[0.4px] border-[#D9D9D9] bg-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    outline: "border border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    ghost: "border-0 bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 py-2 text-sm",
    default: "h-12 px-4 py-3 text-sm",
    lg: "h-14 px-4 py-3 text-lg",
  };
  return [base, variants[variant], sizes[size]].join(" ");
}

export type FormFieldVariants = { variant?: Variant | undefined; size?: Size | undefined };
