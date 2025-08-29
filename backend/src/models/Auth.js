/**
 * Auth model untuk Invest Bot
 * Menggunakan MySQL2 langsung tanpa Sequelize
 */

const mysql = require('mysql2/promise');
const config = require('../config');

class Auth {
  constructor() {
    this.pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  // Get connection from pool
  async getConnection() {
    return await this.pool.getConnection();
  }

  // Find user by credentials
  async findByCredentials(username, password) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE username = ? AND password = ? AND is_active = true',
        [username, password]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByCredentials:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ? AND is_active = true',
        [id]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findById auth:', error);
      throw error;
    }
  }

  // Close pool
  async close() {
    await this.pool.end();
  }
}

module.exports = Auth;
