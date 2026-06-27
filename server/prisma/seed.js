const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listings = [
  {
    title: "Cozy Muskoka Cabin",
    description:
      "A beautiful cabin surrounded by trees with a private dock on the lake. Perfect for a weekend getaway.",
    price: 189,
    location: "123 Lake Road",
    city: "Muskoka",
    country: "Canada",
    category: "Cabins",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Fireplace", "Lake Access", "BBQ"],
  },
  {
    title: "Modern Toronto Condo",
    description:
      "Sleek downtown condo with stunning city views, walking distance to the best restaurants and entertainment.",
    price: 220,
    location: "20 Bay Street",
    city: "Toronto",
    country: "Canada",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    amenities: ["WiFi", "Gym", "Concierge", "City View", "Kitchen"],
  },
  {
    title: "Beachfront Villa in Tofino",
    description:
      "Wake up to ocean waves in this stunning beachfront villa. Surf, kayak, or just relax on the private beach.",
    price: 450,
    location: "1 Ocean Drive",
    city: "Tofino",
    country: "Canada",
    category: "Beach",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    amenities: ["WiFi", "Beach Access", "Hot Tub", "Kitchen", "Surfboards"],
  },
  {
    title: "Banff Mountain Chalet",
    description:
      "Ski-in ski-out chalet with breathtaking Rocky Mountain views. Perfect for winter adventures.",
    price: 380,
    location: "5 Mountain View Road",
    city: "Banff",
    country: "Canada",
    category: "Cabins",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
    ],
    amenities: ["WiFi", "Ski Storage", "Hot Tub", "Fireplace", "Kitchen"],
  },
  {
    title: "Luxury Vancouver Penthouse",
    description:
      "Top floor penthouse with panoramic views of the mountains and ocean. The ultimate luxury experience.",
    price: 650,
    location: "1000 Robson Street",
    city: "Vancouver",
    country: "Canada",
    category: "Luxury",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["WiFi", "Pool", "Gym", "Concierge", "City View", "Kitchen"],
  },
  {
    title: "Cozy Quebec City Loft",
    description:
      "Charming stone-walled loft in the heart of Old Quebec. Walk to historic sites, cafes, and restaurants.",
    price: 160,
    location: "15 Rue Saint-Louis",
    city: "Quebec City",
    country: "Canada",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Historic Views", "Heating"],
  },
];

async function main() {
  console.log("Seeding database...");

  // Create a host user first
  const host = await prisma.user.upsert({
    where: { email: "host@example.com" },
    update: {},
    create: {
      email: "host@example.com",
      password: "hashedpassword",
      name: "Demo Host",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
  });

  console.log("Created host:", host.name);

  // Create all listings
  for (const listing of listings) {
    await prisma.listing.create({
      data: {
        ...listing,
        hostId: host.id,
      },
    });
  }

  console.log(`Seeded ${listings.length} listings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
