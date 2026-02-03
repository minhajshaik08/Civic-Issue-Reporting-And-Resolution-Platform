const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../../../config/database");

const router = express.Router();

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;

  const {
    name,
    designation,
    department,
    zone,
    mobile,
    role,
    password,
  } = req.body;

  if (!name || !mobile || !department) {
    return res.json({
      success: false,
      message: "Name, Mobile and Department are required.",
    });
  }

  // ✅ protect role (never allow email)
  const safeRole =
    role && typeof role === "string" && role.includes("@")
      ? ""
      : role || "";

  try {
    const connection = await pool.getConnection();

    let query =
      "UPDATE officers SET name=?, designation=?, department=?, zone=?, mobile=?, role=? WHERE id=?";

    let params = [
      name.trim(),
      designation || "",
      department.trim(),
      zone || "",
      mobile.trim(),
      safeRole,
      id,
    ];

    if (password && password.trim().length >= 6) {
      const hashed = await bcrypt.hash(password.trim(), 10);

      query =
        "UPDATE officers SET name=?, designation=?, department=?, zone=?, mobile=?, role=?, password=? WHERE id=?";

      params = [
        name.trim(),
        designation || "",
        department.trim(),
        zone || "",
        mobile.trim(),
        safeRole,
        hashed,
        id,
      ];
    }

    const [result] = await connection.execute(query, params);

    connection.release();

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Officer not found",
      });
    }

    return res.json({
      success: true,
      message: "Officer updated successfully",
    });

  } catch (e) {
    console.error("Edit officer error:", e);
    return res.json({
      success: false,
      message: "Database error",
    });
  }
});

module.exports = router;
