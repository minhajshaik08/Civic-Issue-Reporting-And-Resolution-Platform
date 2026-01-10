const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { authMiddleware } = require("../../../middleware/authMiddleware");

const UPLOAD_PATH = path.join(__dirname, "../../../uploads/gallary");

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

// ✅ Get employee_id from officers table using current login email
const getEmployeeIdFromEmail = async (email) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT employee_id FROM officers WHERE email = ? LIMIT 1",
      [email]
    );
    await connection.end();
    
    if (rows.length > 0) {
      return rows[0].employee_id;
    }
    return null;
  } catch (err) {
    console.error('❌ DB Query error:', err);
    return null;
  }
};

// ✅ NEW: Profile - Get employee_id for frontend display
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    console.log('🔍 Profile for email:', email);
    
    const employee_id = await getEmployeeIdFromEmail(email);
    
    if (!employee_id) {
      return res.status(404).json({ 
        success: false, 
        message: "Officer not found in officers table" 
      });
    }
    
    res.json({ 
      success: true, 
      email, 
      employee_id,  // ✅ Frontend displays this
      message: `Employee #${employee_id}`
    });
    
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ UPLOAD (unchanged)
router.post("/upload", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const email = req.user.email;
    const headline = req.body.headline?.trim() || "Untitled";
    
    console.log('📤 UPLOAD:', { email, headline, files: req.files?.length });

    if (!email) {
      return res.status(400).json({ success: false, message: "No email in token" });
    }

    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: "Select images" });
    }

    const employee_id = await getEmployeeIdFromEmail(email);
    
    if (!employee_id) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    console.log('✅ employee_id:', employee_id);

    const connection = await mysql.createConnection(dbConfig);
    const photoPaths = req.files.map(f => f.filename);
    
    const [result] = await connection.execute(
      `INSERT INTO gallary_images (employee_id, headline, imagepaths) 
       VALUES (?, ?, ?)`,
      [employee_id, headline, JSON.stringify(photoPaths)]
    );
    
    await connection.end();

    res.json({
      success: true,
      message: `${photoPaths.length} image${photoPaths.length !== 1 ? 's' : ''} uploaded!`,
      data: { 
        id: result.insertId, 
        employee_id,
        email,
        images: photoPaths.length 
      }
    });

  } catch (err) {
    console.error('❌ UPLOAD ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ LIST (unchanged)
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    
    console.log('📋 LIST for:', email);

    if (!email) {
      return res.status(400).json({ success: false, message: "No email in token" });
    }

    const employee_id = await getEmployeeIdFromEmail(email);
    
    if (!employee_id) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT id, employee_id, headline, imagepaths, created_at 
       FROM gallary_images WHERE employee_id = ? ORDER BY created_at DESC`,
      [employee_id]
    );
    
    const images = rows.map(row => ({
      id: row.id,
      employee_id: row.employee_id,
      headline: row.headline,
      imagepaths: row.imagepaths,
      created_at: row.created_at,
      total_images: JSON.parse(row.imagepaths || '[]').length
    }));
    
    await connection.end();
    
    console.log(`✅ ${images.length} galleries for employee_id:`, employee_id);
    
    res.json({ success: true, images, count: images.length, employee_id });
    
  } catch (err) {
    console.error('❌ LIST ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ DELETE (unchanged)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;
    
    console.log('🗑️ DELETE:', { id, email });

    if (!email) {
      return res.status(400).json({ success: false, message: "No email in token" });
    }

    const employee_id = await getEmployeeIdFromEmail(email);
    
    if (!employee_id) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    const [checkRows] = await connection.execute(
      `SELECT id FROM gallary_images WHERE id = ? AND employee_id = ?`,
      [id, employee_id]
    );
    
    if (checkRows.length === 0) {
      await connection.end();
      return res.status(404).json({ success: false, message: "Gallery not found or not yours" });
    }
    
    const [result] = await connection.execute(
      `DELETE FROM gallary_images WHERE id = ? AND employee_id = ?`,
      [id, employee_id]
    );
    
    await connection.end();
    
    console.log('✅ DELETED:', { id, employee_id });
    
    res.json({ success: true, message: "Deleted successfully" });
    
  } catch (err) {
    console.error('❌ DELETE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
