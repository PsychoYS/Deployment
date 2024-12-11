const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatController');

console.log('Chat routes loaded');

// Handle POST request to root path
router.post('/', handleChatMessage);

module.exports = router; 