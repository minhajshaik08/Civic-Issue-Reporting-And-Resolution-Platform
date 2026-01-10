const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/officer/issues/:id?officer_id=6 -> single issue (only if assigned to this officer)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { officer_id } = req.query;

  if (!officer_id) {
    return res
      .status(400)
      .json({ success: false, message: "officer_id is required" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM report_issues WHERE id = ? AND assigned_officer_id = ?",
      [id, officer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found or not assigned to this officer",
      });
    }

    return res.json({ success: true, issue: rows[0] });
  } catch (err) {
    console.error("OFFICER ISSUE DETAILS ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching issue details" });
  } finally {
    if (connection) await connection.end();
  }
});

module.exports = router;
