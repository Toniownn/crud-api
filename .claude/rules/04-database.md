## Database

- **ORM:** Sequelize v6.37.7 with PostgreSQL (`pg` driver)
- **Connection:** `server/database.js` — Sequelize instance from env vars
- **All models use `freezeTableName: true` and `timestamps: false`** — table names match model names exactly, no `createdAt`/`updatedAt` columns.
- Tables must already exist in Postgres; run `server/migrations.sql` for new tables.

## Models & Relationships

- **Customer** (`customer`) — PK: `customer_id` (UUID string)
- **CustomerAuth** (`customer_auth`) — PK: `id` (UUID), FK: `customer_uuid` → `customer.customer_id`, fields: `username`, `password`, `role` (user/admin), `disabled`
- **Product** (`product`) — PK: `id` (UUID), fields: `product_name`, `product_category`, `price`, `quantity`, `description`, `image_url`
- **Cart** (`cart`) — PK: `id` (UUID), FK: `customer_id` → `customer.customer_id` (unique)
- **CartItem** (`cart_item`) — PK: `id` (UUID), FK: `cart_id` → `cart.id`, FK: `product_id` → `product.id`, field: `quantity`
- **Order** (`customer_order`) — PK: `id` (UUID), FK: `customer_id` → `customer.customer_id`, fields: `status`, `total_amount` (integer/cents), `shipping_address`, `placed_at` (BIGINT, Unix ms)
- **OrderItem** (`order_item`) — PK: `id` (UUID), FK: `order_id` → `customer_order.id`, FK: `product_id` → `product.id`, fields: `product_name`, `price` (snapshot), `quantity`

Associations in `server/models/index.js`:
- Customer hasOne CustomerAuth / Cart / hasMany Order
- Cart hasMany CartItem, CartItem belongsTo Product
- Order hasMany OrderItem, OrderItem belongsTo Product
