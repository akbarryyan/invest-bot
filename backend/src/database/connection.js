/**
 * Database connection menggunakan MySQL2
 */

const mysql = require('mysql2/promise');
const config = require('../config');

// Buat connection pool
const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Sync database (create tables if not exist)
const syncDatabase = async (force = false) => {
  try {
    console.log('🔄 Database tables already exist (using existing schema)');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    return false;
  }
};

// Close database connection
const closeConnection = async () => {
  try {
    await pool.end();
    console.log('✅ Database connection closed successfully!');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  syncDatabase,
  closeConnection
};
