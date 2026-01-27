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
   GET: Check username availability (OFFICERS)
   URL: /api/officer/settings/profile/check-username
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
      FROM officers
      WHERE LOWER(username) = LOWER(?)
        AND id != ?
      LIMIT 1
      `,
      [username.trim(), excludeId || 0]
    );

    await connection.end();

    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error("OFFICER CHECK USERNAME ERROR:", err);
    res.json({ available: false });
  }
});

/* =========================================================
   GET: Fetch officer profile
   URL: /api/officer/settings/profile/:id
   ========================================================= */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `
      SELECT
        id,
        username,
        name,
        mobile,
        email,
        role,
        designation,
        department,
        zone,
        employee_id
      FROM officers
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error("FETCH OFFICER PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching officer profile",
    });
  }
});

/* =========================================================
   PUT: Update officer profile (SAME AS MIDDLE ADMIN)
   URL: /api/officer/settings/profile
   ========================================================= */
router.put("/", async (req, res) => {
  const { id, username, name, mobile } = req.body;

  // ✅ SAME VALIDATION STYLE
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Officer ID is required",
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const fields = [];
    const values = [];

    if (username) {
      fields.push("username = ?");
      values.push(username.trim());
    }

    if (name) {
      fields.push("name = ?");
      values.push(name.trim());
    }

    if (mobile) {
      fields.push("mobile = ?");
      values.push(mobile.trim());
    }

    if (fields.length === 0) {
      await connection.end();
      return res.json({ success: true });
    }

    const sql = `
      UPDATE officers
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await connection.execute(sql, values);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE OFFICER PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error updating officer profile",
    });
  }
});

module.exports = router;
