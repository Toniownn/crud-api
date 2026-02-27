# Skill: Create Sequelize Model

## When to Use
When you need to create a new Sequelize model for a database table.

## Conventions
- Location: `server/models/<ModelName>.js`
- CommonJS: `require` / `module.exports`
- Import `Sequelize` from `sequelize` and `db` from `../database`
- Use `db.define('<table_name>', { fields }, { freezeTableName: true, timestamps: false })`
- Table name = snake_case of model name
- All string PKs: `type: Sequelize.STRING, primaryKey: true`
- Do NOT define associations here — add them in `server/models/index.js`
- After creating, register associations in `server/models/index.js` and export the model

## Template
```js
const { Sequelize } = require("sequelize");
const db = require("../database");

const ModelName = db.define(
  "table_name",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    // add fields here
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ModelName;
```
