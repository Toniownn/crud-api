## Known Issues

- API key logged to stdout in `server/controllers/aiAssistantController.js`
- Incorrect HTTP 201 status codes for update/delete in `server/controllers/productControllers.js`
- No input validation on product create
- Client-side UUID generation for products
- Misleading route name `GET /create_assistant` (retrieves, doesn't create)
- `nodemon` in production deps instead of devDependencies
