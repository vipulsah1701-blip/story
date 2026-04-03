const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");

const app = express();
require("./db"); // Railway DB connection

// 🔥 VERY IMPORTANT (FIXES SESSION ON RENDER)
app.set("trust proxy", 1);

// Routes
const storyRoutes = require("./routes/stories");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// =====================
// Middleware
// =====================

// ✅ CORS (ALLOW FRONTEND)
app.use(cors({
  origin: "https://inkshare.onrender.com",
  credentials: true
}));

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION (FINAL CONFIG)
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,        // REQUIRED for Render (HTTPS)
    sameSite: "none",    // REQUIRED for cross-origin
    maxAge: 1000 * 60 * 60
  }
}));

// Serve static (optional now)
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Routes
// =====================

app.use("/auth", authRoutes);
app.use("/stories", storyRoutes);
app.use("/user", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// 404
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// =====================
// Start Server
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
