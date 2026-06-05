const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const protect = async (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization); // ADD THIS

  try {
    // 1. Grab the token from the Authorization header
    // header format: "Bearer eyJhbGci..."

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user in the database using the ID from the token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // 4. Attach user to the request so controllers can use it
    req.user = user;

    // 5. Move on to the actual route handler

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message); // ADD THIS
    res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
