import { OrdersTable } from "../components/OrdersTable";

export function AdminOrdersPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl tracking-tight text-text-primary">
        Orders
      </h1>
      <OrdersTable />
    </div>
  );
}
