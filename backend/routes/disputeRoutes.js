const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Import the dispute controller
const disputeController = require('../controllers/disputeController');

// User routes
router.post('/', protect, disputeController.createDispute);
router.get('/', protect, disputeController.getUserDisputes);

// Admin routes
router.get('/all', protect, adminOnly, disputeController.getAllDisputes);
router.patch('/:disputeId/status', protect, adminOnly, disputeController.updateDisputeStatus);

module.exports = router; 