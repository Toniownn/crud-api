import { Link } from "react-router-dom";
import { formatPrice } from "../../../lib/format";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { cn } from "../../../lib/cn";

const STATUS_VARIANTS = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export function OrdersList({ orders, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-error/30 bg-error/5 p-5 text-sm text-error">
        <p>Failed to load orders: {error}</p>
        <button
          onClick={onRetry}
          className="mt-2 min-h-11 font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted">No orders yet.</p>
        <Link
          to="/shop"
          className="mt-3 inline-block text-sm font-medium text-brand underline underline-offset-2 transition-colors duration-fast hover:text-brand-dark"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, i) => (
        <Link
          key={order.id}
          to={`/account/orders/${order.id}`}
          className={cn(
            "flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors duration-fast hover:border-brand/40 hover:bg-surface-alt sm:flex-row sm:items-center sm:justify-between",
          )}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-primary">
              Order #{order.id.slice(0, 8)}
            </p>
            <p className="text-xs text-text-muted">
              {order.placed_at
                ? new Date(Number(order.placed_at)).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  )
                : "—"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">
              {order.OrderItems?.length || 0}{" "}
              {order.OrderItems?.length === 1 ? "item" : "items"}
            </span>
            <span className="text-sm font-medium tabular-nums text-text-primary">
              {formatPrice({ amount: order.total_amount, currency: "USD" })}
            </span>
            <Badge variant={STATUS_VARIANTS[order.status] || "neutral"}>
              {order.status}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
