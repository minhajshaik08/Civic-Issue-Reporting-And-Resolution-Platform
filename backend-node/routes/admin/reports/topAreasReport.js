const express = require("express");
const pool = require("../../../config/database");
const router = express.Router();

// GET /api/admin/reports/areas
// Returns: each area with total issue count, ordered by most issues
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const sql = `
      SELECT
        location_text AS area,
        COUNT(*) AS total_issues
      FROM report_issues
      GROUP BY location_text
      ORDER BY total_issues DESC
    `;

    const [rows] = await connection.execute(sql);
    connection.release();

    res.json({ success: true, areas: rows });
  } catch (err) {
    console.error("TOP AREAS REPORT ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching top areas report" });
  }
});

module.exports = router;
