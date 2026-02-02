const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();
const pool = require("../../../config/database");

// GET /api/officer/issues?officer_id=1&status=NEW
router.get("/", async (req, res) => {
  const { status, officer_id } = req.query;

  if (!officer_id) {
    return res
      .status(400)
      .json({ success: false, message: "officer_id is required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    let sql = `
      SELECT r.*
      FROM report_issues r
      WHERE r.assigned_officer_id = ?
    `;
    const params = [officer_id];

    if (status) {
      sql += " AND r.status = ?";
      params.push(status);
    }

    const [rows] = await connection.execute(sql, params);

    return res.json({ success: true, issues: rows });
  } catch (err) {
    console.error("OFFICER ISSUES LIST ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching officer issues" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
