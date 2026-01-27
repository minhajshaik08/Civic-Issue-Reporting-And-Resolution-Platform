const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

/* ================= DB CONFIG ================= */
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

/* =========================================================
   GET: Check username availability (ADMINS ONLY)
   URL: /api/admin/settings/profile/check-username
   ========================================================= */
router.get("/check-username", async (req, res) => {
  const { username, excludeId } = req.query;

  if (!username) {
    return res.json({ available: false });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `
      SELECT id
      FROM admins
      WHERE username = ?
        AND id != ?
      LIMIT 1
      `,
      [username, excludeId || 0]
    );

    await connection.end();

    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error("CHECK USERNAME ERROR:", err);
    res.json({ available: false });
  }
});

/* =========================================================
   PUT: Update admin profile
   URL: /api/admin/settings/profile
   ========================================================= */
router.put("/", async (req, res) => {
  const { id, username, full_name, phone } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Admin ID is required" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const fields = [];
    const values = [];

    if (username) {
      fields.push("username = ?");
      values.push(username);
    }

    if (full_name) {
      fields.push("full_name = ?");
      values.push(full_name);
    }

    if (phone) {
      fields.push("phone = ?");
      values.push(phone);
    }

    if (fields.length === 0) {
      await connection.end();
      return res.json({ success: true });
    }

    const sql = `
      UPDATE admins
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await connection.execute(sql, values);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating profile" });
  }
});

module.exports = router;
