const { Sequelize } = require("sequelize");
const db = require("../database");

const CartItem = db.define(
  "cart_item",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    cart_id: {
      type: Sequelize.STRING,
    },
    product_id: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = CartItem;
