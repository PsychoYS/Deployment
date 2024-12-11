const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    internalTransfer,
    externalTransfer,
    internationalTransfer,
} = require('../controllers/transferController');

// Protect all transfer routes with authentication middleware
router.post('/internal', protect, internalTransfer);
router.post('/external', protect, externalTransfer);
router.post('/international', protect, internationalTransfer);

module.exports = router;
