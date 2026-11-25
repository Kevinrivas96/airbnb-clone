const prisma = require("../prisma/client");

// POST /api/bookings - create a booking
const createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;

    // Verify that all required fields are provided
    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    // check listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Make sure host can't book their own listing
    if (listing.hostId === req.user.id) {
      return res
        .status(400)
        .json({ error: "You cannot book your own listing" });
    }

    // Check for date conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        listingId,
        status: { not: "cancelled" },
        AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
      },
    });

    if (conflict) {
      return res
        .status(400)
        .json({ error: "Listing is not available for these dates" });
    }

    // Calculate total price
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    const booking = await prisma.booking.create({
      data: {
        listingId,
        guestId: req.user.id,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "confirmed",
      },
      include: {
        listing: {
          select: {
            title: true,
            city: true,
            country: true,
            images: true,
            price: true,
          },
        },
      },
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/bookings/my-trips — get all bookings for logged in guest
const getMyTrips = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { guestId: req.user.id },
      include: {
        review: { select: { id: true } },
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            images: true,
            price: true,
            host: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/bookings/my-listings — bookings on host's listings
const getMyListingBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        listing: {
          hostId: req.user.id,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    });
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/bookings/:id — cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.guestId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to cancel this booking" });
    }

    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "cancelled" },
    });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getMyTrips,
  getMyListingBookings,
  cancelBooking,
};
