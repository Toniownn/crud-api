import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { fetchProducts, deleteProduct } from "../api";
import { formatPrice } from "../../../lib/format";
import { Modal } from "../../../components/ui/Modal";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { ProductForm } from "./ProductForm";

export function ProductsTable() {
  const { data, loading, error, refetch } = useAdminData(fetchProducts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function handleSaved() {
    setFormOpen(false);
    setEditingProduct(null);
    refetch();
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      refetch();
    } catch {
      /* error shown via refetch */
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error/30 bg-error/5 p-5 text-sm text-error">
        <p>Failed to load products: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 min-h-11 font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <Button onClick={openCreate}>Add Product</Button>
        </div>
        <p className="py-10 text-center text-sm text-text-muted">No products found.</p>
        {formOpen && (
          <ProductForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSaved={handleSaved}
            product={editingProduct}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>Add Product</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 border-b border-border bg-surface text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, i) => (
              <tr
                key={product.id}
                className={cn(
                  "border-b border-border last:border-b-0",
                  i % 2 !== 0 && "bg-surface-alt",
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ src: product.image_url, alt: product.product_name })}
                        className="min-h-11 flex-shrink-0 cursor-zoom-in"
                      >
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          className="h-12 max-w-20 rounded object-contain"
                        />
                      </button>
                    ) : (
                      <div className="h-10 w-10 rounded bg-surface-alt" />
                    )}
                    <span className="font-medium text-text-primary">
                      {product.product_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {product.product_category}
                </td>
                <td className="px-4 py-3 tabular-nums text-text-primary">
                  {formatPrice({ amount: product.price, currency: "USD" })}
                </td>
                <td className="px-4 py-3 tabular-nums text-text-secondary">
                  {product.quantity}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-error/10"
                      onClick={() => handleDelete(product.id, product.product_name)}
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

      {formOpen && (
        <ProductForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
          product={editingProduct}
        />
      )}

      <Modal
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.alt || "Product Image"}
        className="max-w-2xl"
      >
        {previewImage && (
          <img
            src={previewImage.src}
            alt={previewImage.alt}
            className="w-full rounded-lg object-contain"
          />
        )}
      </Modal>
    </div>
  );
}
