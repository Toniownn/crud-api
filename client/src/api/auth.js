import api from './axios';

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const register = ({ fname, lname, address, username, password }) =>
  api.post('/auth/register', { fname, lname, address, username, password });
