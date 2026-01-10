const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// Middle Admin: LIST OFFICERS
// GET /api/middle-admin/officers/list
router.get("/list", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT id, name, designation, department, zone, mobile, email, employee_id, role, status, last_login, created_at FROM officers ORDER BY id DESC"
    );

    await connection.end();

    return res.json({ success: true, officers: rows });
  } catch (err) {
    console.error("Middle-admin list officers error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
