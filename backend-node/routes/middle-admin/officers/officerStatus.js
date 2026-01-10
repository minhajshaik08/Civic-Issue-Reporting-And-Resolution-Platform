const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// PATCH /api/middle-admin/officers/block/:id
router.patch("/block/:id", async (req, res) => {
  const { id } = req.params;
  const { block } = req.body; // true = block, false = unblock

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      "UPDATE officers SET status = ? WHERE id = ?",
      [block ? 1 : 0, id]
    );

    await connection.end();

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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      "DELETE FROM officers WHERE id = ?",
      [id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Officer not found" });
    }

    return res.json({ success: true, message: "Officer deleted" });
  } catch (err) {
    console.error("Middle-admin delete officer error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
