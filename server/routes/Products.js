const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authenticate = require("./../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const productController = require("../controllers/productControllers");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes (no auth required)
router.get("/catalog", productController.searchProducts);
router.get("/categories", productController.getCategories);
router.get("/detail", productController.getProductById);

// Admin CRUD routes (auth + admin required)
router.get("/get-all-product", authenticate, adminAuth, productController.getAllProduct);
router.post("/create-product", authenticate, adminAuth, upload.single("image"), productController.createProduct);
router.put("/update-product", authenticate, adminAuth, upload.single("image"), productController.updateProduct);
router.delete("/delete-product", authenticate, adminAuth, productController.deleteProduct);

module.exports = router;
