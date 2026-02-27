# Wire Route into Server

Mount a new route group in `server/index.js`.

## Arguments
- `$ARGUMENTS` — Route prefix and file, e.g. "/api/cart -> ./routes/cartRoutes.js"

## Instructions

1. Read `server/index.js`
2. Add `const <name>Routes = require("./routes/<file>.js");` with the other require statements
3. Add `app.use("<prefix>", <name>Routes);` with the other route mounts
4. Keep the same ordering style as existing route mounts
5. Return confirmation when done
