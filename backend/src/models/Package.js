/**
 * Package model untuk Invest Bot
 * Menggunakan MySQL2 langsung tanpa Sequelize
 */

const mysql = require('mysql2/promise');
const config = require('../config');

class Package {
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

  // Find all packages
  async findAll(options = {}) {
    try {
      const connection = await this.getConnection();
      
      let whereClause = 'WHERE 1=1';
      const params = [];
      
      if (options.is_active !== undefined) {
        whereClause += ' AND is_active = ?';
        params.push(options.is_active);
      }
      
      const [packages] = await connection.execute(
        `SELECT * FROM packages ${whereClause} ORDER BY price ASC`,
        params
      );
      
      connection.release();
      return packages;
      
    } catch (error) {
      console.error('Error in findAll packages:', error);
      throw error;
    }
  }

  // Find package by ID
  async findById(id) {
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM packages WHERE id = ?',
        [id]
      );
      connection.release();
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findById package:', error);
      throw error;
    }
  }

  // Find active packages
  async findActive() {
    return await this.findAll({ is_active: true });
  }

  // Find available packages
  async findAvailable() {
    try {
      const connection = await this.getConnection();
      const [packages] = await connection.execute(
        `SELECT * FROM packages 
         WHERE is_active = true 
         AND (max_purchases IS NULL OR current_purchases < max_purchases)
         ORDER BY price ASC`
      );
      connection.release();
      
      return packages;
    } catch (error) {
      console.error('Error in findAvailable packages:', error);
      throw error;
    }
  }

  // Create new package
  async create(packageData) {
    try {
      const connection = await this.getConnection();
      
      const [result] = await connection.execute(
        `INSERT INTO packages (
          name, description, price, duration_days, daily_return_amount, image_url, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          packageData.name,
          packageData.description || null,
          packageData.price,
          packageData.duration_days,
          packageData.daily_return,
          packageData.image_url || null,
          packageData.is_active !== undefined ? packageData.is_active : true
        ]
      );
      
      connection.release();
      
      // Return created package
      return await this.findById(result.insertId);
      
    } catch (error) {
      console.error('Error in create package:', error);
      throw error;
    }
  }

  // Update package
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
        `UPDATE packages SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );
      
      connection.release();
      
      // Return updated package
      return await this.findById(id);
      
    } catch (error) {
      console.error('Error in update package:', error);
      throw error;
    }
  }

  // Delete package (hard delete)
  async delete(id) {
    try {
      const connection = await this.getConnection();
      
      await connection.execute(
        'DELETE FROM packages WHERE id = ?',
        [id]
      );
      
      connection.release();
      
      return true;
    } catch (error) {
      console.error('Error in delete package:', error);
      throw error;
    }
  }

  // Check if package is available
  isAvailable(pkg) {
    return pkg.is_active && 
           (pkg.max_purchases === null || pkg.current_purchases < pkg.max_purchases);
  }

  // Calculate daily return
  calculateDailyReturn(pkg, investmentAmount) {
    return (investmentAmount * pkg.daily_return_percentage) / 100;
  }

  // Calculate total return
  calculateTotalReturn(pkg, investmentAmount) {
    return (investmentAmount * pkg.total_return_percentage) / 100;
  }

  // Close pool
  async close() {
    await this.pool.end();
  }
}

module.exports = Package;
