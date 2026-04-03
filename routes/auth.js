const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const router = express.Router();

/*
   REGISTER USER
*/
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.json({ success: false, message: "Only Gmail addresses allowed" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {

        if (err) {
          console.log(err);
          return res.json({ success: false, message: "Database error" });
        }

        if (result.length > 0) {
          return res.json({ success: false, message: "Email already registered" });
        }

        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err) => {

            if (err) {
              console.log(err);
              return res.json({ success: false, message: "Registration failed" });
            }

            res.json({ success: true });
          }
        );
      }
    );

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});


/*
   LOGIN USER
*/
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Database error" });
      }

      if (result.length === 0) {
        return res.json({ success: false, message: "Invalid email or password" });
      }

      const user = result[0];

      try {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.json({ success: false, message: "Invalid email or password" });
        }

        req.session.user = {
          id: user.id,
          username: user.username
        };

        // 🔥 IMPORTANT FIX
        req.session.save(() => {
          res.json({ success: true });
        });

      } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Server error" });
      }
    }
  );
});


/*
   LOGOUT USER
*/
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

module.exports = router;
