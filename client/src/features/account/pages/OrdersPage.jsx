import { useState, useEffect, useCallback } from "react";
import { fetchOrders } from "../api";
import { AccountLayout } from "../components/AccountLayout";
import { OrdersList } from "../components/OrdersList";

export function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <AccountLayout>
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        Order History
      </h2>
      <div className="mt-4">
        <OrdersList
          orders={orders}
          loading={loading}
          error={error}
          onRetry={loadOrders}
        />
      </div>
    </AccountLayout>
  );
}
