# Skill: Create Frontend API Module

## When to Use
When you need to create a new API module to call backend endpoints from the React frontend.

## Conventions
- Location: `client/src/api/<name>.js`
- Import `api` from `./axios` (pre-configured instance with JWT interceptor)
- Export named arrow functions for each API call
- Base URL is already `/api` — paths should be relative (e.g., `/cart/get-cart`)
- Query params: append to URL string (e.g., `/products/detail?id=${id}`)
- Request bodies: pass as second argument to `api.post()` / `api.put()`
- Destructure object params when caller passes an object (e.g., `addToCart({ product_id, quantity })`)

## Template
```js
import api from './axios';

export const getAll = () => api.get('/prefix/get-all');
export const getById = (id) => api.get(`/prefix/detail?id=${id}`);
export const create = (data) => api.post('/prefix/create', data);
export const update = (id, data) => api.put(`/prefix/update?id=${id}`, data);
export const remove = (id) => api.delete(`/prefix/remove?id=${id}`);
```

## After Creating
- Import and use in page components (`client/src/pages/`)
- Functions return axios promises — destructure `{ data }` in callers
