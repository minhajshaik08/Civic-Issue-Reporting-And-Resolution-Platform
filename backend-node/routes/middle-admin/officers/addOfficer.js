const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const pool = require("../../../config/database");

const router = express.Router();

// Middle Admin: ADD OFFICER
// POST /api/middle-admin/officers/add
router.post("/add", async (req, res) => {
  const {
    name,
    designation,
    department,
    zone,
    mobile,
    email,
    employeeId,
    role,
    password,
  } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.json({
      success: false,
      message: "Name, email, mobile and password are required",
    });
  }

  try {
    const connection = await pool.getConnection();

    const hashed = await bcrypt.hash(password.trim(), 10);

    const [result] = await connection.execute(
      `INSERT INTO officers
       (name, designation, department, zone, mobile, email, employee_id, role, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        designation || "",
        department || "",
        zone || "",
        mobile.trim(),
        email.trim(),
        employeeId || "",
        role || "",
        hashed,
      ]
    );

    connection.release();

    return res.json({
      success: true,
      message: "Officer added",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Middle-admin add officer error:", err);
    return res.json({
      success: false,
      message:
        err.code === "ER_DUP_ENTRY"
          ? "Email or Employee ID already exists"
          : "Database error",
    });
  }
});

module.exports = router;
