const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAccountOverview } = require('../controllers/accountController');

// Route to get account overview
router.get('/overview', protect, getAccountOverview);

module.exports = router;
