const prisma = require("../prisma/client");

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const stars = parseInt(rating);

    if (!bookingId || !comment?.trim() || !(stars >= 1 && stars <= 5)) {
      return res
        .status(400)
        .json({ error: "Rating (1-5) and comment are required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking || booking.guestId !== req.user.id) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ error: "Only confirmed bookings can be reviewed" });
    }
    if (booking.endDate > new Date()) {
      return res
        .status(400)
        .json({ error: "You can review after your stay is complete" });
    }
    if (booking.review) {
      return res.status(400).json({ error: "You already reviewed this stay" });
    }

    const review = await prisma.review.create({
      data: {
        rating: stars,
        comment: comment.trim(),
        bookingId,
        listingId: booking.listingId,
        authorId: req.user.id,
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/listing/:listingId
const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;

    const [reviews, stats] = await Promise.all([
      prisma.review.findMany({
        where: { listingId },
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.aggregate({
        where: { listingId },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    res.json({
      reviews,
      average: stats._avg.rating ? Number(stats._avg.rating.toFixed(2)) : null,
      count: stats._count._all,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createReview, getListingReviews };
