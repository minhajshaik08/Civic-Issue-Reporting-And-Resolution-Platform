const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// PATCH /api/admin/users/block/:mobile
router.patch("/block/:mobile", async (req, res) => {
  const { mobile } = req.params;
  const { block, reason } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    if (block) {
      await connection.execute(
        "INSERT IGNORE INTO blocked_mobiles (mobile, reason) VALUES (?, ?)",
        [mobile, reason || "Blocked from admin panel"]
      );
    } else {
      await connection.execute(
        "DELETE FROM blocked_mobiles WHERE mobile = ?",
        [mobile]
      );
    }

    await connection.end();

    return res.json({
      success: true,
      message: block ? "User blocked" : "User unblocked",
    });
  } catch (err) {
    console.error("Block/unblock user error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
