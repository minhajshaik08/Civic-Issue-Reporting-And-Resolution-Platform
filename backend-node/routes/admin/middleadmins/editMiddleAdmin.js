const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// PUT /api/admin/middle-admins/edit/:id
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (!username || !username.trim()) {
    return res.json({ success: false, message: "Username is required" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let query = "UPDATE middle_admins SET username = ? WHERE id = ?";
    const params = [username.trim(), id];

    if (password && password.trim().length >= 6) {
      const hashed = await bcrypt.hash(password.trim(), 10);
      query = "UPDATE middle_admins SET username = ?, password = ? WHERE id = ?";
      params.splice(1, 0, hashed); // [username, hashed, id]
    }

    const [result] = await connection.execute(query, params);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Middle admin not found" });
    }

    return res.json({ success: true, message: "Middle admin updated" });
  } catch (e) {
    console.error("Edit middle admin - DB error:", e);
    return res.json({
      success: false,
      message: e.message || "Database error while editing middle admin",
    });
  }
});

module.exports = router;
