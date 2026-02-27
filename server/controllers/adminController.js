const { Order, OrderItem, Product, Customer, CustomerAuth } = require("../models");
const { Op, fn, col } = require("sequelize");

exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.count();

    const revenueResult = await Order.findOne({
      attributes: [[fn("SUM", col("total_amount")), "totalRevenue"]],
      raw: true,
    });
    const totalRevenue = revenueResult.totalRevenue || 0;

    const totalProducts = await Product.count();
    const totalUsers = await Customer.count();

    const recentOrders = await Order.findAll({
      order: [["placed_at", "DESC"]],
      limit: 5,
      include: [
        {
          model: Customer,
          attributes: ["fname", "lname"],
        },
      ],
    });

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const orders = await Order.findAll({
      where,
      order: [["placed_at", "DESC"]],
      include: [
        {
          model: Customer,
          attributes: ["fname", "lname"],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByPk(order_id, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If cancelling, restore product quantities
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          await Product.update(
            { quantity: product.quantity + item.quantity },
            { where: { id: item.product_id } }
          );
        }
      }
    }

    await Order.update({ status }, { where: { id: order_id } });

    res.json({ message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Customer.findAll({
      include: [
        {
          model: CustomerAuth,
          attributes: ["username", "role", "disabled"],
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.query;

    const authRecord = await CustomerAuth.findOne({
      where: { customer_uuid: id },
    });

    if (!authRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    await CustomerAuth.update(
      { disabled: !authRecord.disabled },
      { where: { customer_uuid: id } }
    );

    res.json({
      message: `User ${authRecord.disabled ? "enabled" : "disabled"} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
