const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Chandana@1435",
  database: "civicreport",
};

/**
 * Extract performer details from req.user (set by authMiddleware)
 * or from JWT token if req.user is not available
 */
async function guessPerformerFromReq(req) {
  // If authMiddleware already populated req.user, use it
  if (req.user) {
    return {
      email: req.user.email || "unauthenticated",
      id: req.user.id || null,
      table: null, // will be determined by lookup
    };
  }

  // If no req.user, try to extract from Authorization header token
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return {
      email: "unauthenticated",
      id: null,
      table: null,
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret");
    return {
      email: decoded.email || "unauthenticated",
      id: decoded.id || null,
      table: null, // will be determined by lookup
    };
  } catch {
    return {
      email: "unauthenticated",
      id: null,
      table: null,
    };
  }
}

/**
 * Find which table the performer belongs to by email
 */
async function findPerformerByEmail(email) {
  if (!email || email === "unauthenticated") {
    return { table: "unauthenticated", id: null };
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Try admins table
    let [rows] = await connection.execute(
      "SELECT id FROM admins WHERE email = ? LIMIT 1",
      [email]
    );
    if (rows.length > 0) {
      await connection.end();
      return { table: "admins", id: rows[0].id };
    }

    // Try middle_admins table
    [rows] = await connection.execute(
      "SELECT id FROM middle_admins WHERE email = ? LIMIT 1",
      [email]
    );
    if (rows.length > 0) {
      await connection.end();
      return { table: "middle_admins", id: rows[0].id };
    }

    // Try officers table
    [rows] = await connection.execute(
      "SELECT employee_id FROM officers WHERE email = ? LIMIT 1",
      [email]
    );
    if (rows.length > 0) {
      await connection.end();
      return { table: "officers", id: rows[0].employee_id };
    }

    await connection.end();
    return { table: "unauthenticated", id: null };
  } catch (err) {
    console.error("Error finding performer by email:", err);
    return { table: "unauthenticated", id: null };
  }
}

/**
 * Log deletion to audit_logs table
 * 
 * @param {Object} req - Express request object with req.user set by authMiddleware
 * @param {Object} deletedRow - The deleted record data (must have email, employee_id, or id)
 * @param {String} deletedFromTable - Table name where deletion occurred (e.g., "middle_admins", "officers")
 * @param {String} performerTable - Table where performer belongs (e.g., "admins", "middle_admins", "officers")
 */
async function logDeletion(req, deletedRow, deletedFromTable, performerTable) {
  try {
    // Get performer email from req.user (set by authMiddleware from JWT token)
    const performerEmail = req.user?.email || "unauthenticated";
    
    // Look up performer ID by email
    let performerEmployeeId = null;
    if (performerEmail !== "unauthenticated") {
      const performerInfo = await findPerformerByEmail(performerEmail);
      performerEmployeeId = performerInfo.id;
    }

    // Extract deleted record info
    const deletedEmail = deletedRow.email || "unknown";
    const deletedEmployeeId = deletedRow.employee_id || null;

    // no console output to avoid leaking sensitive data

    // Insert into audit_logs table
    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      `INSERT INTO audit_logs 
       (action, performed_by_email, performed_by_employee_id, deleted_email, deleted_employee_id, performed_by_table, deleted_from_table)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "DELETE", // action - NOT NULL
        performerEmail || "unauthenticated", // performed_by_email - NOT NULL
        performerEmployeeId ?? null, // performed_by_employee_id - nullable
        deletedEmail || "unknown", // deleted_email - NOT NULL
        deletedEmployeeId ?? null, // deleted_employee_id - nullable
        performerTable || "unauthenticated", // performed_by_table - NOT NULL
        deletedFromTable || "unknown", // deleted_from_table - NOT NULL
      ]
    );

    await connection.end();

    // audit log inserted (no terminal output)
  } catch (err) {
    console.error("❌ Audit logging error:", err.message || err);
  }
}

module.exports = { logDeletion, guessPerformerFromReq, findPerformerByEmail };
