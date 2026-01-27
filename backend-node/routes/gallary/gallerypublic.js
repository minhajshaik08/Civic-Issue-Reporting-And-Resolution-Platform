const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

/* ================= DB ================= */
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

/**
 * PUBLIC GALLERY
 * GET /api/gallary/public
 */
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `SELECT 
         id,
         employee_id,
         headline,
         imagepaths,
         afterimagepath,
         created_at
       FROM gallary_images
       ORDER BY created_at DESC
       LIMIT 50`
    );

    await connection.end();

    const galleries = rows.map((r) => ({
      id: r.id,
      employee_id: r.employee_id,
      headline: r.headline,
      imagepaths: JSON.parse(r.imagepaths || "[]"),
      afterimagepath: JSON.parse(r.afterimagepath || "[]"),
      created_at: r.created_at,
    }));

    res.json({ success: true, galleries });
  } catch (err) {
    console.error("PUBLIC GALLERY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load public gallery",
    });
  }
});

module.exports = router;
