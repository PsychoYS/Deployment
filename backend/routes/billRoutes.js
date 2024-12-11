const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to protect these routes
router.use(protect);

// Routes
router.get('/pending', billController.fetchPendingBills);
router.post('/pay', billController.payBill);

module.exports = router;
