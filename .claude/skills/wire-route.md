# Skill: Wire Route into Server

## When to Use
When you need to mount a new route group in the Express server entry point.

## Conventions
- File: `server/index.js`
- Add `require` with other route imports at the top
- Add `app.use()` mount with other route mounts
- Keep the same ordering style as existing mounts

## Steps
1. Read `server/index.js`
2. Add `const <name>Routes = require("./routes/<file>.js");` with other requires
3. Add `app.use("/api/<prefix>", <name>Routes);` with other route mounts
4. Verify no duplicate mounts exist

## Current Route Mounts
| Prefix | Require Path |
|--------|-------------|
| `/api/auth` | `./routes/authRoutes` |
| `/api/products` | `./routes/Products` |
| `/api/cart` | `./routes/cartRoutes` |
| `/api/orders` | `./routes/orderRoutes` |
| `/api/customer` | `./routes/customerRoutes` |
| `/api/admin` | `./routes/adminRoutes` |
| `/api/assistant` | `./routes/aiAssistantRoutes` |
