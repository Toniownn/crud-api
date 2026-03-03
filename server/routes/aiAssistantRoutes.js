const express = require("express");
const router = express.Router();
const authenticate = require("./../middleware/auth");
const aiAssistantController = require("../controllers/aiAssistantController");

router.get(
  "/create_assistant",
  authenticate,
  aiAssistantController.getAssistant,
);

module.exports = router;
