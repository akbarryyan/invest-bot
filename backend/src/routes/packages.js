/**
 * Packages routes untuk Invest Bot
 */

const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Package = require('../models/Package');

const router = express.Router();
const packageModel = new Package();

// Validation middleware
const validateCreatePackage = [
  body('name').notEmpty().withMessage('Package name is required'),
  body('description').optional(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration_days').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('daily_return_percentage').isFloat({ min: 0, max: 100 }).withMessage('Daily return must be between 0 and 100'),
  body('daily_return_amount').isFloat({ min: 0 }).withMessage('Daily return amount must be a positive number'),
  body('total_return_percentage').isFloat({ min: 0, max: 1000 }).withMessage('Total return must be between 0 and 1000'),
  body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  body('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),
  body('max_purchases').optional().isInt({ min: 1 }).withMessage('Max purchases must be a positive integer')
];

const validateUpdatePackage = [
  body('name').optional().notEmpty().withMessage('Package name cannot be empty'),
  body('description').optional(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration_days').optional().isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('daily_return_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Daily return must be between 0 and 100'),
  body('daily_return_amount').optional().isFloat({ min: 0 }).withMessage('Daily return amount must be a positive number'),
  body('total_return_percentage').optional().isFloat({ min: 0, max: 1000 }).withMessage('Total return must be between 0 and 1000'),
  body('image_url').optional().isURL().withMessage('Image URL must be a valid URL'),
  body('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),
  body('max_purchases').optional().isInt({ min: 1 }).withMessage('Max purchases must be a positive integer')
];

/**
 * GET /api/packages
 * Get all packages with pagination and filtering
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional(),
  query('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),
  query('min_price').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('max_price').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('min_duration').optional().isInt({ min: 1 }).withMessage('Min duration must be at least 1 day'),
  query('max_duration').optional().isInt({ min: 1 }).withMessage('Max duration must be at least 1 day')
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

    const { 
      page = 1, 
      limit = 10, 
      search, 
      is_active, 
      min_price, 
      max_price, 
      min_duration, 
      max_duration 
    } = req.query;
    
    const offset = (page - 1) * limit;

    // Build search and filter options
    const options = {
      // Default to active packages only if no is_active filter specified
      is_active: is_active !== undefined ? is_active === 'true' : true
    };

    // Get packages with pagination
    const packages = await packageModel.findAll(options);
    
    // Simple pagination for now
    const totalItems = packages.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPackages = packages.slice(startIndex, endIndex);
    
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      message: 'Packages retrieved successfully',
      data: paginatedPackages,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalItems,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve packages'
    });
  }
});

/**
 * GET /api/packages/active
 * Get all active packages
 */
router.get('/active', async (req, res) => {
  try {
    const packages = await packageModel.findActive();

    res.json({
      message: 'Active packages retrieved successfully',
      data: packages
    });

  } catch (error) {
    console.error('Get active packages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve active packages'
    });
  }
});

/**
 * GET /api/packages/available
 * Get all available packages (active and not sold out)
 */
router.get('/available', async (req, res) => {
  try {
    const packages = await packageModel.findAvailable();

    res.json({
      message: 'Available packages retrieved successfully',
      data: packages
    });

  } catch (error) {
    console.error('Get available packages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve available packages'
    });
  }
});

/**
 * GET /api/packages/:id
 * Get package by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const package = await packageModel.findById(id);
    
    if (!package) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Package not found'
      });
    }

    res.json({
      message: 'Package retrieved successfully',
      data: package
    });

  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve package'
    });
  }
});

/**
 * POST /api/packages
 * Create new package
 */
router.post('/', validateCreatePackage, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const packageData = req.body;

    // Create package
    const package = await packageModel.create(packageData);

    res.status(201).json({
      message: 'Package created successfully',
      data: package
    });

  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create package'
    });
  }
});

/**
 * PUT /api/packages/:id
 * Update package
 */
router.put('/:id', validateUpdatePackage, async (req, res) => {
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

    // Find package
    const package = await packageModel.findById(id);
    
    if (!package) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Package not found'
      });
    }

    // Update package
    const updatedPackage = await packageModel.update(id, updateData);

    res.json({
      message: 'Package updated successfully',
      data: updatedPackage
    });

  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update package'
    });
  }
});

/**
 * DELETE /api/packages/:id
 * Delete package (hard delete from database)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find package
    const package = await packageModel.findById(id);
    
    if (!package) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Package not found'
      });
    }

    // Hard delete package from database
    await packageModel.delete(id);

    res.json({
      message: 'Package deleted successfully',
      data: { id: package.id, deleted: true }
    });

  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete package'
    });
  }
});

/**
 * POST /api/packages/:id/toggle
 * Toggle package active status
 */
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // Find package
    const package = await packageModel.findById(id);
    
    if (!package) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Package not found'
      });
    }

    // Toggle active status
    const newStatus = !package.is_active;
    await packageModel.update(id, { is_active: newStatus });

    res.json({
      message: `Package ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: { id: package.id, is_active: newStatus }
    });

  } catch (error) {
    console.error('Toggle package status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to toggle package status'
    });
  }
});

module.exports = router;
