const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const authenticate = require("../middleware/auth");
const customerController = require("../controllers/customer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.get("/profile", authenticate, customerController.getProfile);
router.put("/profile", authenticate, customerController.updateProfile);
router.put("/profile-image", authenticate, upload.single("image"), customerController.updateProfileImage);
router.put("/change-password", authenticate, customerController.changePassword);

module.exports = router;
