const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();
const pool = require("../../config/database");

// ✅ GET ADMIN DASHBOARD SUMMARY (Stats + Recent Issues)
router.get("/summary", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // ✅ Total Issues
    const [totalIssuesRows] = await connection.execute(
      "SELECT COUNT(*) AS totalIssues FROM report_issues"
    );

    // ✅ Registered Users (Unique phone count)
    const [registeredUsersRows] = await connection.execute(
      `SELECT COUNT(DISTINCT phone) AS registeredUsers
       FROM report_issues
       WHERE phone IS NOT NULL AND phone <> ''`
    );

    // ✅ On-duty Officers (status = 1)
    const [onDutyOfficersRows] = await connection.execute(
      "SELECT COUNT(*) AS onDutyOfficers FROM officers WHERE status = 0"
    );

    // ✅ Resolved Issues = Solved (latest status VERIFIED)
    const [resolvedIssuesRows] = await connection.execute(`
      SELECT COUNT(*) AS resolvedIssues
      FROM (
        SELECT issue_id, MAX(changed_at) AS last_time
        FROM issue_status_history
        GROUP BY issue_id
      ) lastStatus
      JOIN issue_status_history h
        ON h.issue_id = lastStatus.issue_id
       AND h.changed_at = lastStatus.last_time
      WHERE h.new_status = 'SOLVED'
    `);

    // ✅ Recent Issues (latest 5 with created_at)
    // ✅ NOTE: If your column is not created_at, tell me exact name
    const [recentIssuesRows] = await connection.execute(
      `SELECT id, issue_type, description, created_at
       FROM report_issues
       ORDER BY created_at DESC
       LIMIT 5`
    );

    connection.release();

    return res.json({
      stats: {
        totalIssues: totalIssuesRows[0].totalIssues,
        registeredUsers: registeredUsersRows[0].registeredUsers,
        onDutyOfficers: onDutyOfficersRows[0].onDutyOfficers,
        resolvedIssues: resolvedIssuesRows[0].resolvedIssues,
      },
      recentIssues: recentIssuesRows,
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
