const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { authMiddleware } = require("../../../middleware/authMiddleware");
const pool = require("../../../config/database");

/* ================= PATH ================= */
const UPLOAD_PATH = path.join(__dirname, "../../../uploads/gallary");

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(UPLOAD_PATH, { recursive: true });
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const unique =
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 9) +
      path.extname(file.originalname);
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ================= HELPERS ================= */
const getEmployeeIdFromEmail = async (email) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute(
    "SELECT employee_id FROM officers WHERE email = ? LIMIT 1",
    [email]
  );
  connection.release();
  return rows.length ? rows[0].employee_id : null;
};

/* ================= PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const employee_id = await getEmployeeIdFromEmail(req.user.email);
    if (!employee_id) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    res.json({
      success: true,
      employee_id,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= UPLOAD ================= */
router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "beforeImages", maxCount: 5 },
    { name: "afterImages", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { headline, beforesolve, afteresolve } = req.body;

      if (!headline || !beforesolve || !afteresolve) {
        return res.status(400).json({ success: false, message: "All fields required" });
      }

      const employee_id = await getEmployeeIdFromEmail(req.user.email);
      if (!employee_id) {
        return res.status(404).json({ success: false, message: "Officer not found" });
      }

      const beforeImages = (req.files.beforeImages || []).map(f => f.filename);
      const afterImages = (req.files.afterImages || []).map(f => f.filename);

      if (!beforeImages.length || !afterImages.length) {
        return res.status(400).json({
          success: false,
          message: "Before & After images required",
        });
      }

      if (beforeImages.length > 5 || afterImages.length > 5) {
        return res.status(400).json({
          success: false,
          message: "You can upload only up to 5 images per section (Before & After)",
        });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.execute(
        `INSERT INTO gallary_images
         (employee_id, headline, imagepaths, beforesolve, afteresolve, afterimagepath)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          employee_id,
          headline.trim(),
          JSON.stringify(beforeImages),
          beforesolve.trim(),
          afteresolve.trim(),
          JSON.stringify(afterImages),
        ]
      );

      connection.release();

      res.json({
        success: true,
        message: "Gallery uploaded successfully",
        id: result.insertId,
      });
    } catch (err) {
      // Handle multer specific errors
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "You can upload only up to 5 images per section (Before & After)",
        });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 5MB limit",
        });
      }
      if (err.code === "UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          message: "Invalid form field. Use 'beforeImages' and 'afterImages' fields only",
        });
      }
      
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ================= LIST ================= */
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const employee_id = await getEmployeeIdFromEmail(req.user.email);
    if (!employee_id) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT id, headline, imagepaths, beforesolve,
              afteresolve, afterimagepath, created_at
       FROM gallary_images
       WHERE employee_id = ?
       ORDER BY created_at DESC`,
      [employee_id]
    );
    connection.release();

    const galleries = rows.map(r => ({
      ...r,
      imagepaths: JSON.parse(r.imagepaths || "[]"),
      afterimagepath: JSON.parse(r.afterimagepath || "[]"),
    }));

    res.json({ success: true, galleries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const employee_id = await getEmployeeIdFromEmail(req.user.email);
    if (!employee_id) {
      return res.json({ success: false, message: "Officer not found" });
    }

    const connection = await pool.getConnection();

    // ✅ Delete gallery image
    const [result] = await connection.execute(
      "DELETE FROM gallary_images WHERE id = ? AND employee_id = ?",
      [req.params.id, employee_id]
    );
    connection.release();

    if (!result.affectedRows) {
      return res.json({ success: false, message: "Gallery not found" });
    }

    // ✅ Log deletion to audit_logs
    const deletedRow = { email: req.user.email, employee_id };
    try {
      const { logDeletion } = require("../../../utils/audit");
      await logDeletion(req, deletedRow, "gallary_images", "officers");
    } catch (e) {
      console.error("❌ Audit log error:", e.message);
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
