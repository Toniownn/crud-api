import { CustomersTable } from "../components/CustomersTable";

export function AdminCustomersPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl tracking-tight text-text-primary">
        Customers
      </h1>
      <CustomersTable />
    </div>
  );
}
