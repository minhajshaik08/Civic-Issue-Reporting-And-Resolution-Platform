const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// ✅ SAME LOGIC AS ADMIN
// GET /api/middle-admin/reports/issues?period=all|daily|weekly|monthly&search=&status=&month=YYYY-MM
router.get("/", async (req, res) => {
  const { period = "daily", search = "", status = "", month = "" } = req.query;

  try {
    const connection = await mysql.createConnection(dbConfig);

    let sql = `
      SELECT id, issue_type, status, location_text, full_name, created_at
      FROM report_issues
      WHERE 1=1
    `;
    const params = [];

    // ✅ PERIOD FILTER
    if (period === "daily") {
      sql += ` AND DATE(created_at) = CURDATE() `;
    } 
    else if (period === "weekly") {
      sql += ` AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) `;
    } 
    else if (period === "monthly") {
      if (month) {
        sql += ` AND DATE_FORMAT(created_at, '%Y-%m') = ? `;
        params.push(month);
      } else {
        sql += ` AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m') `;
      }
    } 
    else if (period === "all") {
      // ✅ no date filter
    } 
    else {
      sql += ` AND DATE(created_at) = CURDATE() `;
    }

    // ✅ SEARCH FILTER
    if (search) {
      sql += ` AND (
        issue_type LIKE ? OR
        location_text LIKE ? OR
        full_name LIKE ?
      ) `;
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    // ✅ STATUS FILTER
    if (status) {
      sql += ` AND status = ? `;
      params.push(status);
    }

    sql += ` ORDER BY created_at DESC `;

    const [rows] = await connection.execute(sql, params);
    await connection.end();

    return res.json({ success: true, issues: rows });
  } catch (err) {
    console.error("MIDDLE ADMIN ISSUES REPORT ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching issues report" });
  }
});

module.exports = router;
