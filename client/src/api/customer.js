import api from './axios';

export const getProfile = () => api.get('/customer/profile');
export const updateProfile = (data) => api.put('/customer/profile', data);
export const changePassword = (current_password, new_password) =>
  api.put('/customer/change-password', { current_password, new_password });
