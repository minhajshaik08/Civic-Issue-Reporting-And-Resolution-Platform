const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "issues"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// POST /api/issues/report — submit report with photos
router.post("/report", upload.array("photos", 5), async (req, res) => {
  const {
    fullName,
    phone,
    issueType,
    description,
    locationText,
    locationLat,
    locationLng,
  } = req.body;

  const photoPaths = (req.files || []).map((file) => file.filename);
  const photoPathsJson = JSON.stringify(photoPaths);

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      `INSERT INTO report_issues
       (full_name, phone, issue_type, description,
        location_text, location_lat, location_lng, photo_paths)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        phone,
        issueType,
        description,
        locationText,
        locationLat || null,
        locationLng || null,
        photoPathsJson,
      ]
    );

    await connection.end();
    res.json({ success: true, message: "Issue saved" });
  } catch (err) {
    console.error("Error saving issue:", err);
    res.status(500).json({ success: false, message: "Error saving issue" });
  }
});

// GET /api/issues?phone=1234567890 — fetch all issues for phone
router.get("/", async (req, res) => {
  const phone = req.query.phone;
  if (!phone) {
    return res.status(400).json({ success: false, message: "phone parameter required" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT id, full_name, phone, issue_type, description,
              location_text, location_lat, location_lng, photo_paths, created_at
       FROM report_issues WHERE phone = ? ORDER BY created_at DESC`,
      [phone]
    );

    await connection.end();
    res.json({ success: true, issues: rows });
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ success: false, message: "Error fetching issues" });
  }
});

module.exports = router;
