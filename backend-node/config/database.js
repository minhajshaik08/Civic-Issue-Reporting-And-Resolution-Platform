// Database Configuration
// This is a centralized configuration file for database connections
// All backend files should import this file instead of defining dbConfig locally

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Chandana@1435",
  database: process.env.DB_NAME || "civicreport",
};

module.exports = dbConfig;
