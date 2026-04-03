const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/add-test", (req, res) => {
  console.log("🔥 NEW ROUTE WORKING");
  res.json({ success: true });
});

/*
   ADD STORY (SESSION BASED)
*/
router.post("/add", (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Please login first" });
  }

  const { title, content } = req.body;
  const userId = req.session.user.id;

  db.query(
    "INSERT INTO stories (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, userId],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      // ✅ RETURN JSON INSTEAD OF REDIRECT
      res.json({ success: true });

    }
  );
});


/*
   SEARCH STORIES (TITLE OR AUTHOR)
*/
router.get("/search", (req, res) => {

  const query = "%" + req.query.q + "%";

  db.query(
    `SELECT 
        stories.id,
        stories.title,
        stories.content,
        users.username
     FROM stories
     JOIN users ON stories.user_id = users.id
     WHERE stories.title LIKE ?
     OR users.username LIKE ?
     ORDER BY stories.created_at DESC`,
    [query, query],
    (err, results) => {

      if (err) {
        console.log(err);
        return res.json([]);
      }

      res.json(results);
    }
  );
});


/*
   GET ALL STORIES (WITH USERNAME)
*/
router.get("/all", (req, res) => {

  db.query(
    `SELECT 
    stories.*,
    users.username,
    COUNT(likes.id) AS likes
    FROM stories
    JOIN users ON stories.user_id = users.id
    LEFT JOIN likes 
    ON stories.id = likes.story_id
    GROUP BY stories.id
    ORDER BY stories.id DESC`,
    (err, results) => {

      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

      res.json(results);
    }
  );
});


/*
   GET SINGLE STORY WITH USER INFO
*/
router.get("/:id", (req, res) => {

  const storyId = req.params.id;

  db.query(
    `SELECT 
        stories.id,
        stories.title,
        stories.content,
        stories.user_id,
        stories.created_at,
        users.username
     FROM stories
     JOIN users ON stories.user_id = users.id
     WHERE stories.id = ?`,
    [storyId],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

      if (result.length === 0) {
        return res.status(404).send("Story not found");
      }

      res.json(result[0]);
    }
  );
});


/*
   DELETE STORY
*/
router.delete("/:id", (req, res) => {

  const storyId = req.params.id;

  if (!req.session.user) {
    return res.status(401).json({ message: "Please login first" });
  }

  db.query(
    "DELETE FROM stories WHERE id = ?",
    [storyId],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Story deleted successfully" });
    }
  );
});

// TOGGLE LIKE (LIKE / UNLIKE)
router.post("/like/:id", (req, res) => {

  if (!req.session.user) {
    return res.json({ success: false });
  }

  const storyId = req.params.id;
  const userId = req.session.user.id;

  const check = "SELECT * FROM likes WHERE story_id=? AND user_id=?";

  db.query(check, [storyId, userId], (err, result) => {

    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    if (result.length > 0) {

      // 🔴 UNLIKE
      db.query(
        "DELETE FROM likes WHERE story_id=? AND user_id=?",
        [storyId, userId],
        (err) => {
          if (err) return res.json({ success: false });

          return res.json({ success: true, liked: false });
        }
      );

    } else {

      // ❤️ LIKE
      db.query(
        "INSERT INTO likes (story_id,user_id) VALUES (?,?)",
        [storyId, userId],
        (err) => {
          if (err) return res.json({ success: false });

          return res.json({ success: true, liked: true });
        }
      );

    }

  });

});

module.exports = router;
