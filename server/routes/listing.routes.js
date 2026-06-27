const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} = require("../controllers/listings.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", protect, upload.array("images", 10), createListing);
router.put("/:id", protect, upload.array("images", 10), updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;
