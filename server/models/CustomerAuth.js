const { Sequelize } = require("sequelize");
const db = require("../database");

const CustomerAuth = db.define(
  "customer_auth",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    customer_uuid: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "user",
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);
module.exports = CustomerAuth;
