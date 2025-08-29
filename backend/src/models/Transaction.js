/**
 * Transaction model untuk Invest Bot
 * Menggunakan MySQL2 langsung tanpa Sequelize
 */

const mysql = require('mysql2/promise');
const config = require('../config');

class Transaction {
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

  // Find all transactions
  async findAll(options = {}) {
    try {
      const connection = await this.getConnection();
      
      let whereClause = 'WHERE 1=1';
      const params = [];
      
      if (options.user_id) {
        whereClause += ' AND user_id = ?';
        params.push(options.user_id);
      }
      
      if (options.status) {
        whereClause += ' AND status = ?';
        params.push(options.status);
      }
      
      const [transactions] = await connection.execute(
        `SELECT * FROM transactions ${whereClause} ORDER BY created_at DESC`,
        params
      );
      
      connection.release();
      return transactions;
      
    } catch (error) {
      console.error('Error in findAll transactions:', error);
      throw error;
    }
  }

  // Find transaction by ID
  async findById(id) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM transactions WHERE id = ?',
        [id]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findById transaction:', error);
      throw error;
    }
  }

  // Create new transaction
  async create(transactionData) {
    try {
      const connection = await this.getConnection();
      
      const [result] = await connection.execute(
        `INSERT INTO transactions (
          user_id, package_id, amount, status, type, description
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transactionData.user_id,
          transactionData.package_id,
          transactionData.amount,
          transactionData.status || 'pending',
          transactionData.type,
          transactionData.description || null
        ]
      );
      
      connection.release();
      
      // Return created transaction
      return await this.findById(result.insertId);
      
    } catch (error) {
      console.error('Error in create transaction:', error);
      throw error;
    }
  }

  // Update transaction
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
        `UPDATE transactions SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );
      
      connection.release();
      
      // Return updated transaction
      return await this.findById(id);
      
    } catch (error) {
      console.error('Error in update transaction:', error);
      throw error;
    }
  }

  // Close pool
  async close() {
    await this.pool.end();
  }
}

module.exports = Transaction;
