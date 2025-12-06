const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// PATCH /api/admin/middle-admins/block/:id -> block or unblock middle admin
router.patch("/block/:id", async (req, res) => {
  const { id } = req.params;
  const { block } = req.body; // boolean to block=true or unblock=false

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      "UPDATE middle_admins SET is_blocked = ? WHERE id = ?",
      [block ? 1 : 0, id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Middle admin not found" });
    }

    return res.json({
      success: true,
      message: block ? "Middle admin blocked" : "Middle admin unblocked",
    });
  } catch (err) {
    console.error("Block/unblock error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

// DELETE /api/admin/middle-admins/:id -> delete middle admin
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
      return res.json({ success: false, message: "Middle admin not found" });
    }

    return res.json({ success: true, message: "Middle admin deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
