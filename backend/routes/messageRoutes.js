const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserMessages, markAsRead } = require('../controllers/messageController');

router.use(protect);

router.get('/list', getUserMessages);
router.put('/read/:messageId', markAsRead);

module.exports = router; 