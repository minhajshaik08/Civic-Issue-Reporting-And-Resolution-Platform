// routes/admin/issues/issuedetails.js
const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/admin/issues/:id  -> single issue
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM report_issues WHERE id = ?",
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue: rows[0] });
  } catch (err) {
    console.error("ADMIN ISSUE DETAILS ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching issue details" });
  }
});

// PATCH /api/admin/issues/:id/status  -> update status + save history
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;

  // now read officer info from body
  const { status, officerId, officerName, officerEmail } = req.body;

  // final values with fallback
  const finalOfficerId = officerId || 1;
  const finalOfficerName = officerName || "Officer One";
  const finalOfficerEmail = officerEmail || "officer1@gmail.com";

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // 1) get old status
    const [rows] = await connection.execute(
      "SELECT status FROM report_issues WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    const oldStatus = rows[0].status;

    // 2) update main table
    await connection.execute(
      "UPDATE report_issues SET status = ? WHERE id = ?",
      [status, id]
    );

    // 3) insert history row
    await connection.execute(
      `INSERT INTO issue_status_history
       (issue_id, old_status, new_status, changed_by_id, changed_by_name, changed_by_email)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, oldStatus, status, finalOfficerId, finalOfficerName, finalOfficerEmail]
    ); 

    await connection.end();

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    if (connection) await connection.end();
    console.error("ADMIN ISSUE STATUS UPDATE ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating status" });
  }
});

module.exports = router;
