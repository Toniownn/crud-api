const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");

router.get("/dashboard", authenticate, adminAuth, adminController.getDashboard);
router.get("/orders", authenticate, adminAuth, adminController.getAllOrders);
router.put("/orders/status", authenticate, adminAuth, adminController.updateOrderStatus);
router.get("/users", authenticate, adminAuth, adminController.getAllUsers);
router.put("/users/toggle-status", authenticate, adminAuth, adminController.toggleUserStatus);
router.put("/users/update", authenticate, adminAuth, adminController.updateUser);
router.delete("/users", authenticate, adminAuth, adminController.deleteUser);
router.delete("/orders", authenticate, adminAuth, adminController.deleteOrder);

module.exports = router;
