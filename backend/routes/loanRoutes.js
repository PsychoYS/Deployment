const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const loanController = require('../controllers/loanController');

// Apply for a new loan
router.post('/apply-loan', protect, loanController.applyForLoan);

// Get loan details for a user
router.get('/details', protect, loanController.getLoanDetails);

// Get all loans (admin only)
router.get('/all', protect, loanController.getAllLoans);

module.exports = router;
