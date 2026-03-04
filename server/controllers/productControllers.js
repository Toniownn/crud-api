const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");
const OrderItem = require("../models/OrderItem");

exports.getAllProduct = async (req, res) => {
  try {
    const getAllProduct = await Product.findAll();
    res.json(getAllProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = { id: uuidv4(), ...req.body };
    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`;
    }
    const createProduct = await Product.create(data);
    res.status(201).json(createProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProduct = async(req, res) => {
    try{
        const {id} = req.query;

        if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const data = { ...req.body };
    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`;
    }

    const [updated] = await Product.update(data, {
      where: { id }
    });

    if (updated === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json({"message": `The Product ${id} updated successfully`});
    }catch(e){
        res.status(500).json({error: `oh no ${e.message}`});
    }
}

exports.deleteProduct = async (req,res) => {
    try{
        const {id} = req.query;

        if(!id){
            return res.status(400).json({message: "Product id is required"});
        }

        const product = await Product.findByPk(id);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await CartItem.destroy({ where: { product_id: id } });
        await OrderItem.destroy({ where: { product_id: id } });
        await Product.destroy({ where: { id } });

        res.status(200).json({message: `The Product ${id} deleted successfully`});
    }catch(e) {
        res.status(500).json({error: `oh no the error is ${e.message}`})
    }
}

exports.searchProducts = async (req, res) => {
  try {
    const { search, category, min_price, max_price, page = 1, limit = 12 } = req.query;
    const where = {};

    if (search) {
      where.product_name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
      where.product_category = { [Op.iLike]: category };
    }
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = Number(min_price);
      if (max_price) where.price[Op.lte] = Number(max_price);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["product_name", "ASC"]],
    });

    res.json({
      products: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Product id is required" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["product_category"],
      group: ["product_category"],
      order: [["product_category", "ASC"]],
    });
    res.json(products.map((p) => p.product_category));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};