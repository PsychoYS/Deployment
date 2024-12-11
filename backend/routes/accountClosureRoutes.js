const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Import the closure controller
const closureController = require('../controllers/closureController');

// User routes
router.post('/request', protect, closureController.requestClosure);
router.get('/status', protect, closureController.getClosureStatus);

// Admin routes
router.get('/all', protect, adminOnly, closureController.getAllRequests);
router.post('/process', protect, adminOnly, closureController.processRequest);

module.exports = router;
