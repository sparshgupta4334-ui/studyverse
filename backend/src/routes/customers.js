const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');
const { customerValidators } = require('../utils/validators');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route  GET /api/customers/stats
 * @desc   Get dashboard stats
 * @access Private
 */
router.get('/stats', customerController.getDashboardStats);

/**
 * @route  GET /api/customers
 * @desc   Get all customers for the user
 * @access Private
 */
router.get('/', customerValidators.search, customerController.getAll);

/**
 * @route  POST /api/customers
 * @desc   Create a new customer
 * @access Private
 */
router.post('/', customerValidators.create, customerController.create);

/**
 * @route  GET /api/customers/:id
 * @desc   Get customer by ID
 * @access Private
 */
router.get('/:id', customerValidators.getById, customerController.getById);

/**
 * @route  PUT /api/customers/:id
 * @desc   Update a customer
 * @access Private
 */
router.put('/:id', customerValidators.update, customerController.update);

/**
 * @route  DELETE /api/customers/:id
 * @desc   Delete a customer
 * @access Private
 */
router.delete('/:id', customerValidators.getById, customerController.remove);

module.exports = router;
