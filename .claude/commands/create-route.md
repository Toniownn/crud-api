# Create Express Route File

Create a new route file in `server/routes/`.

## Arguments
- `$ARGUMENTS` — Route file name, prefix, and endpoints, e.g. "cartRoutes: auth-required, GET /get-cart, POST /add-item"

## Instructions

1. Create the route file at `server/routes/<name>.js`
2. Follow existing project conventions:
   - Use CommonJS with `express.Router()`
   - Import `authenticate` from `../middleware/auth` for protected routes
   - Import `adminAuth` from `../middleware/adminAuth` for admin-only routes
   - Admin routes use both: `authenticate, adminAuth` as middleware chain
   - Import the controller and wire each route to the appropriate method
   - Export the router with `module.exports = router`
3. After creating the route file, remind to mount it in `server/index.js`
4. Return the file path when done
