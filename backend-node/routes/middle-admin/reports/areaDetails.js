// routes/middle-admin/reports/areaDetails.js
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/middle-admin/reports/areas/details?area=...
// Returns: counts per status for a given area
router.get("/details", async (req, res) => {
  const { area } = req.query;
  if (!area) {
    return res
      .status(400)
      .json({ success: false, message: "area is required" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      SELECT
        status,
        COUNT(*) AS count
      FROM report_issues
      WHERE location_text = ?
      GROUP BY status
    `;

    const [rows] = await connection.execute(sql, [area]);
    await connection.end();

    const statuses = ["NEW", "VIEWED", "VERIFIED", "IN_PROGRESS", "SOLVED"];
    const counts = {};
    statuses.forEach((s) => (counts[s] = 0));
    rows.forEach((row) => {
      counts[row.status] = row.count;
    });

    res.json({ success: true, area, counts });
  } catch (err) {
    console.error("MIDDLE-ADMIN AREA DETAILS REPORT ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching area details" });
  }
});

module.exports = router;
