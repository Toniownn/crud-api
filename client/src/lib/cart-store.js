import { create } from "zustand";
import { api, normalizeProduct } from "./api";
import { useAuthStore } from "./auth-store";

function isAuthenticated() {
  return !!useAuthStore.getState().token;
}

export const useCartStore = create((set, get) => ({
  items: [],

  async loadCart() {
    if (!isAuthenticated()) return;
    try {
      const data = await api("/api/cart/get-cart");
      const items = data.items.map((item) => ({
        product: normalizeProduct(item.Product),
        quantity: item.quantity,
        _serverItemId: item.id,
      }));
      set({ items });
    } catch {
      /* silent — cart will stay local */
    }
  },

  async addItem(product, quantity = 1) {
    if (isAuthenticated()) {
      try {
        await api("/api/cart/add-item", {
          method: "POST",
          body: { product_id: product.id, quantity },
        });
        await get().loadCart();
      } catch {
        /* fall through to local */
      }
      return;
    }
    const items = get().items;
    const existing = items.find((item) => item.product.id === product.id);
    if (existing) {
      set({
        items: items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      });
    } else {
      set({ items: [...items, { product, quantity }] });
    }
  },

  async updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    if (isAuthenticated()) {
      const item = get().items.find((i) => i.product.id === productId);
      if (item?._serverItemId) {
        try {
          await api("/api/cart/update-item", {
            method: "PUT",
            body: { item_id: item._serverItemId, quantity },
          });
          await get().loadCart();
        } catch {
          /* fall through to local */
        }
        return;
      }
    }
    set({
      items: get().items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    });
  },

  async removeItem(productId) {
    if (isAuthenticated()) {
      const item = get().items.find((i) => i.product.id === productId);
      if (item?._serverItemId) {
        try {
          await api(`/api/cart/remove-item?id=${item._serverItemId}`, {
            method: "DELETE",
          });
          await get().loadCart();
        } catch {
          /* fall through to local */
        }
        return;
      }
    }
    set({ items: get().items.filter((item) => item.product.id !== productId) });
  },

  totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
