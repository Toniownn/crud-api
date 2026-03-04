import { cn } from "../../lib/cn";

const variantStyles = {
  default: "bg-brand/15 text-brand",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
  info: "bg-info/15 text-info",
  neutral: "bg-neutral-500/15 text-text-secondary",
};

export function Badge({ variant = "default", children, className }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
