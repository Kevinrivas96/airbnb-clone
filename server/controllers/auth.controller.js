const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

// Helper - creates a signed JWT token with the user's ID inside

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // 3. Hash the password - never store plain text
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user in the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // 5. Sign a token with their ID
    const token = signToken(user.id);

    // 6. Send back the token and safe user data (no password)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err); // ADD THIS LINE
    res.status(500).json({ error: err.message }); // CHANGE THIS LINE  }
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields exist

    if (!email || !password) {
      return res.status(400).json({ erro: "Email and Password are required" });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Compare submitted password against hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Sign and return the token
    const token = signToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err); // ADD THIS LINE
    res.status(500).json({ error: err.message }); // CHANGE THIS LINE
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  // req.user is attached by the auth middleware (step 4)
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
};

module.exports = { register, login, getMe };
