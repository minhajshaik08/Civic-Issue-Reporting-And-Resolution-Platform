const express = require("express");
const pool = require("../../../config/database");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT id, name, designation, department, zone, mobile, email, employee_id, role, status, last_login, created_at FROM officers ORDER BY id DESC"
    );

    connection.release();

    return res.json({ success: true, officers: rows });
  } catch (err) {
    console.error("List officers error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
