import api from './axios';

export const checkout = (shipping_address) => api.post('/orders/checkout', { shipping_address });
export const getMyOrders = () => api.get('/orders/my-orders');
export const getOrderDetail = (id) => api.get(`/orders/detail?id=${id}`);
export const cancelOrder = (id) => api.put(`/orders/cancel?id=${id}`);
