const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/middle-admin/users/list
router.get("/list", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT
         MIN(r.id) AS id,
         r.phone,
         r.full_name,
         COUNT(*) AS report_count,
         MIN(r.created_at) AS first_report_at,
         MAX(r.created_at) AS last_report_at,
         CASE WHEN b.mobile IS NULL THEN 0 ELSE 1 END AS is_blocked
       FROM report_issues r
       LEFT JOIN blocked_mobiles b ON r.phone = b.mobile
       GROUP BY r.phone, r.full_name, b.mobile
       ORDER BY last_report_at DESC`
    );

    await connection.end();

    const users = rows.map((r) => ({
      id: r.id,
      mobile: r.phone,
      name: r.full_name,
      report_count: r.report_count,
      created_at: r.first_report_at,
      last_login: r.last_report_at,
      is_blocked: r.is_blocked === 1,
    }));

    return res.json({ success: true, users });
  } catch (err) {
    console.error("Middle-admin list users from report_issues error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
