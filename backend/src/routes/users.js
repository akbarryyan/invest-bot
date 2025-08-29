/**
 * Users routes untuk Invest Bot
 */

const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');

const router = express.Router();
const userModel = new User();

// Validation middleware
const validateCreateUser = [
  body('telegram_id').isInt({ min: 1 }).withMessage('Telegram ID must be a positive integer'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('username').optional(),
  body('last_name').optional(),
  body('phone').optional(),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('balance').optional().isFloat({ min: 0 }).withMessage('Balance must be a positive number'),
  body('referral_code').optional(),
  body('referred_by').optional().isString().withMessage('Referred by must be a string'),
  body('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
];

const validateUpdateUser = [
  body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
  body('username').optional(),
  body('last_name').optional(),
  body('phone').optional(),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('balance').optional().isFloat({ min: 0 }).withMessage('Balance must be a positive number'),
  body('is_active').optional().isBoolean().withMessage('Is active must be a boolean')
];

/**
 * GET /api/users
 * Get all users with pagination and filtering
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional(),
  query('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),

], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { page = 1, limit = 10, search, is_active } = req.query;
    const offset = (page - 1) * limit;

    // Build search and filter options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      is_active: is_active !== undefined ? is_active === 'true' : undefined
    };

    // Get users with pagination
    const result = await userModel.findAll(options);
    
    console.log('Route result:', result);
    console.log('Sending response:', {
      message: 'Users retrieved successfully',
      data: result.users || [],
      pagination: result.pagination
    });

    res.json({
      message: 'Users retrieved successfully',
      data: result.users || [],
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get users error:', error);
    
    // Check if it's a database connection error
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeHostNotFoundError') {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Database connection failed. Please try again later.'
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/users/stats
 * Get user statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Get user statistics
    const userStats = await userModel.getStats();

    res.json({
      message: 'User statistics retrieved successfully',
      data: userStats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user'
    });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post('/', validateCreateUser, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const userData = req.body;
    console.log('Creating user with data:', userData);

    // Check if telegram_id already exists
    const existingUser = await userModel.findByTelegramId(userData.telegram_id);

    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User with this Telegram ID already exists'
      });
    }

    // Create user
    const user = await userModel.create(userData);

    res.status(201).json({
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user'
    });
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', validateUpdateUser, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Find user
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Update user
    const updatedUser = await userModel.update(id, updateData);

    res.json({
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user'
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (soft delete by setting is_active to false)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Soft delete by setting is_active to false
    await userModel.delete(id);

    res.json({
      message: 'User deleted successfully',
      data: { id: user.id, is_active: false }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user'
    });
  }
});

/**
 * GET /api/users/telegram/:telegramId
 * Get user by Telegram ID
 */
router.get('/telegram/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findByTelegramId(telegramId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Get user by Telegram ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user'
    });
  }
});

/**
 * GET /api/users/referral/:referralCode
 * Get user by referral code
 */
router.get('/referral/:referralCode', async (req, res) => {
  try {
    const { referralCode } = req.params;

    const user = await User.findByReferralCode(referralCode);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      message: 'User retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Get user by referral code error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user'
    });
  }
});





module.exports = router;
