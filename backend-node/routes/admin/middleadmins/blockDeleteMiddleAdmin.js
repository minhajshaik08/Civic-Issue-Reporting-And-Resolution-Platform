const express = require("express");
const mysql = require("mysql2/promise");

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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

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

    return res.json({ success: true, message: "Middle admin deleted ✅" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
