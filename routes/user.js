const express = require("express");
const db = require("../db");
const router = express.Router();


// ========================================
// GET CURRENT LOGGED-IN USER + STORIES
// URL: /user/me
// ========================================
router.get("/me", (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const userId = req.session.user.id;

  // Get user info
  db.query(
    "SELECT id, username, email FROM users WHERE id = ?",
    [userId],
    (err, userResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (userResult.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get stories of logged-in user
      db.query(
        "SELECT id, title, content, created_at FROM stories WHERE user_id = ? ORDER BY created_at DESC",
        [userId],
        (err, storyResult) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
          }

          res.json({
            user: userResult[0],
            stories: storyResult
          });
        }
      );
    }
  );
});


// ========================================
// GET USER PROFILE + THEIR STORIES
// URL: /user/:id
// ========================================
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT id, username, email FROM users WHERE id = ?",
    [userId],
    (err, userResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

      if (userResult.length === 0) {
        return res.status(404).send("User not found");
      }

      db.query(
        "SELECT id, title, content, created_at FROM stories WHERE user_id = ? ORDER BY created_at DESC",
        [userId],
        (err, storyResult) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Database error");
          }

          res.json({
            user: userResult[0],
            stories: storyResult
          });
        }
      );
    }
  );
});

module.exports = router;
