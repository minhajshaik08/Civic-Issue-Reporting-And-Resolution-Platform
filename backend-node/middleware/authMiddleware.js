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

    // ✅ Don't check officers table - token is already verified by JWT
    // The user could be admin, middle_admin, or officer
    // Just attach email + id to req.user for audit logging
    req.user = {
      id: id,
      email: email,
      username: decoded.username
    };

    // auth successful (no terminal output of user data)
    next();

  } catch (err) {
    console.error('❌ Auth error:', err.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { authMiddleware };
