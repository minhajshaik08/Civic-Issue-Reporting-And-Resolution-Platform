const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// GET /api/admin/middle-admins/list -> list all middle admins
router.get("/list", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT id, username, email, created_at FROM middle_admins ORDER BY id DESC"
    );

    await connection.end();

    return res.json({
      success: true,
      middleAdmins: rows,
    });
  } catch (e) {
    console.error("List middle admins - DB error:", e);
    return res.json({
      success: false,
      message: e.message || "Database error while listing middle admins",
    });
  }
});

module.exports = router;
