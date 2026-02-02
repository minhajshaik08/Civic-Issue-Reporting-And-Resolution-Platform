const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../../../config/database");

const router = express.Router();

// POST /api/admin/middle-admins -> add new middle admin
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const connection = await pool.getConnection();

    // Check if email already exists
    const [rows] = await connection.execute(
      "SELECT id FROM middle_admins WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      connection.release();
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert new middle admin
    const [result] = await connection.execute(
      "INSERT INTO middle_admins (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    connection.release();

    return res.json({
      success: true,
      message: "Middle admin created",
      id: result.insertId,
    });
  } catch (e) {
    console.error("DB error:", e);
    return res.json({ success: false, message: e.message || "Database error" });
  }
});

module.exports = router;
