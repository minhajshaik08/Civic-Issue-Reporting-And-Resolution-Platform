const express = require("express");
const pool = require("../../../config/database");

const router = express.Router();

// GET /api/admin/users/list
router.get("/list", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT
         MIN(r.id) AS id,
         r.phone,
         r.full_name,

         -- ✅ take location_text from table
         MIN(r.location_text) AS location_text,

         COUNT(*) AS report_count,
         MIN(r.created_at) AS first_report_at,
         MAX(r.created_at) AS last_report_at,

         CASE WHEN b.mobile IS NULL THEN 0 ELSE 1 END AS is_blocked
       FROM report_issues r
       LEFT JOIN blocked_mobiles b ON r.phone = b.mobile
       GROUP BY r.phone, r.full_name, b.mobile
       ORDER BY last_report_at DESC`
    );

    connection.release();

    // ✅ Convert location_text into city name only (first word before comma)
    const users = rows.map((r) => {
      const city =
        r.location_text && String(r.location_text).includes(",")
          ? String(r.location_text).split(",")[0].trim()
          : r.location_text
          ? String(r.location_text).trim()
          : "-";

      return {
        id: r.id,
        mobile: r.phone,
        name: r.full_name,
        city: city, // ✅ now frontend can show city
        report_count: r.report_count,
        created_at: r.first_report_at,
        last_login: r.last_report_at,
        is_blocked: r.is_blocked === 1,
      };
    });

    return res.json({ success: true, users });
  } catch (err) {
    console.error("List users from report_issues error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
