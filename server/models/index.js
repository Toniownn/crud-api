const Customer = require("./Customer");
const CustomerAuth = require("./CustomerAuth");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// Customer <-> CustomerAuth
Customer.hasOne(CustomerAuth, {
  foreignKey: "customer_uuid",
  sourceKey: "customer_id",
});
CustomerAuth.belongsTo(Customer, {
  foreignKey: "customer_uuid",
  targetKey: "customer_id",
});

// Customer <-> Cart
Customer.hasOne(Cart, {
  foreignKey: "customer_id",
  sourceKey: "customer_id",
});
Cart.belongsTo(Customer, {
  foreignKey: "customer_id",
  targetKey: "customer_id",
});

// Cart <-> CartItem
Cart.hasMany(CartItem, {
  foreignKey: "cart_id",
});
CartItem.belongsTo(Cart, {
  foreignKey: "cart_id",
});

// CartItem <-> Product
CartItem.belongsTo(Product, {
  foreignKey: "product_id",
});
Product.hasMany(CartItem, {
  foreignKey: "product_id",
});

// Customer <-> Order
Customer.hasMany(Order, {
  foreignKey: "customer_id",
  sourceKey: "customer_id",
});
Order.belongsTo(Customer, {
  foreignKey: "customer_id",
  targetKey: "customer_id",
});

// Order <-> OrderItem
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
});
OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
});

// OrderItem <-> Product
OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
});

module.exports = { Customer, CustomerAuth, Product, Cart, CartItem, Order, OrderItem };
