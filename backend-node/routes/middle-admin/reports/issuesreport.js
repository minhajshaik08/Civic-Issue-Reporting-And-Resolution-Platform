// routes/middle-admin/reports/issuesreport.js
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

router.get("/", async (req, res) => {
  const { period = "daily", search = "", status = "" } = req.query;

  let days = 1;
  if (period === "weekly") days = 7;
  if (period === "monthly") days = 30;

  try {
    const connection = await mysql.createConnection(dbConfig);

    let sql =
      "SELECT * FROM report_issues WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)";
    const params = [days];

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
    console.error("MIDDLE-ADMIN ISSUES REPORT ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching issues report" });
  }
});

module.exports = router;
