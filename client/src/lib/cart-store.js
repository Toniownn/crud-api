import { create } from "zustand";
import { api, normalizeProduct } from "./api";
import { useAuthStore } from "./auth-store";

function isAuthenticated() {
  return !!useAuthStore.getState().token;
}

export const useCartStore = create((set, get) => ({
  items: [],

  async loadCart() {
    if (!isAuthenticated()) {
      set({ items: [] });
      return;
    }
    try {
      const data = await api("/api/cart/get-cart");
      const items = data.items.map((item) => ({
        product: normalizeProduct(item.product),
        quantity: item.quantity,
        _serverItemId: item.id,
      }));
      set({ items });
    } catch {
      set({ items: [] });
    }
  },

  async addItem(product, quantity = 1) {
    if (!isAuthenticated()) return;
    try {
      await api("/api/cart/add-item", {
        method: "POST",
        body: { product_id: product.id, quantity },
      });
      await get().loadCart();
    } catch {
      /* silent */
    }
  },

  async updateQuantity(productId, quantity) {
    if (quantity < 1 || !isAuthenticated()) return;
    const item = get().items.find((i) => i.product.id === productId);
    if (!item?._serverItemId) return;
    try {
      await api("/api/cart/update-item", {
        method: "PUT",
        body: { item_id: item._serverItemId, quantity },
      });
      await get().loadCart();
    } catch {
      /* silent */
    }
  },

  async removeItem(productId) {
    if (!isAuthenticated()) return;
    const item = get().items.find((i) => i.product.id === productId);
    if (!item?._serverItemId) return;
    try {
      await api(`/api/cart/remove-item?id=${item._serverItemId}`, {
        method: "DELETE",
      });
      await get().loadCart();
    } catch {
      /* silent */
    }
  },

  clearCart() {
    set({ items: [] });
  },

  totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

// Clear cart when user logs out
useAuthStore.subscribe((state, prev) => {
  if (prev.token && !state.token) {
    useCartStore.getState().clearCart();
  }
});
