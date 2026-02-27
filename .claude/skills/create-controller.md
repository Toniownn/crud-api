# Skill: Create Express Controller

## When to Use
When you need to create a new controller with route handlers.

## Conventions
- Location: `server/controllers/<name>.js`
- CommonJS: `exports.<method> = async (req, res) => { ... }`
- Wrap all handlers in try/catch, return `res.status(500).json({ error: e.message })` on failure
- Use `req.query.id` for GET/PUT/DELETE identifiers (project convention)
- Use `req.user.customer_id` for authenticated user's ID (from JWT middleware)
- Use `req.body` for POST/PUT payloads
- Import models from `../models/<Model>` or `../models`
- Use `const { v4: uuidv4 } = require("uuid")` for generating IDs

## Template
```js
const ModelName = require("../models/ModelName");

exports.getAll = async (req, res) => {
  try {
    const items = await ModelName.findAll();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "ID is required" });
    const item = await ModelName.findByPk(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
```
