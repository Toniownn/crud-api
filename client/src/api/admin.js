import api from './axios';

export const getDashboard = () => api.get('/admin/dashboard');
export const getAllOrders = (status) => api.get('/admin/orders', { params: status ? { status } : {} });
export const updateOrderStatus = (order_id, status) => api.put('/admin/orders/status', { order_id, status });
export const getAllUsers = () => api.get('/admin/users');
export const toggleUserStatus = (id) => api.put(`/admin/users/toggle-status?id=${id}`);
