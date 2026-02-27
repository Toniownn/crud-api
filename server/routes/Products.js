const express = require("express");
const router = express.Router();
const authenticate = require("./../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const productController = require("../controllers/productControllers");

// Public routes (no auth required)
router.get("/catalog", productController.searchProducts);
router.get("/categories", productController.getCategories);
router.get("/detail", productController.getProductById);

// Admin CRUD routes (auth + admin required)
router.get("/get-all-product", authenticate, adminAuth, productController.getAllProduct);
router.post("/create-product", authenticate, adminAuth, productController.createProduct);
router.put("/update-product", authenticate, adminAuth, productController.updateProduct);
router.delete("/delete-product", authenticate, adminAuth, productController.deleteProduct);

module.exports = router;
