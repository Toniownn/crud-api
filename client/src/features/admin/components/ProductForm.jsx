import { useState, useRef } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { createProduct, updateProduct } from "../api";
import { cn } from "../../../lib/cn";

export function ProductForm({ open, onClose, onSaved, product }) {
  const isEdit = Boolean(product);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    product_name: product?.product_name || "",
    product_category: product?.product_category || "",
    price: product?.price != null ? String(product.price) : "",
    quantity: product?.quantity != null ? String(product.quantity) : "",
    description: product?.description || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    if (imageFile) {
      payload.image = imageFile;
    }

    try {
      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Product" : "Add Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product Name"
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Category"
          name="product_category"
          value={form.product_category}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (cents)"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Product Image
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className={cn(
                  "absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center",
                  "rounded-full bg-error text-white shadow-sm transition-opacity duration-fast hover:opacity-80",
                )}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="10" y2="10" />
                  <line x1="10" y1="2" x2="2" y2="10" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-border",
                "text-sm text-text-muted transition-colors duration-fast",
                "hover:border-brand hover:text-brand",
              )}
            >
              Click to upload image
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {imagePreview && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-sm text-brand underline underline-offset-2 transition-colors duration-fast hover:text-text-primary"
            >
              Replace image
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-text-primary"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="min-h-11 w-full rounded-sm border border-border bg-surface px-4 py-2 text-sm text-text-primary placeholder-text-muted outline-none transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </div>

        {error && (
          <p className="text-sm text-error">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
