const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

//Health check route - confirms server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`erver running on port ${PORT}`);
});
