# Create Frontend API Module

Create a new API module in `client/src/api/`.

## Arguments
- `$ARGUMENTS` — Module name and endpoints, e.g. "cart: GET /cart/get-cart, POST /cart/add-item"

## Instructions

1. Create the file at `client/src/api/<name>.js`
2. Follow existing project conventions:
   - Import `api` from `./axios` (the pre-configured axios instance with JWT interceptor)
   - Export named arrow functions for each API call
   - Use the `api` instance methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`
   - The base URL is already `/api` so paths should be relative (e.g., `/cart/get-cart`)
   - For query params, append them to the URL string (e.g., `/products/detail?id=${id}`)
   - For request bodies, pass as second argument to post/put
3. Return the file path when done
