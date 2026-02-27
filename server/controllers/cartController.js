const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const [cart] = await Cart.findOrCreate({
      where: { customer_id: req.user.customer_id },
      defaults: { id: uuidv4(), customer_id: req.user.customer_id },
    });

    const items = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product }],
    });

    const total = items.reduce((sum, item) => {
      return sum + item.Product.price * item.quantity;
    }, 0);

    res.json({ items, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const [cart] = await Cart.findOrCreate({
      where: { customer_id: req.user.customer_id },
      defaults: { id: uuidv4(), customer_id: req.user.customer_id },
    });

    const existingItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.json(existingItem);
    }

    const cartItem = await CartItem.create({
      id: uuidv4(),
      cart_id: cart.id,
      product_id,
      quantity: quantity || 1,
    });

    res.status(201).json(cartItem);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { item_id, quantity } = req.body;

    if (quantity <= 0) {
      await CartItem.destroy({ where: { id: item_id } });
      return res.json({ message: "Item removed from cart" });
    }

    await CartItem.update({ quantity }, { where: { id: item_id } });
    res.json({ message: "Cart item updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Cart item id is required" });
    }

    await CartItem.destroy({ where: { id } });
    res.json({ message: "Item removed from cart" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { customer_id: req.user.customer_id },
    });

    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id } });
    }

    res.json({ message: "Cart cleared" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
