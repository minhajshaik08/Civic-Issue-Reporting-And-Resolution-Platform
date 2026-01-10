const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken"); // ✅ ADD THIS
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// in-memory upload (for profile photo)
const upload = multer({ storage: multer.memoryStorage() });

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

// ========== MULTI-TABLE ROLE-BASED LOGIN with JWT ✅ ==========
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await getConnection();

    // 1. Check MIDDLE ADMIN first (middle_admins table)
    let [rows] = await connection.execute(
      "SELECT id, username, full_name, phone, email, password FROM middle_admins WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        await connection.end();
        
        // ✅ GENERATE JWT TOKEN
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: "middle_admin",
            table: "middle_admins",
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
          success: true,
          message: "Login successful",
          token: token, // ✅ SEND TOKEN
          user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name || "",
            phone: user.phone || "",
            email: user.email,
            role: "middle_admin",
            table: "middle_admins",
          },
        });
      }
    }

    // 2. Check OFFICER next (officers table)
    [rows] = await connection.execute(
      "SELECT id, name, mobile, email, password, username FROM officers WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        await connection.end();
        
        // ✅ GENERATE JWT TOKEN
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username || user.name || "",
            email: user.email,
            role: "officer",
            table: "officers",
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
          success: true,
          message: "Login successful",
          token: token, // ✅ SEND TOKEN
          user: {
            id: user.id,
            username: user.username || user.name || "",
            full_name: user.name || "",
            phone: user.mobile || "",
            email: user.email,
            role: "officer",
            table: "officers",
          },
        });
      }
    }

    // 3. Finally check SUPER ADMIN (admins table)
    [rows] = await connection.execute(
      "SELECT id, username, full_name, phone, email, password FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        await connection.end();
        
        // ✅ GENERATE JWT TOKEN
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            role: "super_admin",
            table: "admins",
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
          success: true,
          message: "Login successful",
          token: token, // ✅ SEND TOKEN
          user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name || "",
            phone: user.phone || "",
            email: user.email,
            role: "super_admin",
            table: "admins",
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

// ========== CHECK USERNAME AVAILABILITY ==========
router.get("/check-username", async (req, res) => {
  const { username, excludeId, table } = req.query;

  if (!username) {
    return res.json({ available: false, message: "Username is required" });
  }

  try {
    const connection = await getConnection();

    // If table is provided and valid, check only that table (profile edit),
    // otherwise check all three tables (can be used for signup).
    const tables =
      table && ["admins", "middle_admins", "officers"].includes(table)
        ? [table]
        : ["admins", "middle_admins", "officers"];

    for (const t of tables) {
      const [rows] = await connection.execute(
        `SELECT id FROM ${t} WHERE username = ? AND id != ?`,
        [username, excludeId || 0]
      );
      if (rows.length > 0) {
        await connection.end();
        return res.json({ available: false });
      }
    }

    await connection.end();
    return res.json({ available: true });
  } catch (err) {
    console.error("CHECK USERNAME ERROR:", err);
    return res
      .status(500)
      .json({ available: false, message: "Error checking username" });
  }
});

// ========== UPDATE PROFILE ==========
router.put("/profile", upload.single("photo"), async (req, res) => {
  const { id, table, username, full_name, phone } = req.body;

  if (!id || !table || !username) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Map logical fields to real column names
  let nameColumn = "full_name";
  let phoneColumn = "phone";

  if (table === "officers") {
    nameColumn = "name";
    phoneColumn = "mobile";
  }

  try {
    const connection = await getConnection();

    let query =
      `UPDATE ${table} SET username = ?, ${nameColumn} = ?, ${phoneColumn} = ?`;
    const params = [username, full_name || null, phone || null];

    // optional photo
    if (req.file) {
      const uploadsDir = path.join(__dirname, "..", "uploads", "profiles");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = Date.now() + "-" + req.file.originalname;
      const fullPath = path.join(uploadsDir, filename);
      fs.writeFileSync(fullPath, req.file.buffer);

      const relativePath = "profiles/" + filename;
      query += ", photo_url = ?";
      params.push(relativePath);
    }

    query += " WHERE id = ?";
    params.push(id);

    await connection.execute(query, params);
    await connection.end();

    return res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error updating profile" });
  }
});

// ========== CHANGE PASSWORD ==========
router.post("/change-password", async (req, res) => {
  const { userId, table, currentPassword, newPassword } = req.body;

  if (!userId || !table || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // allow only these tables
  const allowedTables = ["admins", "middle_admins", "officers"];
  if (!allowedTables.includes(table)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid table" });
  }

  try {
    const connection = await getConnection();

    // 1) Get current hashed password from the correct table
    const [rows] = await connection.execute(
      `SELECT password FROM ${table} WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      await connection.end();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    // 2) Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await connection.end();
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // 3) Hash new password and update in that table
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await connection.execute(
      `UPDATE ${table} SET password = ? WHERE id = ?`,
      [hashed, userId]
    );

    await connection.end();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error changing password" });
  }
});

module.exports = router;
