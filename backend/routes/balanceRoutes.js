const express = require('express');
const router = express.Router();
const { getBalance, getBalanceInsights } = require('../controllers/balanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/balance', protect, getBalance);
router.get('/insights', protect, getBalanceInsights);

module.exports = router;
