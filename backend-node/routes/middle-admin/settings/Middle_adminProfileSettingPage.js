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
   GET: Check username availability (MIDDLE ADMINS)
   URL: /api/middle-admin/settings/profile/check-username
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
      FROM middle_admins
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
   GET: Fetch middle admin profile
   URL: /api/middle-admin/settings/profile/:id
   ========================================================= */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `
      SELECT id, username, full_name, phone, email, role
      FROM middle_admins
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Middle admin not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error("FETCH MIDDLE ADMIN PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
});

/* =========================================================
   PUT: Update middle admin profile (ADMIN STYLE)
   URL: /api/middle-admin/settings/profile
   ========================================================= */
router.put("/", async (req, res) => {
  const { id, username, full_name, phone } = req.body;

  // ✅ SAME AS ADMIN
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Middle admin ID is required",
    });
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
      UPDATE middle_admins
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await connection.execute(sql, values);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Middle admin not found",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE MIDDLE ADMIN PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
});

module.exports = router;
