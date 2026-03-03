import { cn } from "../../lib/cn";

const variantStyles = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-neutral-800 text-neutral-50 hover:bg-neutral-700",
  outline: "border border-border text-text-primary hover:bg-surface-alt",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-alt",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center font-body font-medium transition-colors duration-fast",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
