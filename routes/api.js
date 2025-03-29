const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Ensure correct database connection

// POST route to add a food item
router.post("/food", (req, res) => {
  const { name, quantity, expiry_date } = req.body;

  if (!name || !quantity || !expiry_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO food (name, quantity, expiry_date) VALUES (?, ?, ?)";
  db.query(sql, [name, quantity, expiry_date], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Food item added successfully", id: result.insertId });
  });
});

module.exports = router;
