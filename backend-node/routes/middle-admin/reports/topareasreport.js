// routes/middle-admin/reports/topareasreport.js
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/middle-admin/reports/areas
// Returns: each area with total issue count, ordered by most issues
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      SELECT
        location_text AS area,
        COUNT(*) AS total_issues
      FROM report_issues
      GROUP BY location_text
      ORDER BY total_issues DESC
    `;

    const [rows] = await connection.execute(sql);
    await connection.end();

    res.json({ success: true, areas: rows });
  } catch (err) {
    console.error("MIDDLE-ADMIN TOP AREAS REPORT ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching top areas report" });
  }
});

module.exports = router;
