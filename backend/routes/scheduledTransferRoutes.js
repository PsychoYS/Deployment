const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createScheduledTransfer,
    getScheduledTransfers,
    updateScheduledTransfer,
    getTransferHistory
} = require('../controllers/scheduledTransferController');

router.use(protect);

router.post('/create', createScheduledTransfer);
router.get('/list', getScheduledTransfers);
router.put('/update/:transferId', updateScheduledTransfer);
router.get('/history/:transferId', getTransferHistory);

module.exports = router; 