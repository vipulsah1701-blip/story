const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
require("./db"); // Database connection

// Routes
const storyRoutes = require("./routes/stories");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

// =====================
// Middleware
// =====================

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session Middleware (MUST be before routes)
app.use(session({
  secret: "supersecretkey",   // change to strong random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60   // 1 hour
  }
}));

// Serve static files (HTML, CSS, JS)
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
