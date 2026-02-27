## Authentication & Authorization

1. **Register** (`POST /api/auth/register`): creates Customer + CustomerAuth with bcrypt-hashed password, default role `user`.
2. **Login** (`POST /api/auth/login`): validates credentials, rejects if `disabled`, returns JWT (24h expiry) with `customer_id`, `username`, `role`.
3. **JWT middleware** (`server/middleware/auth.js`): verifies Bearer token, attaches decoded payload to `req.user`.
4. **Admin middleware** (`server/middleware/adminAuth.js`): checks `req.user.role === 'admin'`, returns 403 if not.

## Auth Patterns in Routes

- **Public:** no middleware
- **Authenticated:** `authenticate`
- **Admin only:** `authenticate, adminAuth`
- **Mixed (same file):** add public routes first, then protected routes
