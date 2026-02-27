const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const cartController = require("../controllers/cartController");

router.get("/get-cart", authenticate, cartController.getCart);
router.post("/add-item", authenticate, cartController.addToCart);
router.put("/update-item", authenticate, cartController.updateCartItem);
router.delete("/remove-item", authenticate, cartController.removeFromCart);
router.delete("/clear", authenticate, cartController.clearCart);

module.exports = router;
