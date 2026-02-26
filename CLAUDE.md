# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack app: Express.js REST API backend (`server/`) + React frontend (`client/`).

## Project Structure

```
├── server/        # Express.js backend (CommonJS)
│   ├── index.js   # Entry point
│   ├── database.js
│   ├── .env
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── client/        # React frontend (Vite + Tailwind CSS v4)
│   └── src/
│       ├── api/        # axios instance + API call functions
│       ├── context/    # AuthContext for JWT state
│       ├── components/ # Navbar, ProtectedRoute
│       ├── pages/      # Login, Register, Products, Assistant
│       ├── App.jsx     # Router setup
│       └── main.jsx    # Entry point
└── CLAUDE.md
```

## Commands

- **Start backend:** `cd server && node index.js` (runs on port from `.env`, default 3000)
- **Start backend with auto-reload:** `cd server && npx nodemon index.js`
- **Start frontend:** `cd client && npm run dev` (Vite dev server, proxies `/api` to backend)
- **Build frontend:** `cd client && npm run build`
- **Install backend deps:** `cd server && npm install`
- **Install frontend deps:** `cd client && npm install`
- **No test suite configured** — `npm test` is a placeholder in both.

## Backend Architecture

**Entry point:** `server/index.js` — sets up Express, CORS, mounts route groups, authenticates the DB connection, and starts listening.

**Layers follow: routes → controllers → models (Sequelize)**

### Route Groups

| Prefix | Route File | Auth Required |
|---|---|---|
| `/api/auth` | `server/routes/authRoutes.js` | No |
| `/api/products` | `server/routes/Products.js` | Yes (JWT) |
| `/api/assistant` | `server/routes/aiAssistantRoutes.js` | Yes (JWT) |

### Database

- **ORM:** Sequelize v6 with PostgreSQL (`pg` driver)
- **Connection:** `server/database.js` — creates a Sequelize instance from env vars (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DIALECT`)
- **All models use `freezeTableName: true` and `timestamps: false`** — table names match model names exactly, no `createdAt`/`updatedAt` columns.
- Tables are expected to already exist in Postgres; there are no migrations or `sync()` calls.

### Models & Relationships

- **Customer** (`customer` table) — PK: `customer_id` (UUID string)
- **CustomerAuth** (`customer_auth` table) — PK: `id` (UUID), FK: `customer_uuid` → `customer.customer_id`
- **Product** (`product` table) — PK: `id` (UUID string), fields: `product_name`, `product_category`, `price`, `quantity`
- Associations defined in `server/models/index.js`: Customer hasOne CustomerAuth, CustomerAuth belongsTo Customer.

### Authentication Flow

1. **Register** (`POST /api/auth/register`): creates Customer + CustomerAuth with bcrypt-hashed password.
2. **Login** (`POST /api/auth/login`): validates credentials, returns JWT (24h expiry).
3. **Protected routes** use `server/middleware/auth.js` which verifies the Bearer token and attaches decoded payload to `req.user`.

### Product CRUD

- Update and delete use `req.query.id` (query parameter), not route params.
- Create accepts body payload directly via `Product.create(req.body)`.

### AI Assistant

- `server/controllers/aiAssistantController.js` proxies requests to the OpenAI Assistants API v2 using axios.
- Requires `OPENAI_API_KEY` in `.env`.

## Frontend Architecture

- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Routing:** react-router-dom v7
- **HTTP:** axios with JWT interceptor (`client/src/api/axios.js`)
- **Auth state:** React Context (`client/src/context/AuthContext.jsx`) stores JWT + customer info in localStorage

### Pages

- **Login** / **Register** — public auth forms
- **Products** — CRUD table (create, edit, delete) behind auth
- **Assistant** — OpenAI assistant lookup by ID behind auth

## Environment Variables (`server/.env`)

`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DIALECT`, `JWT_SECRET`, `PORT`, `OPENAI_API_KEY`
