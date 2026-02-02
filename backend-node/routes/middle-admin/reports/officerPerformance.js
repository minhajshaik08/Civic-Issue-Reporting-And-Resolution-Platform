// backend-node/routes/middle-admin/reports/officerPerformance.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const pool = require("../../../config/database");

// GET /api/middle-admin/reports/officers/performance
router.get("/performance", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const [rows] = await conn.execute(
      `SELECT 
         changed_by_email,
         COUNT(*) AS total_actions,
         COUNT(CASE WHEN new_status = 'VIEWED' THEN 1 END)       AS viewed_count,
         COUNT(CASE WHEN new_status = 'VERIFIED' THEN 1 END)     AS verified_count,
         COUNT(CASE WHEN new_status = 'IN_PROGRESS' THEN 1 END)  AS in_progress_count,
         COUNT(CASE WHEN new_status = 'SOLVED' THEN 1 END)       AS solved_count
       FROM issue_status_history
       GROUP BY changed_by_email
       ORDER BY solved_count DESC, total_actions DESC`
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("MIDDLE-ADMIN OFFICER PERFORMANCE ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error loading performance" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

module.exports = router;
