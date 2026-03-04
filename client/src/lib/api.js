import { useAuthStore } from "./auth-store";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeProduct(p) {
  return {
    id: p.id,
    name: p.product_name,
    slug: slugify(p.product_name),
    price: { amount: p.price, currency: "USD" },
    image: p.image_url,
    category: p.product_category,
    description: p.description,
  };
}

export async function api(path, options = {}) {
  const { token, logout } = useAuthStore.getState();
  const { body, ...rest } = options;

  const isFormData = body instanceof FormData;
  const headers = isFormData ? {} : { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, {
    ...rest,
    headers: { ...headers, ...rest.headers },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    logout();
    throw new Error("Session expired");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}
