import { cn } from "../../lib/cn";
import { formatPrice } from "../../lib/format";

export function PriceDisplay({ price, className }) {
  return (
    <span className={cn("tabular-nums text-text-primary", className)}>
      {formatPrice(price)}
    </span>
  );
}
