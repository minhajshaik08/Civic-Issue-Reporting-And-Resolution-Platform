// routes/middle-admin/issues/issueslist.js
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/middle-admin/issues  -> list issues (optional status filter)
router.get("/", async (req, res) => {
  const { status } = req.query;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // join with officers to get assigned officer name
    let sql = `
      SELECT 
        r.*,
        o.name AS assigned_officer_name
      FROM report_issues r
      LEFT JOIN officers o 
        ON r.assigned_officer_id = o.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += " AND r.status = ?";
      params.push(status);
    }

    const [rows] = await connection.execute(sql, params);
    await connection.end();

    res.json({ success: true, issues: rows });
  } catch (err) {
    console.error("MIDDLE-ADMIN ISSUES LIST ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching issues" });
  }
});

// PUT /api/middle-admin/issues/:id/assign-officer  -> set assigned_officer_id
router.put("/:id/assign-officer", async (req, res) => {
  const issueId = req.params.id;
  const { officer_id } = req.body;

  if (!officer_id) {
    return res
      .status(400)
      .json({ success: false, message: "officer_id is required" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      "UPDATE report_issues SET assigned_officer_id = ? WHERE id = ?",
      [officer_id, issueId]
    );

    if (result.affectedRows === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    await connection.end();
    return res.json({
      success: true,
      message: "Officer assigned successfully",
    });
  } catch (err) {
    console.error("MIDDLE-ADMIN ASSIGN OFFICER ERROR:", err);
    if (connection) await connection.end();
    return res
      .status(500)
      .json({ success: false, message: "Error assigning officer" });
  }
});

module.exports = router;
