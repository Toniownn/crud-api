# Create Sequelize Model

Create a new Sequelize model file in `server/models/`.

## Arguments
- `$ARGUMENTS` — Model name and fields, e.g. "Cart: id(STRING,PK), customer_id(STRING)"

## Instructions

1. Create the model file at `server/models/<ModelName>.js`
2. Follow existing project conventions:
   - Use CommonJS (`require`/`module.exports`)
   - Import `Sequelize` from `sequelize` and `db` from `../database`
   - Use `db.define('<table_name>', { fields }, { freezeTableName: true, timestamps: false })`
   - Table name should be snake_case version of the model name
   - All string PKs use `type: Sequelize.STRING, primaryKey: true`
3. Do NOT add associations here — those go in `server/models/index.js`
4. Return the file path when done
