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
    const connection = await mysql.createConnection(dbConfig);

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

    await connection.end();

    return res.json({ success: true, message: "Officer added", id: result.insertId });
  } catch (err) {
    console.error("Add officer error:", err);
    return res.json({
      success: false,
      message: err.code === "ER_DUP_ENTRY" ? "Email or Employee ID already exists" : "Database error",
    });
  }
});

module.exports = router;
