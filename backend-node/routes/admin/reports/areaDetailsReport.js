const express = require("express");
const pool = require("../../../config/database");
const router = express.Router();

// GET /api/admin/reports/areas/details?area=...
// Returns: counts per status for a given area
router.get("/details", async (req, res) => {
  const { area } = req.query;
  if (!area) {
    return res
      .status(400)
      .json({ success: false, message: "area is required" });
  }

  try {
    const connection = await pool.getConnection();

    const sql = `
      SELECT
        status,
        COUNT(*) AS count
      FROM report_issues
      WHERE location_text = ?
      GROUP BY status
    `;

    const [rows] = await connection.execute(sql, [area]);
    connection.release();

    // Build an object with all statuses, default 0
    const statuses = ["NEW", "VIEWED", "VERIFIED", "IN_PROGRESS", "SOLVED"];
    const counts = {};
    statuses.forEach((s) => (counts[s] = 0));
    rows.forEach((row) => {
      counts[row.status] = row.count;
    });

    res.json({ success: true, area, counts });
  } catch (err) {
    console.error("AREA DETAILS REPORT ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching area details" });
  }
});

module.exports = router;
