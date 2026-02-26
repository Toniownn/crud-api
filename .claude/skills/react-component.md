# React Component Generator

Generate React components that follow this project's conventions.

## Conventions

- **Styling:** Tailwind CSS v4 utility classes (no CSS modules, no styled-components)
- **HTTP:** Use the shared axios instance at `client/src/api/axios.js` which auto-attaches JWT tokens
- **Auth:** Access auth state via `useAuth()` from `client/src/context/AuthContext.jsx`
- **Routing:** react-router-dom v7 (`useNavigate`, `Link`, `Navigate`)
- **State:** React hooks (`useState`, `useEffect`) — no external state library
- **File location:** Pages go in `client/src/pages/`, reusable components in `client/src/components/`
- **Exports:** Default export per file, function declarations (not arrow)

## Template — Page Component

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function PageName() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/endpoint')
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Page Title</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {/* content */}
    </div>
  );
}
```

## Template — Reusable Component

```jsx
export default function ComponentName({ prop1, prop2 }) {
  return (
    <div className="bg-white shadow rounded p-4">
      {/* content */}
    </div>
  );
}
```

## API Pattern

Create API functions in `client/src/api/` that wrap the shared axios instance:

```js
import api from './axios';

export const fetchItems = () => api.get('/items');
export const createItem = (data) => api.post('/items', data);
```

## Key Patterns

- Forms: controlled inputs with `useState`, `onSubmit` with `e.preventDefault()`
- Error display: `{error && <p className="text-red-600 text-sm mb-4">{error}</p>}`
- Protected pages: wrap in `<ProtectedRoute>` inside `App.jsx` routes
- Loading states: `disabled:bg-blue-400` on buttons, conditional text
- Backend uses query params for update/delete: `?id=<uuid>`
