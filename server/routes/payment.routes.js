const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  verifySession,
} = require("../controllers/payment.controller");
const { project, protect } = require("../middleware/auth.middleware");

router.post("/checkout", protect, createCheckoutSession);
router.get("/verify/:sessionId", protect, verifySession);

module.exports = router;
