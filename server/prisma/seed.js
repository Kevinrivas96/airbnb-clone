const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listings = [
  // --- CANADA ---
  {
    title: "Cozy Muskoka Cabin",
    description:
      "A beautiful cabin surrounded by trees with a private dock on the lake. Perfect for a weekend getaway with family or friends. Watch the sunrise over the water and fall asleep to the sound of loons.",
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
      "Sleek downtown condo with stunning city views, walking distance to the best restaurants and entertainment. Floor to ceiling windows and designer finishes throughout.",
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
      "Wake up to ocean waves in this stunning beachfront villa. Surf, kayak, or just relax on the private beach. One of the most sought-after properties on Vancouver Island.",
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
      "Ski-in ski-out chalet with breathtaking Rocky Mountain views. Perfect for winter adventures and summer hikes. Steps from world-class skiing.",
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
      "Top floor penthouse with panoramic views of the mountains and ocean. The ultimate luxury experience with concierge service and private rooftop terrace.",
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
      "Charming stone-walled loft in the heart of Old Quebec. Walk to historic sites, cafes, and restaurants. Experience 400 years of history from your doorstep.",
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
  {
    title: "Prince Edward Island Farmhouse",
    description:
      "Charming red-roofed farmhouse surrounded by rolling green fields and red sand beaches. Experience the real maritime lifestyle with fresh lobster just minutes away.",
    price: 175,
    location: "88 Cavendish Road",
    city: "Charlottetown",
    country: "Canada",
    category: "Farms",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "BBQ", "Garden", "Parking"],
  },
  {
    title: "Whistler Ski Lodge",
    description:
      "Rustic yet luxurious ski lodge minutes from Whistler Blackcomb. Après-ski by the stone fireplace and enjoy mountain views from every room.",
    price: 520,
    location: "22 Blackcomb Way",
    city: "Whistler",
    country: "Canada",
    category: "Cabins",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    ],
    amenities: [
      "WiFi",
      "Hot Tub",
      "Fireplace",
      "Ski Storage",
      "Kitchen",
      "Parking",
    ],
  },
  {
    title: "Halifax Waterfront Apartment",
    description:
      "Modern apartment on the historic Halifax waterfront boardwalk. Watch tall ships sail by from your private balcony and walk to the best seafood restaurants in Atlantic Canada.",
    price: 145,
    location: "1869 Upper Water Street",
    city: "Halifax",
    country: "Canada",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Waterfront View", "Balcony"],
  },
  {
    title: "Kelowna Lakefront Estate",
    description:
      "Stunning lakefront estate in the heart of Okanagan wine country. Private beach, boat dock, and surrounded by world-class wineries. The perfect summer retreat.",
    price: 590,
    location: "4400 Lakeshore Road",
    city: "Kelowna",
    country: "Canada",
    category: "Luxury",
    guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    ],
    amenities: [
      "WiFi",
      "Pool",
      "Hot Tub",
      "Beach Access",
      "Boat Dock",
      "Kitchen",
      "BBQ",
    ],
  },

  // --- USA ---
  {
    title: "Miami Beach Condo",
    description:
      "Bright and airy condo steps from the famous South Beach strip. Art Deco architecture, rooftop pool, and stunning Atlantic Ocean views.",
    price: 280,
    location: "100 Ocean Drive",
    city: "Miami",
    country: "USA",
    category: "Beach",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    amenities: ["WiFi", "Pool", "Beach Access", "Gym", "Kitchen"],
  },
  {
    title: "NYC Manhattan Studio",
    description:
      "Compact but perfectly designed studio in the heart of Manhattan. Everything New York has to offer is at your doorstep — Times Square, Central Park, world-class dining.",
    price: 195,
    location: "350 W 42nd Street",
    city: "New York",
    country: "USA",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "City View", "Doorman"],
  },
  {
    title: "Malibu Oceanfront Home",
    description:
      "Wake up to Pacific Ocean sunrises in this stunning Malibu home. Private beach access, floor-to-ceiling windows, and celebrity-neighborhood privacy.",
    price: 850,
    location: "24000 Pacific Coast Highway",
    city: "Malibu",
    country: "USA",
    category: "Beach",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1505916349660-8d91a99f8a8a?w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    ],
    amenities: ["WiFi", "Beach Access", "Hot Tub", "Kitchen", "BBQ", "Parking"],
  },
  {
    title: "Aspen Ski Chalet",
    description:
      "World-class ski chalet in exclusive Aspen. Heated floors, wine cellar, private chef available on request. The pinnacle of mountain luxury.",
    price: 1200,
    location: "700 S Galena Street",
    city: "Aspen",
    country: "USA",
    category: "Luxury",
    guests: 8,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "https://images.unsplash.com/photo-1520984032042-162d526883e0?w=800",
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
    ],
    amenities: [
      "WiFi",
      "Hot Tub",
      "Fireplace",
      "Ski In/Out",
      "Wine Cellar",
      "Kitchen",
    ],
  },
  {
    title: "Austin Music District Loft",
    description:
      "Industrial chic loft in the heart of Austin's famous 6th Street music district. Walk to live music venues, craft breweries, and farm-to-table restaurants.",
    price: 165,
    location: "412 E 6th Street",
    city: "Austin",
    country: "USA",
    category: "Apartments",
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Rooftop Access", "Parking"],
  },
  {
    title: "Hawaiian Beachfront Bungalow",
    description:
      "Toes-in-the-sand bungalow on the Big Island's famous black sand beach. Snorkel with sea turtles, watch lava flows at night, and experience true Hawaiian paradise.",
    price: 320,
    location: "Punalu'u Beach Road",
    city: "Hilo",
    country: "USA",
    category: "Beach",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800",
    ],
    amenities: ["WiFi", "Beach Access", "Kitchen", "Hammock", "Snorkel Gear"],
  },
  {
    title: "Napa Valley Wine Country Cottage",
    description:
      "Romantic cottage nestled among world-famous vineyards. Complimentary wine tasting at three nearby wineries included with your stay.",
    price: 395,
    location: "1050 Charter Oak Ave",
    city: "Napa",
    country: "USA",
    category: "Farms",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Wine Cellar", "Garden", "BBQ", "Fireplace"],
  },
  {
    title: "Colorado Mountain Cabin",
    description:
      "Off-grid cabin with stunning Rocky Mountain views. No crowds, no noise — just pine forests, elk sightings, and the clearest night skies you've ever seen.",
    price: 210,
    location: "Bear Creek Trail",
    city: "Estes Park",
    country: "USA",
    category: "Cabins",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    amenities: ["Kitchen", "Fireplace", "Hot Tub", "Hiking Access", "BBQ"],
  },
  {
    title: "New Orleans French Quarter Apartment",
    description:
      "Historic apartment above a jazz club on Bourbon Street. Original hardwood floors, exposed brick, wrought iron balcony overlooking the most famous street in America.",
    price: 175,
    location: "722 Bourbon Street",
    city: "New Orleans",
    country: "USA",
    category: "Apartments",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Balcony", "AC"],
  },
  {
    title: "Seattle Houseboat",
    description:
      "Unique floating home on Lake Union made famous by Sleepless in Seattle. Kayaks included, floatplane views all day, and downtown Seattle just minutes away.",
    price: 245,
    location: "Lake Union Houseboats",
    city: "Seattle",
    country: "USA",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800",
      "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Kayaks", "Lake View", "Deck"],
  },

  // --- EUROPE ---
  {
    title: "Paris Marais District Flat",
    description:
      "Quintessential Parisian flat in the trendy Marais district. Haussmann architecture, parquet floors, and a stone's throw from the Pompidou Centre and Le Marais boutiques.",
    price: 230,
    location: "14 Rue des Rosiers",
    city: "Paris",
    country: "France",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "City View", "Metro Access"],
  },
  {
    title: "Santorini Cliffside Villa",
    description:
      "Iconic white-washed villa with the world-famous Santorini caldera view. Private infinity pool, outdoor jacuzzi, and a front-row seat to the most stunning sunsets on Earth.",
    price: 780,
    location: "Oia Village",
    city: "Santorini",
    country: "Greece",
    category: "Luxury",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800",
    ],
    amenities: [
      "WiFi",
      "Pool",
      "Hot Tub",
      "Caldera View",
      "Kitchen",
      "Concierge",
    ],
  },
  {
    title: "Barcelona Gothic Quarter Apartment",
    description:
      "Stunning apartment inside a medieval building in Barcelona's historic Gothic Quarter. Steps from La Sagrada Familia, Las Ramblas, and Barceloneta beach.",
    price: 195,
    location: "Carrer del Bisbe 5",
    city: "Barcelona",
    country: "Spain",
    category: "Apartments",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
      "https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "AC", "Historic Views"],
  },
  {
    title: "Tuscany Farmhouse",
    description:
      "Authentic 16th century Tuscan farmhouse surrounded by olive groves and vineyards. Private pool, wood-fired pizza oven, and the most beautiful sunsets in Italy.",
    price: 420,
    location: "Via Chiantigiana",
    city: "Siena",
    country: "Italy",
    category: "Farms",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
    ],
    amenities: ["WiFi", "Pool", "Kitchen", "BBQ", "Wine Cellar", "Garden"],
  },
  {
    title: "Amsterdam Canal House",
    description:
      "Authentic 17th century canal house in Amsterdam's famous Nine Streets district. Steep Dutch stairs, exposed beams, and a picture-perfect canal view from every window.",
    price: 265,
    location: "Keizersgracht 123",
    city: "Amsterdam",
    country: "Netherlands",
    category: "Apartments",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800",
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Canal View", "Bikes Included"],
  },
  {
    title: "Amalfi Coast Cliffside Home",
    description:
      "Perched on the cliffs of the Amalfi Coast with jaw-dropping Mediterranean views. Lemon trees in the garden, a private terrace, and the best limoncello you've ever tasted.",
    price: 490,
    location: "Via Pantaleone Comite",
    city: "Positano",
    country: "Italy",
    category: "Luxury",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Sea View", "Terrace", "Garden"],
  },
  {
    title: "Scottish Highland Castle Suite",
    description:
      "Sleep like royalty in a genuine 14th century Scottish castle. Suit of armour in the hallway, four-poster beds, and red deer roaming the grounds at dawn.",
    price: 560,
    location: "Castle Drive",
    city: "Inverness",
    country: "Scotland",
    category: "Luxury",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    amenities: ["WiFi", "Fireplace", "Breakfast Included", "Garden", "Parking"],
  },
  {
    title: "Lisbon Alfama Viewpoint Apartment",
    description:
      "Traditional azulejo-tiled apartment in Lisbon's oldest neighbourhood. Terrace with sweeping views over the Tagus River and St George's Castle. Hear fado music drifting up at night.",
    price: 145,
    location: "Rua do Salvador",
    city: "Lisbon",
    country: "Portugal",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1513735492246-483525079686?w=800",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "River View", "Terrace"],
  },
  {
    title: "Prague Old Town Studio",
    description:
      "Charming studio apartment in a 15th century building steps from the famous Astronomical Clock. Gothic spires, cobblestone streets, and incredible Czech beer all within walking distance.",
    price: 110,
    location: "Staroměstské náměstí",
    city: "Prague",
    country: "Czech Republic",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800",
      "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Historic Views", "Heating"],
  },
  {
    title: "Mykonos Windmill Villa",
    description:
      "Iconic villa steps from Mykonos Town's famous windmills. Whitewashed walls, Aegean blue accents, private plunge pool, and the best party island in the Mediterranean outside your door.",
    price: 620,
    location: "Windmill Road",
    city: "Mykonos",
    country: "Greece",
    category: "Luxury",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
    ],
    amenities: ["WiFi", "Pool", "Sea View", "Kitchen", "Terrace", "Concierge"],
  },

  // --- ASIA ---
  {
    title: "Bali Rice Terrace Villa",
    description:
      "Stunning open-air villa overlooking the famous Tegalalang rice terraces. Infinity pool, private chef, daily yoga sessions, and the spiritual heart of Bali just outside your gate.",
    price: 340,
    location: "Tegalalang",
    city: "Ubud",
    country: "Indonesia",
    category: "Luxury",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      "https://images.unsplash.com/photo-1531421272-2e3b486f5584?w=800",
    ],
    amenities: [
      "WiFi",
      "Pool",
      "Daily Cleaning",
      "Breakfast",
      "Yoga Deck",
      "Kitchen",
    ],
  },
  {
    title: "Tokyo Shibuya Apartment",
    description:
      "Ultra-modern apartment in the heart of Tokyo's busiest district. Walk to Shibuya Crossing, Harajuku, and Meiji Shrine. Everything that makes Tokyo the world's greatest city.",
    price: 175,
    location: "Shibuya-ku",
    city: "Tokyo",
    country: "Japan",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "City View", "Washer", "AC"],
  },
  {
    title: "Bangkok Rooftop Penthouse",
    description:
      "Spectacular rooftop penthouse with 360-degree Bangkok skyline views. Private rooftop pool, outdoor kitchen, and the city's best cocktail bar just two floors below.",
    price: 290,
    location: "Sukhumvit Road",
    city: "Bangkok",
    country: "Thailand",
    category: "Luxury",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    amenities: ["WiFi", "Pool", "Rooftop", "Kitchen", "Gym", "Concierge"],
  },
  {
    title: "Kyoto Traditional Machiya",
    description:
      "Beautifully restored 100-year-old Kyoto townhouse. Tatami rooms, indoor koi pond, private zen garden, and walking distance to Fushimi Inari and Gion.",
    price: 255,
    location: "Gion District",
    city: "Kyoto",
    country: "Japan",
    category: "Luxury",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
    ],
    amenities: [
      "WiFi",
      "Zen Garden",
      "Kitchen",
      "Tatami Rooms",
      "Tea Ceremony",
    ],
  },
  {
    title: "Maldives Overwater Bungalow",
    description:
      "The ultimate bucket list stay — a glass-floor overwater bungalow above crystal-clear turquoise lagoon. Watch reef sharks from your bed and dive straight into paradise from your deck.",
    price: 980,
    location: "North Male Atoll",
    city: "Male",
    country: "Maldives",
    category: "Luxury",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
    ],
    amenities: [
      "WiFi",
      "Beach Access",
      "Snorkel Gear",
      "Breakfast",
      "Kayaks",
      "AC",
    ],
  },
  {
    title: "Singapore Marina Bay Flat",
    description:
      "Sleek apartment with direct views of the iconic Marina Bay Sands and Gardens by the Bay light show. The financial heart of Asia, luxury shopping, and Michelin-starred hawker food.",
    price: 310,
    location: "Marina Boulevard",
    city: "Singapore",
    country: "Singapore",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
    ],
    amenities: ["WiFi", "Pool", "Gym", "City View", "Kitchen", "Concierge"],
  },

  // --- AUSTRALIA & NZ ---
  {
    title: "Sydney Harbour View Apartment",
    description:
      "Wake up to one of the world's most iconic views — the Sydney Opera House and Harbour Bridge right outside your window. Premium Circular Quay location.",
    price: 385,
    location: "Circular Quay",
    city: "Sydney",
    country: "Australia",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1524293568345-75d62c3664f7?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Harbour View", "Balcony", "Gym"],
  },
  {
    title: "Great Barrier Reef Beach House",
    description:
      "Private beach house on a secluded island just minutes by boat from the Great Barrier Reef. Snorkel with sea turtles, manta rays and reef sharks every morning.",
    price: 440,
    location: "Whitsunday Islands",
    city: "Airlie Beach",
    country: "Australia",
    category: "Beach",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    ],
    amenities: [
      "WiFi",
      "Beach Access",
      "Snorkel Gear",
      "Kitchen",
      "BBQ",
      "Kayaks",
    ],
  },
  {
    title: "New Zealand Fjordland Cabin",
    description:
      "Remote wilderness cabin on the edge of Fiordland National Park. No roads in — arrive by helicopter or boat. Milford Sound, ancient rainforest, and total silence.",
    price: 360,
    location: "Fiordland National Park",
    city: "Te Anau",
    country: "New Zealand",
    category: "Cabins",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800",
    ],
    amenities: ["Kitchen", "Fireplace", "Hiking Access", "Kayaks", "Generator"],
  },
  {
    title: "Melbourne Fitzroy Terrace",
    description:
      "Stunning Victorian terrace in Melbourne's most creative neighbourhood. Walk to world-class coffee shops, street art, record stores, and the best brunch scene in Australia.",
    price: 195,
    location: "Brunswick Street",
    city: "Melbourne",
    country: "Australia",
    category: "Apartments",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "Garden", "Washer", "Parking"],
  },

  // --- SOUTH AMERICA ---
  {
    title: "Buenos Aires Palermo Loft",
    description:
      "Industrial loft in Buenos Aires' hippest neighbourhood. Surrounded by boutique restaurants, tango clubs, and weekend flea markets. Steak dinner at midnight is non-negotiable.",
    price: 95,
    location: "Palermo Soho",
    city: "Buenos Aires",
    country: "Argentina",
    category: "Apartments",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    ],
    amenities: ["WiFi", "Kitchen", "AC", "Rooftop Access"],
  },
  {
    title: "Rio de Janeiro Beachfront Penthouse",
    description:
      "Spectacular penthouse directly on Copacabana Beach. Watch the sunrise over the Atlantic and the city lights at night. Carnival, samba, and caipirinhas await.",
    price: 420,
    location: "Avenida Atlantica",
    city: "Rio de Janeiro",
    country: "Brazil",
    category: "Beach",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800",
      "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800",
    ],
    amenities: ["WiFi", "Pool", "Beach Access", "Kitchen", "City View", "AC"],
  },
  {
    title: "Patagonia Lakeside Retreat",
    description:
      "Isolated wilderness retreat on the shores of a glacier-fed Patagonian lake. Hiking, fly fishing, and condor sightings — the last truly wild place on Earth.",
    price: 280,
    location: "Torres del Paine",
    city: "Puerto Natales",
    country: "Chile",
    category: "Cabins",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    ],
    amenities: ["Kitchen", "Fireplace", "Hiking Access", "Fishing Gear", "BBQ"],
  },

  // --- AFRICA & MIDDLE EAST ---
  {
    title: "Marrakech Riad",
    description:
      "Traditional Moroccan riad with a stunning central courtyard, mosaic tiles, and rooftop terrace. The medina souks, Djemaa el-Fna square, and hammams are steps away.",
    price: 185,
    location: "Medina Quarter",
    city: "Marrakech",
    country: "Morocco",
    category: "Luxury",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1539020140153-e479b8c64a58?w=800",
      "https://images.unsplash.com/photo-1531888604-5d974c7b59bc?w=800",
    ],
    amenities: ["WiFi", "Pool", "Rooftop", "Breakfast", "Kitchen", "AC"],
  },
  {
    title: "Cape Town Clifton Beach Villa",
    description:
      "Spectacular villa above one of South Africa's most exclusive beaches. Table Mountain views, private pool, and the Cape Winelands just 45 minutes away.",
    price: 495,
    location: "Clifton 4th Beach",
    city: "Cape Town",
    country: "South Africa",
    category: "Luxury",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
      "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800",
    ],
    amenities: [
      "WiFi",
      "Pool",
      "Beach Access",
      "Kitchen",
      "BBQ",
      "Mountain View",
    ],
  },
  {
    title: "Dubai Marina Skyscraper Suite",
    description:
      "Ultra-luxury suite on the 45th floor of a Dubai Marina skyscraper. Gold fixtures, floor-to-ceiling glass, infinity pool on the 40th floor, and views of the Palm Jumeirah.",
    price: 750,
    location: "Dubai Marina Walk",
    city: "Dubai",
    country: "UAE",
    category: "Luxury",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
    ],
    amenities: [
      "WiFi",
      "Pool",
      "Gym",
      "Concierge",
      "City View",
      "Kitchen",
      "AC",
    ],
  },
  {
    title: "Serengeti Safari Lodge",
    description:
      "Luxury tented camp in the heart of the Serengeti. Fall asleep to lion roars, wake up to elephants at the watering hole, and witness the Great Migration up close.",
    price: 890,
    location: "Central Serengeti",
    city: "Arusha",
    country: "Tanzania",
    category: "Camping",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800",
    ],
    amenities: ["Meals Included", "Game Drives", "WiFi", "AC", "Concierge"],
  },

  // --- UNIQUE & UNUSUAL ---
  {
    title: "Treehouse in the Costa Rican Jungle",
    description:
      "Elevated treehouse 30 feet in the jungle canopy. Wake up to howler monkeys, watch toucans from your hammock, and zip-line to breakfast. Pure wildlife immersion.",
    price: 215,
    location: "Monteverde Cloud Forest",
    city: "Monteverde",
    country: "Costa Rica",
    category: "Camping",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    ],
    amenities: ["Kitchen", "Hammock", "Zip Line Access", "Nature Tours"],
  },
  {
    title: "Iceland Northern Lights Cabin",
    description:
      "Glass-roofed cabin designed specifically for Northern Lights viewing. Geothermal hot tub outside, warm reindeer skins inside, and the aurora borealis dancing overhead.",
    price: 480,
    location: "Golden Circle Route",
    city: "Reykjavik",
    country: "Iceland",
    category: "Cabins",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
    ],
    amenities: [
      "Hot Tub",
      "Kitchen",
      "Glass Roof",
      "Heating",
      "Northern Lights Tours",
    ],
  },
  {
    title: "Mongolian Yurt on the Steppe",
    description:
      "Authentic ger on the vast Mongolian steppe with a nomadic family as hosts. Ride horses at dawn, eat fresh airag by the fire, and sleep under the most star-filled sky on Earth.",
    price: 85,
    location: "Terelj National Park",
    city: "Ulaanbaatar",
    country: "Mongolia",
    category: "Camping",
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
    ],
    amenities: [
      "Meals Included",
      "Horse Riding",
      "Cultural Experience",
      "Heating",
    ],
  },
  {
    title: "Underground Cave House in Cappadocia",
    description:
      "Carved into volcanic rock thousands of years ago, this cave suite in Cappadocia has been transformed into a stunning boutique retreat. Watch hot air balloons float past your window at sunrise.",
    price: 290,
    location: "Göreme Village",
    city: "Nevşehir",
    country: "Turkey",
    category: "Luxury",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800",
    ],
    amenities: [
      "WiFi",
      "Breakfast",
      "Hot Air Balloon Tours",
      "Kitchen",
      "Terrace",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database with 50 listings...");

  // Create a host user
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

  console.log(`✅ Host created: ${host.name}`);

  // Clear existing listings first to avoid duplicates
  await prisma.listing.deleteMany({});
  console.log("🗑️  Cleared existing listings");

  // Seed all listings
  for (const listing of listings) {
    await prisma.listing.create({
      data: { ...listing, hostId: host.id },
    });
  }

  console.log(`✅ Seeded ${listings.length} listings across 6 continents`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
