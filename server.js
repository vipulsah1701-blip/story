const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");

const app = express();
require("./db"); // Railway DB connection

// Routes
const storyRoutes = require("./routes/stories");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// =====================
// Middleware
// =====================

// ✅ CORS (allow frontend to talk to backend)
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // ✅ REQUIRED for production (Render uses HTTPS)
    sameSite: "none", // ✅ REQUIRED for cross-site cookies
    maxAge: 1000 * 60 * 60
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Routes
// =====================

app.use("/auth", authRoutes);
app.use("/stories", storyRoutes);
app.use("/user", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// 404 handler
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
