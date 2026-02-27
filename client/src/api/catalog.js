import api from './axios';

export const searchProducts = (params) =>
  api.get('/products/catalog', { params });

export const getCategories = () =>
  api.get('/products/categories');

export const getProductById = (id) =>
  api.get(`/products/detail?id=${id}`);
