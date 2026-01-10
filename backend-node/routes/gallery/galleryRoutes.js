const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { authMiddleware } = require("../../middleware/authMiddleware");

const UPLOAD_PATH = path.join(__dirname, "../../uploads/gallary");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(UPLOAD_PATH, { recursive: true });
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 10 } });

const dbConfig = {
  host: "localhost",
  user: "root", 
  password: "Chandana@1435",
  database: "civicreport"
};

const getEmployeeIdFromEmail = async (email) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT employee_id FROM officers WHERE email = ? LIMIT 1",
      [email]
    );
    await connection.end();
    return rows[0]?.employee_id || null;
  } catch (err) {
    console.error('❌ Employee lookup:', err);
    return null;
  }
};

// ✅ OFFICER Profile (email → employee_id)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const employee_id = await getEmployeeIdFromEmail(email);
    
    if (!employee_id) return res.status(404).json({ success: false, message: "Officer not found" });
    
    res.json({ success: true, email, employee_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ OFFICER Upload
router.post("/upload", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const email = req.user.email;
    const headline = req.body.headline?.trim() || "Untitled";
    
    if (!req.files?.length) return res.status(400).json({ success: false, message: "No images" });

    const employee_id = await getEmployeeIdFromEmail(email);
    if (!employee_id) return res.status(404).json({ success: false, message: "Officer not found" });

    const connection = await mysql.createConnection(dbConfig);
    const photoPaths = req.files.map(f => f.filename);
    
    const [result] = await connection.execute(
      `INSERT INTO gallary_images (employee_id, headline, imagepaths) VALUES (?, ?, ?)`,
      [employee_id, headline, JSON.stringify(photoPaths)]
    );
    
    await connection.end();

    res.json({
      success: true,
      message: `${photoPaths.length} images uploaded`,
      data: { id: result.insertId, employee_id, images: photoPaths.length }
    });
    
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ OFFICER List (THEIR galleries only)
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const employee_id = await getEmployeeIdFromEmail(email);
    
    if (!employee_id) return res.status(404).json({ success: false, message: "Officer not found" });

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT id, employee_id, headline, imagepaths, created_at 
       FROM gallary_images WHERE employee_id = ? ORDER BY created_at DESC`,
      [employee_id]
    );
    
    const galleries = rows.map(row => ({
      id: row.id,
      employee_id: row.employee_id,
      headline: row.headline,
      imagepaths: JSON.parse(row.imagepaths || '[]'),
      created_at: row.created_at,
      total_images: JSON.parse(row.imagepaths || '[]').length
    }));
    
    await connection.end();
    
    res.json({ success: true, images: galleries, count: galleries.length, employee_id });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ OFFICER Delete (own only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;
    
    const employee_id = await getEmployeeIdFromEmail(email);
    if (!employee_id) return res.status(404).json({ success: false, message: "Officer not found" });

    const connection = await mysql.createConnection(dbConfig);
    const [checkRows] = await connection.execute(
      `SELECT id FROM gallary_images WHERE id = ? AND employee_id = ?`,
      [id, employee_id]
    );
    
    if (checkRows.length === 0) {
      await connection.end();
      return res.status(404).json({ success: false, message: "Not yours" });
    }
    
    await connection.execute(`DELETE FROM gallary_images WHERE id = ?`, [id]);
    await connection.end();
    
    res.json({ success: true, message: "Deleted" });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ PUBLIC: Main page (ALL galleries)
router.get("/public", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT id, employee_id, headline, imagepaths, created_at 
       FROM gallary_images ORDER BY created_at DESC LIMIT 50`
    );
    
    const galleries = rows.map(row => ({
      id: row.id,
      employee_id: row.employee_id,
      headline: row.headline,
      imagepaths: JSON.parse(row.imagepaths || '[]'),
      created_at: row.created_at,
      total_images: JSON.parse(row.imagepaths || '[]').length
    }));
    
    await connection.end();
    
    res.json({ success: true, galleries, total: galleries.length });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
