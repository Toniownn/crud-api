import { create } from "zustand";

const STORAGE_KEY = "anthonix-auth";

function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage */
  }
  return { token: null, customer: null };
}

export const useAuthStore = create((set) => ({
  ...loadPersistedAuth(),

  setAuth(token, customer) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, customer }));
    set({ token, customer });
  },

  updateCustomer(partial) {
    const { token, customer } = useAuthStore.getState();
    const updated = { ...customer, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, customer: updated }));
    set({ customer: updated });
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, customer: null });
  },
}));
