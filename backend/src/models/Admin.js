/**
 * Admin model untuk Invest Bot
 * Menggunakan MySQL2 langsung tanpa Sequelize
 */

const mysql = require('mysql2/promise');
const config = require('../config');

class Admin {
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

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const connection = await this.getConnection();
      
      const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const [activeUserCount] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE is_active = true');
      const [packageCount] = await connection.execute('SELECT COUNT(*) as count FROM packages');
      const [transactionCount] = await connection.execute('SELECT COUNT(*) as count FROM transactions');
      
      connection.release();
      
      return {
        total_users: userCount[0].count,
        active_users: activeUserCount[0].count,
        total_packages: packageCount[0].count,
        total_transactions: transactionCount[0].count
      };
      
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      const connection = await this.getConnection();
      
      const [activities] = await connection.execute(
        `SELECT 'user' as type, id, first_name, last_name, created_at, 'User registered' as description
         FROM users 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         UNION ALL
         SELECT 'transaction' as type, id, NULL, NULL, created_at, CONCAT('Transaction #', id, ' created') as description
         FROM transactions 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         ORDER BY created_at DESC 
         LIMIT ?`,
        [limit]
      );
      
      connection.release();
      return activities;
      
    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      throw error;
    }
  }

  // Close pool
  async close() {
    await this.pool.end();
  }
}

module.exports = Admin;
