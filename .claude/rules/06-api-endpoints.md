## API Endpoints

### Products

**Public (no auth):**
- `GET /api/products/catalog?search=&category=&min_price=&max_price=&page=&limit=` — paginated search
- `GET /api/products/categories` — distinct category list
- `GET /api/products/detail?id=` — single product

**Admin only (JWT + admin):**
- `GET /api/products/get-all-product` — list all
- `POST /api/products/create-product` — create (body payload)
- `PUT /api/products/update-product?id=` — update
- `DELETE /api/products/delete-product?id=` — delete

### Cart (JWT required)

- `GET /api/cart/get-cart` — get cart with items + totals
- `POST /api/cart/add-item` — add `{ product_id, quantity }`
- `PUT /api/cart/update-item` — update `{ item_id, quantity }`
- `DELETE /api/cart/remove-item?id=` — remove item
- `DELETE /api/cart/clear` — clear all items

### Orders (JWT required)

- `POST /api/orders/checkout` — atomic checkout with `{ shipping_address }` (validates stock, creates order, decrements stock, clears cart)
- `GET /api/orders/my-orders` — user's orders
- `GET /api/orders/detail?id=` — order with items (ownership check)
- `PUT /api/orders/cancel?id=` — cancel pending order (restores stock)

### Customer (JWT required)

- `GET /api/customer/profile` — get profile with auth info
- `PUT /api/customer/profile` — update `{ fname, lname, address }`
- `PUT /api/customer/change-password` — change `{ current_password, new_password }`

### Admin (JWT + Admin required)

- `GET /api/admin/dashboard` — stats (orders, revenue, products, users) + recent orders
- `GET /api/admin/orders?status=` — all orders with customer info
- `PUT /api/admin/orders/status` — update `{ order_id, status }` (restores stock on cancel)
- `GET /api/admin/users` — all users with auth data (no passwords)
- `PUT /api/admin/users/toggle-status?id=` — enable/disable user

### AI Assistant

- `controllers/aiAssistantController.js` proxies to OpenAI Assistants API v2.
- Requires `OPENAI_API_KEY` in `.env`.
