const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// CHANGE these to match your MySQL settings
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// helper: get a DB connection
async function getConnection() {
  return mysql.createConnection(dbConfig);
}

// ========== SIGN UP (Super Admin only) ==========
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const connection = await getConnection();

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    await connection.execute(
      "INSERT INTO admins (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    await connection.end();

    res.json({ success: true, message: "Super Admin saved to database" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// ========== MULTI-TABLE ROLE-BASED LOGIN ==========
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await getConnection();

    // 1. Check SUPER ADMIN (admins table)
    let [rows] = await connection.execute(
      "SELECT id, username, email, password FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        await connection.end();
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: "super_admin",
            table: "admins",
          },
        });
      }
    }

    // 2. Check MIDDLE ADMIN (middle_admins table)
    [rows] = await connection.execute(
      "SELECT id, username, email, password FROM middle_admins WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        await connection.end();
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: "middle_admin",
            table: "middle_admins",
          },
        });
      }
    }

    // 3. Check OFFICER (officers table)
    [rows] = await connection.execute(
      "SELECT id, username, email, password FROM officers WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        await connection.end();
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: "officer",
            table: "officers",
          },
        });
      }
    }

    // No match in any table
    await connection.end();
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ success: false, message: "Login error" });
  }
});

// ========== FORGOT PASSWORD ==========
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const connection = await getConnection();

    // Check all tables for email
    let [rows] = await connection.execute(
      "SELECT id, username, email, 'admins' as table_name FROM admins WHERE email = ? UNION " +
        "SELECT id, username, email, 'middle_admins' as table_name FROM middle_admins WHERE email = ? UNION " +
        "SELECT id, username, email, 'officers' as table_name FROM officers WHERE email = ?",
      [email, email, email]
    );

    if (rows.length === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const resetLink = `http://localhost:3000/Login/reset-password?token=${token}&id=${user.id}&table=${user.table_name}`;

    // Configure mail transport (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "YOUR_GMAIL@gmail.com",
        pass: "YOUR_APP_PASSWORD_HERE",
      },
    });

    // Send email
    await transporter.sendMail({
      from: '"Civic Report" <YOUR_GMAIL@gmail.com>',
      to: user.email,
      subject: "Password Reset Link",
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click this link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    await connection.end();

    return res.json({
      success: true,
      message: "Reset link sent to your email address",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error sending reset email" });
  }
});

// ========== RESET PASSWORD (Multi-table) ==========
router.post("/reset-password", async (req, res) => {
  const { id, table_name, password } = req.body;

  try {
    const connection = await getConnection();

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const tableMap = {
      admins: "admins",
      middle_admins: "middle_admins",
      officers: "officers",
    };

    const table = tableMap[table_name];
    if (!table) {
      await connection.end();
      return res
        .status(400)
        .json({ success: false, message: "Invalid table name" });
    }

    await connection.execute(
      `UPDATE ${table} SET password = ? WHERE id = ?`,
      [hashed, id]
    );

    await connection.end();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error updating password" });
  }
});

module.exports = router;
