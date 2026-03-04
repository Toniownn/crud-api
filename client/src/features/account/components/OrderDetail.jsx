import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchOrderDetail, cancelOrder } from "../api";
import { formatPrice } from "../../../lib/format";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";

const STATUS_VARIANTS = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchOrderDetail(orderId)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel() {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      await cancelOrder(orderId);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-error/30 bg-error/5 p-5 text-sm text-error">
        <p>Failed to load order: {error}</p>
        <button
          onClick={load}
          className="mt-2 min-h-11 font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!order) return null;

  const items = order.OrderItems || [];

  return (
    <div>
      <Link
        to="/account/orders"
        className="inline-flex min-h-11 items-center text-sm text-text-muted transition-colors duration-fast hover:text-text-primary"
      >
        &larr; Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
            Order #{order.id.slice(0, 8)}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {order.placed_at
              ? new Date(Number(order.placed_at)).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={STATUS_VARIANTS[order.status] || "neutral"}>
            {order.status}
          </Badge>
          {order.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              className="text-error hover:bg-error/10"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel order"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((item) => {
          const product = item.product;
          return (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-border p-4"
            >
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-surface-alt">
                {product?.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
                    No img
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {product?.product_name || "Product"}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="mt-2 text-sm font-medium tabular-nums text-text-primary sm:mt-0">
                  {formatPrice({ amount: item.price_at_time, currency: "USD" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end border-t border-border pt-4">
        <div className="text-right">
          <p className="text-sm text-text-muted">Total</p>
          <p className="text-lg font-semibold tabular-nums text-text-primary">
            {formatPrice({ amount: order.total_amount, currency: "USD" })}
          </p>
        </div>
      </div>
    </div>
  );
}
