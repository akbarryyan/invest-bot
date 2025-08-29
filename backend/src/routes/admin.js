/**
 * Admin routes untuk Invest Bot
 */

const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Package = require('../models/Package');
const Admin = require('../models/Admin');

const router = express.Router();
const userModel = new User();
const packageModel = new Package();
const adminModel = new Admin();

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Get dashboard statistics using Admin model
    const dashboardStats = await adminModel.getDashboardStats();
    
    // Get recent activities
    const recentActivities = await adminModel.getRecentActivity(10);

    // Mock transaction statistics (since we don't have Transaction model yet)
    const mockTransactionStats = {
      total_transactions: 150,
      total_investments: 50000000,
      total_claims: 2500000,
      total_referrals: 1000000,
      pending_transactions: 5,
      completed_transactions: 140,
      failed_transactions: 5,
      today_transactions: 12,
      this_week_transactions: 45,
      this_month_transactions: 180
    };

    // Combine dashboard stats with recent activities
    const finalDashboardStats = {
      ...dashboardStats,
      transactions: mockTransactionStats,
      recent_activities: recentActivities
    };

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      data: finalDashboardStats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve dashboard statistics'
    });
  }
});

/**
 * GET /api/admin/users
 * Get admin user management data
 */
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional(),
  query('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),
  query('is_admin').optional().isBoolean().withMessage('Is admin must be a boolean')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10, search, is_active, is_admin } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { first_name: { [require('sequelize').Op.like]: `%${search}%` } },
        { last_name: { [require('sequelize').Op.like]: `%${search}%` } },
        { username: { [require('sequelize').Op.like]: `%${search}%` } },
        { email: { [require('sequelize').Op.like]: `%${search}%` } },
        { telegram_id: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    if (is_active !== undefined) {
      whereClause.is_active = is_active;
    }

    if (is_admin !== undefined) {
      whereClause.is_admin = is_admin;
    }

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      message: 'Admin users data retrieved successfully',
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve admin users data'
    });
  }
});

/**
 * GET /api/admin/packages
 * Get admin package management data
 */
router.get('/packages', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional(),
  query('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10, search, is_active } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    if (is_active !== undefined) {
      whereClause.is_active = is_active;
    }

    // Get packages with pagination
    const { count, rows: packages } = await Package.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      message: 'Admin packages data retrieved successfully',
      data: packages,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get admin packages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve admin packages data'
    });
  }
});

/**
 * GET /api/admin/analytics
 * Get admin analytics data
 */
router.get('/analytics', [
  query('period').optional().isIn(['today', 'week', 'month', 'year']).withMessage('Invalid period')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { period = 'month' } = req.query;

    // Mock analytics data based on period
    const mockAnalytics = {
      period: period,
      user_growth: {
        total: 1250,
        growth_percentage: 15.5,
        new_users: 45
      },
      investment_trends: {
        total_invested: 75000000,
        growth_percentage: 8.2,
        average_investment: 60000
      },
      revenue_analysis: {
        total_revenue: 12500000,
        growth_percentage: 12.8,
        profit_margin: 65.5
      },
      top_packages: [
        { name: 'Gold Package', sales: 45, revenue: 45000000 },
        { name: 'Silver Package', sales: 38, revenue: 19000000 },
        { name: 'Bronze Package', sales: 52, revenue: 10400000 }
      ],
      user_engagement: {
        active_users: 890,
        engagement_rate: 78.5,
        average_session: 12.5
      }
    };

    res.json({
      message: 'Analytics data retrieved successfully',
      data: mockAnalytics
    });

  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve analytics data'
    });
  }
});

/**
 * GET /api/admin/system
 * Get system information and status
 */
router.get('/system', async (req, res) => {
  try {
    // Mock system information
    const systemInfo = {
      server: {
        status: 'running',
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        cpu_usage: process.cpuUsage(),
        node_version: process.version,
        platform: process.platform
      },
      database: {
        status: 'connected',
        connection_pool: {
          max: 10,
          min: 0,
          idle: 2,
          acquire: 1
        }
      },
      bot: {
        status: 'running',
        last_activity: new Date().toISOString(),
        total_users: 1250,
        active_chats: 45
      },
      api: {
        status: 'running',
        total_requests: 15420,
        requests_per_minute: 12,
        average_response_time: 45
      }
    };

    res.json({
      message: 'System information retrieved successfully',
      data: systemInfo
    });

  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve system information'
    });
  }
});

module.exports = router;
