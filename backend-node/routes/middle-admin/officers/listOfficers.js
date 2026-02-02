const express = require("express");
const mysql = require("mysql2/promise");
const pool = require("../../../config/database");

const router = express.Router();

// Middle Admin: LIST OFFICERS
// GET /api/middle-admin/officers/list
router.get("/list", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT id, name, designation, department, zone, mobile, email, employee_id, role, status, last_login, created_at FROM officers ORDER BY id DESC"
    );

    connection.release();

    return res.json({ success: true, officers: rows });
  } catch (err) {
    console.error("Middle-admin list officers error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
