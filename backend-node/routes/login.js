const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

// ✅ POST http://localhost:5000/api/login
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and Password required" });
  }

  try {
    const connection = await pool.getConnection();

    // ✅ 1) CHECK MIDDLE ADMINS FIRST
    let [rows] = await connection.execute(
      "SELECT id, username, full_name, phone, email, password, is_blocked FROM middle_admins WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];

      // ✅ BLOCK CHECK (middle_admins.is_blocked = 1 means blocked)
      if (Number(user.is_blocked) === 1) {
        connection.release();
        return res.status(403).json({
          success: false,
          message: "Your account is blocked. Please contact admin.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        connection.release();
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      connection.release();

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "middle_admin",
          table: "middle_admins",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      return res.json({
        success: true,
        message: "Login successful ✅",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: "middle_admin",
          username: user.username || "",
          full_name: user.full_name || "",
          phone: user.phone || "",
        },
      });
    }

    // ✅ 2) CHECK OFFICERS NEXT
    [rows] = await connection.execute(
      "SELECT id, username, name, mobile, email, password, status, employee_id, department, zone FROM officers WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];

      // ✅ BLOCK CHECK (officers.status = 1 means blocked)
      if (Number(user.status) === 1) {
        connection.release();
        return res.status(403).json({
          success: false,
          message: "Your account is blocked. Please contact admin.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        connection.release();
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // ✅ update last_login
      await connection.execute(
        "UPDATE officers SET last_login = NOW() WHERE id = ?",
        [user.id]
      );

      connection.release();

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "officer",
          table: "officers",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      return res.json({
        success: true,
        message: "Login successful ✅",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: "officer",
          username: user.username || user.name || "",
          full_name: user.name || "",
          phone: user.mobile || "",
          employee_id: user.employee_id || "",
          department: user.department || "",
          zone: user.zone || "",
        },
      });
    }

    // ✅ 3) CHECK SUPER ADMIN LAST
    [rows] = await connection.execute(
      "SELECT id, username, full_name, phone, email, password FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        connection.release();
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      connection.release();

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: "super_admin",
          table: "admins",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      return res.json({
        success: true,
        message: "Login successful ✅",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: "super_admin",
          username: user.username || "",
          full_name: user.full_name || "",
          phone: user.phone || "",
        },
      });
    }

    // ❌ Not found in any table
    connection.release();
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
