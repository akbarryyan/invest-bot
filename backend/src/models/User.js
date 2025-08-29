/**
 * User model untuk Invest Bot
 * Menggunakan MySQL2 langsung tanpa Sequelize
 */

const mysql = require('mysql2/promise');
const config = require('../config');

class User {
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

  // Find all users with pagination
  async findAll(options = {}) {
    const { page = 1, limit = 10, search, is_active } = options;
    const offset = (page - 1) * limit;
    
    try {
      const connection = await this.getConnection();
      
      let whereClause = 'WHERE 1=1';
      const params = [];
      
      if (search) {
        whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR telegram_id LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      
      if (is_active !== undefined) {
        whereClause += ' AND is_active = ?';
        params.push(is_active);
      }
      
      // Get total count
      const [countRows] = await connection.execute(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
        params
      );
      const total = countRows[0].total;
      
      // Get users with pagination
      const [users] = await connection.execute(
        `SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      );
      
      console.log('Database query result:', { users, total, page, limit, offset });
      
      connection.release();
      
      return {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / limit)
        }
      };
      
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  // Find user by Telegram ID
  async findByTelegramId(telegramId) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE telegram_id = ?',
        [telegramId]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByTelegramId:', error);
      throw error;
    }
  }

  // Find user by referral code
  async findByReferralCode(referralCode) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE referral_code = ?',
        [referralCode]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByReferralCode:', error);
      throw error;
    }
  }

  // Create new user
  async create(userData) {
    try {
      const connection = await this.getConnection();
      
      // Generate referral code if not provided
      if (!userData.referral_code) {
        userData.referral_code = this.generateReferralCode();
      }
      
      const [result] = await connection.execute(
        `INSERT INTO users (
          telegram_id, username, first_name, last_name, phone, email,
          balance, total_profit, referral_code, referred_by, referral_bonus,
          is_active, last_activity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.telegram_id,
          userData.username || null,
          userData.first_name,
          userData.last_name || null,
          userData.phone || null,
          userData.email || null,
          userData.balance || 0,
          userData.total_profit || 0,
          userData.referral_code,
          userData.referred_by || null,
          userData.referral_bonus || 0,
          userData.is_active !== undefined ? userData.is_active : true,
          new Date()
        ]
      );
      
      connection.release();
      
      // Return created user
      return await this.findById(result.insertId);
      
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  // Update user
  async update(id, updateData) {
    try {
      const connection = await this.getConnection();
      
      const fields = [];
      const values = [];
      
      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      if (fields.length === 0) {
        connection.release();
        return await this.findById(id);
      }
      
      values.push(id);
      
      await connection.execute(
        `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );
      
      connection.release();
      
      // Return updated user
      return await this.findById(id);
      
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  // Delete user (soft delete)
  async delete(id) {
    try {
      const connection = await this.getConnection();
      
      await connection.execute(
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?',
        [id]
      );
      
      connection.release();
      
      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  // Get user statistics
  async getStats() {
    try {
      const connection = await this.getConnection();
      
      const [totalUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const [activeUsers] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE is_active = true');
      // Note: is_admin column doesn't exist in current schema
      const adminUsers = [{ count: 0 }]; // Default to 0 for now
      const [newUsersToday] = await connection.execute(
        'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()'
      );
      const [balanceResult] = await connection.execute('SELECT SUM(balance) as total FROM users WHERE is_active = true');
      
      connection.release();
      
      return {
        total_users: totalUsers[0].count,
        active_users: activeUsers[0].count,
        admin_users: adminUsers[0].count,
        new_today: newUsersToday[0].count,
        total_balance: parseFloat(balanceResult[0].total || 0),
        inactive_users: totalUsers[0].count - activeUsers[0].count
      };
      
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }

  // Generate referral code
  generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Close pool
  async close() {
    await this.pool.end();
  }
}

module.exports = User;
