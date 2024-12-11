const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const feedbackController = require('../controllers/feedbackController');

// User routes
router.post('/', protect, feedbackController.createFeedback);
router.get('/my-feedback', protect, feedbackController.getUserFeedback);

// Admin routes (protected by adminOnly middleware)
router.get('/all', protect, adminOnly, feedbackController.getAllFeedback);
router.patch('/:id', protect, adminOnly, feedbackController.updateFeedbackStatus);

// Error handling for this router
router.use((err, req, res, next) => {
    console.error('Feedback Route Error:', err);
    res.status(500).json({ success: false, message: 'Error processing feedback request' });
});

module.exports = router; 