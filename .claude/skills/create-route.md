# Skill: Create Express Route File

## When to Use
When you need to create a new route file that maps HTTP endpoints to controller methods.

## Conventions
- Location: `server/routes/<name>Routes.js`
- CommonJS with `express.Router()`
- Import `authenticate` from `../middleware/auth` for protected routes
- Import `adminAuth` from `../middleware/adminAuth` for admin-only routes
- Admin routes chain both: `authenticate, adminAuth`
- Export with `module.exports = router`
- After creating, mount in `server/index.js` with `app.use("/api/<prefix>", routes)`

## Template
```js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const controller = require("../controllers/<name>Controller");

router.get("/endpoint", authenticate, controller.method);
router.post("/endpoint", authenticate, controller.method);

module.exports = router;
```

## Auth Patterns
- **Public:** no middleware
- **Authenticated:** `authenticate`
- **Admin only:** `authenticate, adminAuth`
- **Mixed (same file):** add public routes first, then protected routes
