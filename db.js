const mysql = require("mysql2");

// 🚨 Railway DB connection (NO local fallback)
const db = mysql.createConnection(process.env.MYSQL_URL);

// Connect DB
db.connect(err => {
  if (err) {
    console.error("❌ Railway DB connection failed:", err);
    process.exit(1); // stop server if DB fails
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;
