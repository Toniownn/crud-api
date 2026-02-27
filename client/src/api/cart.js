import api from './axios';

export const getCart = () => api.get('/cart/get-cart');
export const addToCart = ({ product_id, quantity }) => api.post('/cart/add-item', { product_id, quantity });
export const updateCartItem = (item_id, quantity) => api.put('/cart/update-item', { item_id, quantity });
export const removeFromCart = (id) => api.delete(`/cart/remove-item?id=${id}`);
export const clearCart = () => api.delete('/cart/clear');
