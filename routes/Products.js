const express = require("express");
const router = express.Router();
const authenticate = require("./../middleware/auth");

const productController = require("../controllers/productControllers");

router.get("/get-all-product", authenticate, productController.getAllProduct);
router.post("/create-product", authenticate, productController.createProduct);
router.put("/update-product", authenticate, productController.updateProduct);
router.delete("/delete-product", authenticate, productController.deleteProduct);

module.exports = router;
