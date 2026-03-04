import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { fetchOrders, updateOrderStatus, deleteOrder } from "../api";
import { formatPrice } from "../../../lib/format";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { cn } from "../../../lib/cn";

const STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_VARIANTS = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export function OrdersTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filterArg = statusFilter === "all" ? undefined : statusFilter;
  const { data, loading, error, refetch } = useAdminData(
    () => fetchOrders(filterArg),
    [filterArg],
  );

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      refetch();
    } catch {
      /* error shown via refetch */
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(orderId);
      refetch();
    } catch {
      /* error shown via refetch */
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "min-h-11 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors duration-fast",
              statusFilter === s
                ? "bg-brand text-white"
                : "bg-surface text-text-secondary hover:bg-surface-alt hover:text-text-primary",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-error/30 bg-error/5 p-5 text-sm text-error">
          <p>Failed to load orders: {error}</p>
          <button
            onClick={refetch}
            className="mt-2 min-h-11 font-medium underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data?.length === 0 && (
        <p className="py-10 text-center text-sm text-text-muted">No orders found.</p>
      )}

      {!loading && !error && data?.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-border bg-surface text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, i) => (
                <tr
                  key={order.id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    i % 2 !== 0 && "bg-surface-alt",
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {order.customer
                      ? `${order.customer.fname} ${order.customer.lname}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-text-primary">
                    {formatPrice({ amount: order.total_amount, currency: "USD" })}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {order.placed_at
                      ? new Date(Number(order.placed_at)).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[order.status] || "neutral"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="min-h-11 rounded border border-border bg-surface px-2 py-1 text-sm text-text-primary"
                      >
                        {VALID_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
