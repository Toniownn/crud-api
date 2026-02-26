import api from './axios';

export const getAllProducts = () =>
  api.get('/products/get-all-product');

export const createProduct = (product) =>
  api.post('/products/create-product', product);

export const updateProduct = (id, product) =>
  api.put(`/products/update-product?id=${id}`, product);

export const deleteProduct = (id) =>
  api.delete(`/products/delete-product?id=${id}`);
