const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// PUT /api/officer/issues/:id/status  { status, officer_id }
router.put("/:id/status", async (req, res) => {
  const issueId = req.params.id;
  const { status, officer_id } = req.body;

  if (!issueId || !status || !officer_id) {
    return res.status(400).json({
      success: false,
      message: "issueId, status and officer_id are required",
    });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Ensure this issue belongs to this officer
    const [checkRows] = await connection.execute(
      "SELECT id FROM report_issues WHERE id = ? AND assigned_officer_id = ?",
      [issueId, officer_id]
    );

    if (checkRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this issue",
      });
    }

    const [result] = await connection.execute(
      "UPDATE report_issues SET status = ? WHERE id = ?",
      [status, issueId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    return res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.error("OFFICER UPDATE STATUS ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error updating status" });
  } finally {
    if (connection) await connection.end();
  }
});

module.exports = router;
