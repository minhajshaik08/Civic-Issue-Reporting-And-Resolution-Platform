const express = require("express");
const pool = require("../../../config/database");

const router = express.Router();

// GET /api/admin/middle-admins/list -> list all middle admins
router.get("/list", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT id, username, email, created_at FROM middle_admins ORDER BY id DESC"
    );

    connection.release();

    return res.json({
      success: true,
      middleAdmins: rows,
    });
  } catch (e) {
    console.error("List middle admins - DB error:", e);
    return res.json({
      success: false,
      message: e.message || "Database error while listing middle admins",
    });
  }
});

module.exports = router;
