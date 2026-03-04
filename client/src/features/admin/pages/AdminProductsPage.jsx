import { ProductsTable } from "../components/ProductsTable";

export function AdminProductsPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl tracking-tight text-text-primary">
        Products
      </h1>
      <ProductsTable />
    </div>
  );
}
