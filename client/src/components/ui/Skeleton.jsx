import { cn } from "../../lib/cn";

export function Skeleton({ className }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-surface-alt", className)}
      aria-hidden="true"
    />
  );
}
