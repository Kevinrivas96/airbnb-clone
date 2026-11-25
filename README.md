# Airbnb Clone

A full-stack vacation rental marketplace inspired by Airbnb. Guests can browse stays, book dates and pay with Stripe, then review their trip once the stay is over. Built with React, Node.js, Express, PostgreSQL and Prisma.

**Live demo:** _coming soon_ &nbsp;|&nbsp; **Test card:** `4242 4242 4242 4242` (any future expiry, any CVC)

![Homepage](docs/screenshots/home.png)

## Features

- **Authentication:** register and log in with JWT, bcrypt-hashed passwords and protected routes
- **Listings:** 50 seeded stays worldwide, category filtering, and full CRUD API with multi-image uploads to Cloudinary
- **Listing detail page:** photo gallery, amenities, host info and a sticky booking widget
- **Custom date picker:** separate check-in and check-out selection across any number of months, with a live price breakdown (nightly rate x nights + service fee)
- **Booking engine:** server-side availability checks that prevent double bookings
- **Payments:** Stripe Checkout (test mode) with webhook-based confirmation and a server-side verify fallback
- **My Trips:** view bookings, see their status, and cancel upcoming stays
- **Reviews and ratings:** guests can leave one review per stay, only after it has ended

## Screenshots

| Listing page                             | My Trips                             |
| ---------------------------------------- | ------------------------------------ |
| ![Listing](docs/screenshots/listing.png) | ![Trips](docs/screenshots/trips.png) |

| Booking widget                           | Stripe Payments                         |
| ---------------------------------------- | --------------------------------------- |
| ![Booking](docs/screenshots/booking.png) | ![Booking](docs/screenshots/stripe.png) |

## Tech Stack

| Layer         | Technology                                                |
| ------------- | --------------------------------------------------------- |
| Frontend      | React (Vite), React Router, Tailwind CSS, Axios, date-fns |
| Backend       | Node.js, Express 5                                        |
| Database      | PostgreSQL (hosted on Neon) with Prisma 5 ORM             |
| Auth          | JSON Web Tokens, bcryptjs                                 |
| Payments      | Stripe Checkout and webhooks                              |
| Image storage | Cloudinary, Multer                                        |

## Technical Highlights

- **Relational data model.** Users, listings, bookings and reviews are linked with foreign keys and cascading deletes, so the database enforces integrity (for example, a booking can't exist without its listing).
- **Double-booking prevention.** Availability is checked with a date-overlap query (`existing.start < new.end AND existing.end > new.start`) before any booking is created.
- **Payment holds.** Checkout creates a `pending` booking that holds the dates for 31 minutes. If the guest never pays, the hold expires and the dates free up automatically.
- **Two-path payment confirmation.** Bookings are confirmed by a signed Stripe webhook (the source of truth in production). The success page also calls a verify endpoint, so confirmation works even if the webhook is delayed.
- **Raw-body webhook handling.** The webhook route is registered before `express.json()` so Stripe's signature can be verified against the unparsed request body.
- **Review integrity.** A review requires a confirmed booking whose end date has passed, and a unique constraint on the booking ensures one review per stay.

## Project Structure

```
airbnb-clone/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── api/             # Axios instance with auth interceptor
│       ├── components/      # layout, listings, ui
│       ├── context/         # AuthContext
│       └── pages/           # Home, Listing, Login, Register, Trips, BookingSuccess
└── server/                  # Express backend
    ├── config/              # Cloudinary + Multer setup
    ├── controllers/         # auth, listings, bookings, payments, reviews
    ├── middleware/          # JWT auth guard
    ├── prisma/              # schema, client, seed script
    ├── routes/
    └── index.js
```

## API Overview

| Method | Endpoint                          | Auth   | Description                                                                |
| ------ | --------------------------------- | ------ | -------------------------------------------------------------------------- |
| POST   | `/api/auth/register`              | No     | Create an account                                                          |
| POST   | `/api/auth/login`                 | No     | Log in and receive a JWT                                                   |
| GET    | `/api/auth/me`                    | Yes    | Get the current user                                                       |
| GET    | `/api/listings`                   | No     | List stays (supports `category`, `city`, `minPrice`, `maxPrice`, `guests`) |
| GET    | `/api/listings/:id`               | No     | Get a single listing                                                       |
| POST   | `/api/listings`                   | Yes    | Create a listing (multipart, image upload)                                 |
| PUT    | `/api/listings/:id`               | Yes    | Update your listing                                                        |
| DELETE | `/api/listings/:id`               | Yes    | Delete your listing                                                        |
| POST   | `/api/payments/checkout`          | Yes    | Create a pending booking and Stripe Checkout session                       |
| GET    | `/api/payments/verify/:sessionId` | Yes    | Confirm a paid booking                                                     |
| POST   | `/api/payments/webhook`           | Stripe | Stripe event receiver                                                      |
| GET    | `/api/bookings/my-trips`          | Yes    | Bookings made by the current user                                          |
| GET    | `/api/bookings/my-listings`       | Yes    | Bookings on the current user's listings                                    |
| DELETE | `/api/bookings/:id`               | Yes    | Cancel a booking                                                           |
| POST   | `/api/reviews`                    | Yes    | Review a completed stay                                                    |
| GET    | `/api/reviews/listing/:listingId` | No     | Reviews and average rating for a listing                                   |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) (or any PostgreSQL) database
- A [Cloudinary](https://cloudinary.com) account
- A [Stripe](https://stripe.com) account in test mode

### 1. Clone and install

```bash
git clone https://github.com/Kevinrivas96/airbnb-clone.git
cd airbnb-clone

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="a-long-random-string"
PORT=5000
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Set up the database

```bash
cd server
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
```

> The seed script clears existing listings (and their bookings) before inserting the demo data, so only run it on a development database.

### 4. Run the app

```bash
# Terminal 1 - API on http://localhost:5000
cd server
npm run dev

# Terminal 2 - frontend on http://localhost:5173
cd client
npm run dev
```

### 5. (Optional) Forward Stripe webhooks locally

```bash
stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the `whsec_...` secret it prints into `STRIPE_WEBHOOK_SECRET` and restart the server. Without it, bookings are still confirmed through the verify endpoint on the success page.

## Testing a Payment

1. Create an account and open any listing.
2. Choose check-in and check-out dates and click **Reserve**.
3. Pay with the Stripe test card `4242 4242 4242 4242`, any future expiry date and any CVC.
4. You'll be redirected back, and the booking appears as `confirmed` under **My Trips**.

## Roadmap

- [ ] Working search bar and filters panel (location, guests, price) with URL-based state
- [ ] Host dashboard and listing creation form
- [ ] Real average ratings on listing cards
- [ ] Refunds when a confirmed booking is cancelled
- [ ] Map view of listings
- [ ] Production deployment (Vercel and Render)

## Author

**Kevin** - [GitHub](https://github.com/Kevinrivas96) | [LinkedIn](https://www.linkedin.com/in/kevn96/)

_This is a portfolio project built for learning purposes and is not affiliated with anyone._
