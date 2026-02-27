## Backend Architecture

Express.js v5.2.1 REST API with CommonJS modules.

**Entry point:** `server/index.js` — sets up Express, CORS, mounts all route groups, authenticates the DB connection, starts listening.

**Layers:** routes → controllers → models (Sequelize)

## Route Groups

| Prefix | Route File | Auth Required |
|---|---|---|
| `/api/auth` | `routes/authRoutes.js` | No |
| `/api/products` | `routes/Products.js` | Mixed (catalog=public, CRUD=admin) |
| `/api/cart` | `routes/cartRoutes.js` | Yes (JWT) |
| `/api/orders` | `routes/orderRoutes.js` | Yes (JWT) |
| `/api/customer` | `routes/customerRoutes.js` | Yes (JWT) |
| `/api/admin` | `routes/adminRoutes.js` | Yes (JWT + Admin) |
| `/api/assistant` | `routes/aiAssistantRoutes.js` | Yes (JWT) |

## Server File Layout

```
server/
├── index.js           # Entry point — mounts all route groups
├── database.js        # Sequelize connection
├── migrations.sql     # SQL for all tables/columns
├── .env
├── controllers/
│   ├── authController.js
│   ├── productControllers.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── customer.js
│   ├── adminController.js
│   └── aiAssistantController.js
├── middleware/
│   ├── auth.js        # JWT verification
│   └── adminAuth.js   # Role check (admin only)
├── models/
│   ├── index.js       # Associations hub
│   ├── Customer.js
│   ├── CustomerAuth.js
│   ├── Product.js
│   ├── Cart.js
│   ├── CartItem.js
│   ├── Order.js
│   └── OrderItem.js
└── routes/
    ├── authRoutes.js
    ├── Products.js
    ├── cartRoutes.js
    ├── orderRoutes.js
    ├── customerRoutes.js
    ├── adminRoutes.js
    └── aiAssistantRoutes.js
```
