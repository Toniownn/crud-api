# Create Express Controller

Create a new controller file in `server/controllers/`.

## Arguments
- `$ARGUMENTS` — Controller name and methods, e.g. "cartController: getCart, addToCart, removeFromCart"

## Instructions

1. Create the controller file at `server/controllers/<name>.js`
2. Follow existing project conventions:
   - Use CommonJS (`exports.<method> = async (req, res) => { ... }`)
   - Import models from `../models/<Model>` or `../models`
   - Wrap all handlers in try/catch, return 500 with `{ error: e.message }` on failure
   - Use `req.query.id` for GET/PUT/DELETE identifiers (project convention)
   - Use `req.user.customer_id` for the authenticated user's ID (from JWT middleware)
   - Use `req.body` for POST/PUT payloads
3. Return the file path when done
