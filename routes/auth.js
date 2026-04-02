const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt"); // 🔐 ADD THIS
const router = express.Router();

/*
   REGISTER USER
*/
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // 🔴 Check empty fields
  if (!username || !email || !password) {
    return res.redirect("/register.html?error=All fields are required");
  }

  // 🔴 Gmail validation
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.redirect("/register.html?error=Only Gmail addresses allowed");
  }

  try {
    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {

        if (err) {
          console.log(err);
          return res.redirect("/register.html?error=Database error");
        }

        // 🔴 Email exists
        if (result.length > 0) {
          return res.redirect("/register.html?error=Email already registered");
        }

        // ✅ Insert user with HASHED password
        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err) => {

            if (err) {
              console.log(err);
              return res.redirect("/register.html?error=Registration failed");
            }

            res.redirect("/login.html");
          }
        );
      }
    );

  } catch (err) {
    console.log(err);
    return res.redirect("/register.html?error=Server error");
  }
});


/*
   LOGIN USER (SESSION BASED)
*/
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 🔴 Check empty fields
  if (!email || !password) {
    return res.redirect("/login.html?error=All fields are required");
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) {
        console.log(err);
        return res.redirect("/login.html?error=Database error");
      }

      if (result.length === 0) {
        return res.redirect("/login.html?error=Invalid email or password");
      }

      const user = result[0];

      try {
        // 🔐 COMPARE HASHED PASSWORD
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.redirect("/login.html?error=Invalid email or password");
        }

        // ✅ LOGIN SUCCESS
        req.session.user = {
          id: user.id,
          username: user.username
        };

        res.redirect("/home.html");

      } catch (err) {
        console.log(err);
        return res.redirect("/login.html?error=Server error");
      }
    }
  );
});


/*
   LOGOUT USER
*/
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/index.html");
  });
});

module.exports = router;
