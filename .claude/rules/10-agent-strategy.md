## Agent Strategy for Multi-File Features

When implementing large features that span multiple files, use parallel agents grouped by independence:

**Backend agents:**
- Agent 1: Models + `models/index.js` associations
- Agent 2: Controllers
- Agent 3: Routes + `server/index.js` wiring

**Frontend agents:**
- Agent 4: API modules (`client/src/api/`)
- Agent 5: Page components (`client/src/pages/`)
- Agent 6: Shared components + routing (`App.jsx`, `Navbar.jsx`, `AuthContext.jsx`)

## Rules for Parallel Agents

- Each agent owns a distinct set of files — no two agents should edit the same file
- If multiple agents need to edit a shared file (like `App.jsx` or `models/index.js`), assign it to ONE agent only
- Provide agents with the relevant `.claude/skills/` conventions so output is consistent
- After all agents complete, do a review pass to fix Sequelize casing issues and field name mismatches

## Common Pitfalls

- Sequelize returns associated models with capitalized names (e.g., `item.Product`, `order.OrderItems`) — use fallback: `(item.product || item.Product)`
- `placed_at` is BIGINT — wrap with `Number()` before passing to `new Date()`
- Admin data returns nested structures (e.g., `user.customer_auth.username`, not `user.username`)
- API functions that receive objects should destructure: `addToCart({ product_id, quantity })` not `addToCart(product_id, quantity)`

## Available Skills (`.claude/skills/`)

| Skill | Purpose |
|-------|---------|
| `create-model` | Sequelize model with project conventions |
| `create-controller` | Express controller with try/catch, `req.query.id` pattern |
| `create-route` | Express route file with auth middleware |
| `create-page` | React page with Tailwind CSS v4 styling |
| `create-api` | Frontend API module using shared axios instance |
| `wire-route` | Mount a new route group in `server/index.js` |
| `react-component` | General React component generator |
