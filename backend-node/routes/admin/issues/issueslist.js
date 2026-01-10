// routes/admin/issues.routes.js
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
  const { status } = req.query;

  try {
    const connection = await mysql.createConnection(dbConfig);

    let sql = "SELECT * FROM report_issues WHERE 1=1";
    const params = [];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    const [rows] = await connection.execute(sql, params);
    await connection.end();

    res.json({ success: true, issues: rows });
  } catch (err) {
    console.error("ADMIN ISSUES LIST ERROR:", err);
    res.status(500).json({ success: false, message: "Error fetching issues" });
  }
});

module.exports = router;
