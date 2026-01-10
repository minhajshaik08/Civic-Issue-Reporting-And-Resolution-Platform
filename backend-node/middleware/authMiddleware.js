const jwt = require('jsonwebtoken');
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root", 
  password: "Chandana@1435",
  database: "civicreport"
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const email = decoded.email; // ✅ GET EMAIL FROM TOKEN
    const id = decoded.id || decoded.username;

    if (!email || !id) return res.status(401).json({ success: false, message: "Invalid token data" });

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, email FROM officers WHERE email = ? LIMIT 1",
      [email]
    );
    
    if (rows.length === 0) {
      await connection.end();
      return res.status(401).json({ success: false, message: "Officer not found" });
    }

    await connection.end();
    
    // ✅ Attach email + id to req.user
    req.user = {
      id: id,
      email: email,
      username: decoded.username
    };

    console.log('✅ Auth OK:', { id, email });
    next();

  } catch (err) {
    console.error('❌ Auth error:', err.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { authMiddleware };
