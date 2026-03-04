import { api } from "../../lib/api";

export function fetchDashboard() {
  return api("/api/admin/dashboard");
}

export function fetchOrders(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return api(`/api/admin/orders${query}`);
}

export function updateOrderStatus(orderId, status) {
  return api("/api/admin/orders/status", {
    method: "PUT",
    body: { order_id: orderId, status },
  });
}

export function fetchUsers() {
  return api("/api/admin/users");
}

export function toggleUserStatus(id) {
  return api(`/api/admin/users/toggle-status?id=${encodeURIComponent(id)}`, {
    method: "PUT",
  });
}

export function fetchProducts() {
  return api("/api/products/get-all-product");
}

export function deleteProduct(id) {
  return api(`/api/products/delete-product?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function createProduct(data) {
  const formData = buildProductFormData(data);
  return api("/api/products/create-product", {
    method: "POST",
    body: formData,
  });
}

export function updateProduct(id, data) {
  const formData = buildProductFormData(data);
  return api(`/api/products/update-product?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: formData,
  });
}

function buildProductFormData(data) {
  const formData = new FormData();
  const { image, ...fields } = data;
  for (const [key, value] of Object.entries(fields)) {
    if (value != null) formData.append(key, value);
  }
  if (image instanceof File) {
    formData.append("image", image);
  }
  return formData;
}

export function deleteOrder(id) {
  return api(`/api/admin/orders?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function updateUser(data) {
  return api("/api/admin/users/update", {
    method: "PUT",
    body: data,
  });
}

export function deleteUser(id) {
  return api(`/api/admin/users?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
