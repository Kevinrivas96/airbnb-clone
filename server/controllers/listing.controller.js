const prisma = require("../prisma/client");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

// GET /api/listings - Get all listings with optional filters
const getAllListings = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, guests } = req.query;

    const filters = {};

    if (category) filters.category = category;
    if (city) filters.city = { contains: city, mode: "insensitive" };
    if (guests) filters.guests = { gte: parseInt(guests, 10) };
    if (minPrice || maxPrice) {
      filters.price = {};
    }
    if (minPrice) filters.price.gte = parseFloat(minPrice);
    if (maxPrice) filters.price.lte = parseFloat(maxPrice);

    const listings = await prisma.listing.findMany({
      where: filters,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ listings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get /api/listings/:id - get single listing by ID
const getListingById = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({ listing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/listings - create a new listing (Protected)
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      city,
      country,
      category,
      guests,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    // Get uploaded image URLs from Cloudinary
    const images = req.files
      ? await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer)),
        )
      : [];

    if (images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        city,
        country,
        category,
        guests: parseInt(guests),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        images,
        amenities: amenities ? amenities.split(",") : [],
        hostId: req.user.id, // Assuming user ID is available in req.user
      },
      include: {
        host: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json({ listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/listings/:id - update a listing (protected)
const updateListing = async (req, res) => {
  try {
    // Make sure the listing exists and belongs to this user
    const existing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (existing.hostId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this listing" });
    }

    const {
      title,
      description,
      price,
      location,
      city,
      country,
      category,
      guests,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    // if new images uploaded, use them - otherwise keep existing
    const images =
      req.files && req.files.length > 0
        ? await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer)),
          )
        : existing.images;

    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        city,
        country,
        category,
        guests: parseInt(guests),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        images,
        amenities: amenities ? amenities.split(",") : existing.amenities,
      },
      include: {
        host: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.json({ listing });
  } catch (err) {
    console.err(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/listings/:id - delete a listing (protected)
const deleteListing = async (req, res) => {
  try {
    const existing = await prisma.listing.findUnique({
      where: { id: req.param.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (existing.hostId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this listing" });
    }

    // Delete images from Cloudinary too
    for (const imageUrl of existing.images) {
      // the imageUrl look like: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0]; // this will look like: v<version>/<public_id>
      await cloudinary.uploader.destroy(publicId);
    }

    await prisma.listing.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
