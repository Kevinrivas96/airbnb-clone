const express = require("express");
const router = express.Router();
const {
  createReview,
  getListingReviews,
} = require("../controllers/review.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/listing/:listingId", getListingReviews);
router.post("/", protect, createReview);

module.exports = router;
