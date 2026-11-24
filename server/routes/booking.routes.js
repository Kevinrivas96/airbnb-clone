const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyTrips,
  getMyListingBookings,
  cancelBooking,
} = require("../controllers/booking.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createBooking);
router.get("/my-trips", protect, getMyTrips);
router.get("/my-listings", protect, getMyListingBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
