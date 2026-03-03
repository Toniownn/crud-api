const { Sequelize } = require("sequelize");
const db = require("../database");

const Order = db.define(
  "customer_order",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    customer_id: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "pending",
    },
    total_amount: {
      type: Sequelize.INTEGER,
    },
    shipping_address: {
      type: Sequelize.TEXT,
    },
    placed_at: {
      type: Sequelize.BIGINT,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Order;
