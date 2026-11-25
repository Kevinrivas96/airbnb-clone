const Stripe = require("stripe");
const prisma = require("../prisma/client");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Requires checkout sessions to live at least 30 minutes
const HOLD_MINUTES = 31;

// POST /api/payments/checkout
const createCheckoutSession = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;

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

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.hostId === req.user.id) {
      return res
        .status(404)
        .json({ error: "You cannot book your own listing" });
    }

    // Release this user's own abandoned checkouts for this listing
    await prisma.booking.updateMany({
      where: { listingId, guestId: req.user.id, status: "pending" },
      data: { status: "cancelled" },
    });

    // Conflict = confirmed booking, or a recent pending one still within its hold window
    const holdCutoff = new Date(Date.now() - HOLD_MINUTES * 60 * 1000);
    const conflict = await prisma.booking.findFirst({
      where: {
        listingId,
        startDate: { lt: end },
        endDate: { gt: start },
        OR: [
          { status: "confirmed" },
          { status: "pending", createdAt: { gt: holdCutoff } },
        ],
      },
    });
    if (conflict) {
      return res
        .status(404)
        .json({ error: "Listing is not available for these dates" });
    }

    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
    const subtotal = nights * listing.price;
    const serviceFee = Math.round(subtotal * 0.12);

    const booking = await prisma.booking.create({
      data: {
        listingId,
        guestId: req.user.id,
        startDate: start,
        endDate: end,
        totalPrice: subtotal + serviceFee,
        status: "pending",
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: req.user.email,
      client_reference_id: booking.id,
      metadata: { bookingId: booking.id },
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(subtotal * 100), // Stripe uses cents
            product_data: {
              name: listing.title,
              description: `${nights} night${nights !== 1 ? "s" : ""} in ${listing.city}, ${listing.country}`,
              images: [listing.images[0]],
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: serviceFee * 100,
            product_data: { name: "Service fee" },
          },
        },
      ],
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/listings/${listingId}`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/payments/verify/:sessionId
// Called by the success page so the booking confirms even if the webhook is slow
const verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
    );
    const bookingId = session.metadata?.bookingId;

    const booking = bookingId
      ? await prisma.booking.findUnique({ where: { id: bookingId } })
      : null;

    if (!booking || booking.guestId !== req.user.id) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (session.payment_status === "paid" && booking.status === "pending") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "confirmed" },
      });

      return res.json({ status: "confirmed" });
    }

    res.json({ status: "confirmed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/payments/webhook
// stripe calls this directly. This is the source of truth in production

const handleWebhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body, not parsed JSON
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`webhook Error: ${err.message}`);
  }

  const session = event.data.object;
  const bookingId = session.metadata?.bookingId;

  if (bookingId) {
    if (
      event.type === "checkout.session.completed" &&
      session.payment_status === "paid"
    ) {
      await prisma.booking.updateMany({
        where: { id: bookingId, status: "pending" },
        data: { status: "confirmed" },
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    await prisma.booking.updateMany({
      where: { id: bookingId, status: "pending" },
      data: { status: "cancelled" },
    });
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, verifySession, handleWebhook };
