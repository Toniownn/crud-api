## Pages & Routing

| Page | Path | Access | Description |
|------|------|--------|-------------|
| Catalog | `/catalog` | Public | Product grid with search, filters, pagination |
| ProductDetail | `/product/:id` | Public | Single product view with "Add to Cart" |
| Login | `/login` | Public | Auth form |
| Register | `/register` | Public | Auth form |
| Cart | `/cart` | Protected | Cart items table, quantity controls, totals |
| Checkout | `/checkout` | Protected | Order summary, shipping address form |
| OrderHistory | `/orders` | Protected | Order list with status badges |
| OrderDetail | `/orders/:id` | Protected | Order with items, cancel button |
| Profile | `/profile` | Protected | Edit profile + change password |
| Products | `/products` | Admin | CRUD table for product management |
| Dashboard | `/admin/dashboard` | Admin | Stats cards + recent orders |
| OrderManagement | `/admin/orders` | Admin | All orders with status updates |
| UserManagement | `/admin/users` | Admin | User list with enable/disable |
| Assistant | `/assistant` | Protected | OpenAI assistant lookup by ID |

## Route Protection

- `ProtectedRoute` — redirects unauthenticated users to `/login`
- `AdminRoute` — redirects non-admins to `/catalog`
- Default redirect: `/*` → `/catalog`
