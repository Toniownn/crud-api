const { Sequelize } = require("sequelize");
const db = require("../database");

const OrderItem = db.define(
  "order_item",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    order_id: {
      type: Sequelize.STRING,
    },
    product_id: {
      type: Sequelize.STRING,
    },
    product_name: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = OrderItem;
