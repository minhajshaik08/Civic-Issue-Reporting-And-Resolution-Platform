const express = require("express");
const mysql = require("mysql2/promise");
const pool = require("../../../config/database");

const router = express.Router();

// PATCH /api/middle-admin/users/block/:mobile
router.patch("/block/:mobile", async (req, res) => {
  const { mobile } = req.params;
  const { block, reason } = req.body;

  try {
    const connection = await pool.getConnection();

    if (block) {
      await connection.execute(
        "INSERT IGNORE INTO blocked_mobiles (mobile, reason) VALUES (?, ?)",
        [mobile, reason || "Blocked from middle-admin panel"]
      );
    } else {
      await connection.execute(
        "DELETE FROM blocked_mobiles WHERE mobile = ?",
        [mobile]
      );
    }

    connection.release();

    return res.json({
      success: true,
      message: block ? "User blocked" : "User unblocked",
    });
  } catch (err) {
    console.error("Middle-admin block/unblock user error:", err);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
