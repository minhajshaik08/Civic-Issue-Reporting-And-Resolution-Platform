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

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
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

  if (!name || !email || !mobile) {
    return res.json({
      success: false,
      message: "Name, email, and mobile are required.",
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let query =
      "UPDATE officers SET name = ?, designation = ?, department = ?, zone = ?, mobile = ?, email = ?, employee_id = ?, role = ? WHERE id = ?";
    let params = [
      name.trim(),
      designation || "",
      department || "",
      zone || "",
      mobile.trim(),
      email.trim(),
      employeeId || "",
      role || "",
      id,
    ];

    if (password && password.trim().length >= 6) {
      const hashed = await bcrypt.hash(password.trim(), 10);
      query =
        "UPDATE officers SET name = ?, designation = ?, department = ?, zone = ?, mobile = ?, email = ?, employee_id = ?, role = ?, password = ? WHERE id = ?";
      params = [
        name.trim(),
        designation || "",
        department || "",
        zone || "",
        mobile.trim(),
        email.trim(),
        employeeId || "",
        role || "",
        hashed,
        id,
      ];
    }

    const [result] = await connection.execute(query, params);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Officer not found" });
    }

    // TODO: Add audit log insertion here if needed

    return res.json({ success: true, message: "Officer updated successfully" });
  } catch (e) {
    console.error("Edit officer error:", e);
    return res.json({ success: false, message: "Database error" });
  }
});

module.exports = router;
