const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');
const { transactionValidators } = require('../utils/validators');

router.use(authMiddleware);

/**
 * @route  GET /api/transactions/report
 * @desc   Get transaction report summary
 * @access Private
 */
router.get('/report', transactionController.getReport);

/**
 * @route  GET /api/transactions/customer/:customerId
 * @desc   Get all transactions for a customer
 * @access Private
 */
router.get('/customer/:customerId', transactionValidators.getByCustomer, transactionController.getByCustomer);

/**
 * @route  POST /api/transactions
 * @desc   Create a new transaction
 * @access Private
 */
router.post('/', transactionValidators.create, transactionController.create);

/**
 * @route  GET /api/transactions/:id
 * @desc   Get transaction by ID
 * @access Private
 */
router.get('/:id', transactionController.getById);

/**
 * @route  DELETE /api/transactions/:id
 * @desc   Delete (soft) a transaction
 * @access Private
 */
router.delete('/:id', transactionController.remove);

module.exports = router;
