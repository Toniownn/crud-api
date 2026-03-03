const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.post("/checkout", authenticate, orderController.checkout);
router.get("/my-orders", authenticate, orderController.getMyOrders);
router.get("/detail", authenticate, orderController.getOrderDetail);
router.put("/cancel", authenticate, orderController.cancelOrder);

module.exports = router;
