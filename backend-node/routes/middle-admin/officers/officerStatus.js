const express = require("express");
const mysql = require("mysql2/promise");
const pool = require("../../../config/database");
const { authMiddleware } = require("../../../middleware/authMiddleware");

const router = express.Router();

// PATCH /api/middle-admin/officers/block/:id
router.patch("/block/:id", async (req, res) => {
  const { id } = req.params;
  const { block } = req.body; // true = block, false = unblock

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      "UPDATE officers SET status = ? WHERE id = ?",
      [block ? 1 : 0, id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Officer not found" });
    }

    return res.json({
      success: true,
      message: block ? "Officer blocked" : "Officer unblocked",
    });
  } catch (err) {
    console.error("Middle-admin block/unblock officer error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

// DELETE /api/middle-admin/officers/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();

    // ✅ SELECT before delete to capture deleted record info
    const [rows] = await connection.execute(
      "SELECT id, email, employee_id FROM officers WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      connection.release();
      return res.json({ success: false, message: "Officer not found" });
    }

    const deletedRow = rows[0];

    const [result] = await connection.execute(
      "DELETE FROM officers WHERE id = ?",
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Officer not found" });
    }

    // ✅ Log deletion to audit_logs (await to ensure it completes)
    try {
      const { logDeletion } = require("../../../utils/audit");
      await logDeletion(req, deletedRow, "officers", "middle_admins");
    } catch (e) {
      console.error("❌ Audit log error:", e.message);
    }

    return res.json({ success: true, message: "Officer deleted ✅" });
  } catch (err) {
    console.error("❌ Middle-admin delete officer error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
