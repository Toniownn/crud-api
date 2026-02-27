const { Sequelize } = require("sequelize");
const db = require("../database");

const Cart = db.define(
  "cart",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    customer_id: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Cart;
