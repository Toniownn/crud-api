const { v4: uuidv4 } = require("uuid");
const sequelize = require("../database");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

exports.checkout = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { shipping_address } = req.body;

    const cart = await Cart.findOne({
      where: { customer_id: req.user.customer_id },
      transaction: t,
    });

    if (!cart) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product }],
      transaction: t,
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock for all items
    for (const item of cartItems) {
      if (item.Product.quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.Product.product_name}`,
        });
      }
    }

    // Calculate total
    const total_amount = cartItems.reduce((sum, item) => {
      return sum + item.Product.price * item.quantity;
    }, 0);

    // Create order
    const order = await Order.create(
      {
        id: uuidv4(),
        customer_id: req.user.customer_id,
        status: "pending",
        total_amount,
        shipping_address,
        placed_at: Date.now(),
      },
      { transaction: t }
    );

    // Create order items and decrement product quantities
    for (const item of cartItems) {
      await OrderItem.create(
        {
          id: uuidv4(),
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.Product.product_name,
          price: item.Product.price,
          quantity: item.quantity,
        },
        { transaction: t }
      );

      await Product.update(
        { quantity: item.Product.quantity - item.quantity },
        { where: { id: item.product_id }, transaction: t }
      );
    }

    // Clear cart items
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });

    await t.commit();

    res.status(201).json(order);
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.customer_id },
      order: [["placed_at", "DESC"]],
    });

    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer_id !== req.user.customer_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer_id !== req.user.customer_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    // Restore product quantities
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        await Product.update(
          { quantity: product.quantity + item.quantity },
          { where: { id: item.product_id } }
        );
      }
    }

    await Order.update({ status: "cancelled" }, { where: { id } });

    res.json({ message: "Order cancelled" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
