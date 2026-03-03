import { cn } from "../../lib/cn";

export function Badge({ children, className }) {
  return (
    <span
      className={cn(
        "inline-block bg-brand px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
