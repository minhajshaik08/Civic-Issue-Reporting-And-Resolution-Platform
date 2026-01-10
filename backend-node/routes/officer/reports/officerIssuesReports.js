const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/officer/reports/issues?period=...&search=...&status=...&officer_id=...
router.get("/issues", async (req, res) => {
  const { period = "daily", search = "", status = "", officer_id } = req.query;

  if (!officer_id) {
    return res
      .status(400)
      .json({ success: false, message: "officer_id is required" });
  }

  // date filter: last 1 day / 7 days / 30 days
  let days = 1;
  if (period === "weekly") days = 7;
  if (period === "monthly") days = 30;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // same table and columns as admin: report_issues
    let sql =
      "SELECT * FROM report_issues WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)";

    const params = [days];

    // only issues assigned to this officer
    sql += " AND assigned_officer_id = ?";
    params.push(officer_id);

    if (search) {
      sql +=
        " AND (issue_type LIKE ? OR location_text LIKE ? OR full_name LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await connection.execute(sql, params);
    await connection.end();

    res.json({ success: true, issues: rows });
  } catch (err) {
    console.error("OFFICER ISSUES REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching officer issues report",
    });
  }
});

module.exports = router;
