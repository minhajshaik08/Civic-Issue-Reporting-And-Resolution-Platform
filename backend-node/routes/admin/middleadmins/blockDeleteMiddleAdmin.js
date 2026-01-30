const express = require("express");
const mysql = require("mysql2/promise");
const { authMiddleware } = require("../../../middleware/authMiddleware");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// ✅ PATCH -> Block / Unblock middle admin
// URL: /api/admin/middle-admins/block/:id
router.patch("/block/:id", async (req, res) => {
  const { id } = req.params;
  const { block } = req.body; // true=block, false=unblock

  try {
    const connection = await mysql.createConnection(dbConfig);

    // ✅ Update block status in DB
    const [result] = await connection.execute(
      "UPDATE middle_admins SET is_blocked = ? WHERE id = ?",
      [block ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "Middle admin not found" });
    }

    // ✅ Fetch updated admin (send to frontend)
    const [updatedRows] = await connection.execute(
      "SELECT id, username, email, is_blocked, created_at FROM middle_admins WHERE id = ?",
      [id]
    );

    await connection.end();

    return res.json({
      success: true,
      message: block ? "Middle admin blocked ✅" : "Middle admin unblocked ✅",
      admin: updatedRows[0],
    });
  } catch (err) {
    console.error("Block/unblock error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

// ✅ DELETE -> Delete middle admin
// URL: /api/admin/middle-admins/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // ✅ SELECT before delete to capture deleted record info
    const [rows] = await connection.execute(
      "SELECT id, email, username FROM middle_admins WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "Middle admin not found" });
    }

    const deletedRow = rows[0];

    const [result] = await connection.execute(
      "DELETE FROM middle_admins WHERE id = ?",
      [id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Middle admin not found" });
    }

    // ✅ Log deletion to audit_logs (await to ensure it completes)
    try {
      const { logDeletion } = require("../../../utils/audit");
      await logDeletion(req, deletedRow, "middle_admins", "admins");
    } catch (e) {
      console.error("❌ Audit log error:", e.message);
    }

    return res.json({ success: true, message: "Middle admin deleted ✅" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
