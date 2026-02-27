## Frontend Architecture

- **Framework:** React v19.2.0 with Vite 7.3.1
- **Styling:** Tailwind CSS v4.2.1 (via `@tailwindcss/vite` plugin)
- **Routing:** react-router-dom v7.13.1
- **HTTP:** axios v1.13.5 with JWT interceptor (`client/src/api/axios.js`)
- **Auth state:** React Context (`client/src/context/AuthContext.jsx`) stores JWT + customer info + role in localStorage, exposes `isAdmin`

## Components

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top navigation with role-conditional links |
| `ProtectedRoute.jsx` | Auth gate — redirects unauthenticated to `/login` |
| `AdminRoute.jsx` | Admin gate — redirects non-admins to `/catalog` |
| `AdminLayout.jsx` | Sidebar layout for admin pages |
| `AlertModal.jsx` | Success/error feedback modal |

## API Modules (`client/src/api/`)

| Module | Backend Prefix | Description |
|--------|---------------|-------------|
| `axios.js` | — | Shared instance + JWT interceptor |
| `auth.js` | `/api/auth` | Login, register |
| `products.js` | `/api/products` | Admin CRUD operations |
| `catalog.js` | `/api/products` | Public browsing (search, filter, detail) |
| `cart.js` | `/api/cart` | Cart management |
| `orders.js` | `/api/orders` | Checkout, order history |
| `customer.js` | `/api/customer` | Profile, password change |
| `admin.js` | `/api/admin` | Dashboard, order/user management |
| `assistant.js` | `/api/assistant` | AI assistant |

## Client File Layout

```
client/src/
├── api/
│   ├── axios.js, auth.js, products.js, catalog.js
│   ├── cart.js, orders.js, customer.js, admin.js, assistant.js
├── context/AuthContext.jsx
├── components/
│   ├── Navbar.jsx, ProtectedRoute.jsx, AdminRoute.jsx
│   ├── AdminLayout.jsx, AlertModal.jsx
├── pages/
│   ├── Login.jsx, Register.jsx, Catalog.jsx, ProductDetail.jsx
│   ├── Products.jsx, Cart.jsx, Checkout.jsx
│   ├── OrderHistory.jsx, OrderDetail.jsx, Profile.jsx, Assistant.jsx
│   └── admin/ (Dashboard.jsx, OrderManagement.jsx, UserManagement.jsx)
├── App.jsx
└── main.jsx
```
