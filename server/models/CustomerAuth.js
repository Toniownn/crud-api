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
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);
module.exports = CustomerAuth;
