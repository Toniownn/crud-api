import { api } from "../../lib/api";

export function fetchProfile() {
  return api("/api/customer/profile");
}

export function updateProfile(data) {
  return api("/api/customer/profile", {
    method: "PUT",
    body: data,
  });
}

export function updateProfileImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return api("/api/customer/profile-image", {
    method: "PUT",
    body: formData,
  });
}

export function changePassword(data) {
  return api("/api/customer/change-password", {
    method: "PUT",
    body: data,
  });
}

export function fetchOrders() {
  return api("/api/orders/my-orders");
}

export function fetchOrderDetail(id) {
  return api(`/api/orders/detail?id=${encodeURIComponent(id)}`);
}

export function cancelOrder(id) {
  return api(`/api/orders/cancel?id=${encodeURIComponent(id)}`, {
    method: "PUT",
  });
}
