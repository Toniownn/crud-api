import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export const Input = forwardRef(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "min-h-11 w-full rounded-sm border bg-surface px-4 text-sm text-text-primary placeholder-text-muted outline-none transition-colors duration-fast",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          error ? "border-error" : "border-border focus:border-brand",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
});
