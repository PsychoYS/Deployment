const chatService = require('../services/chatService');

const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const response = await chatService.processMessage(message);
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Error processing chat message' });
    }
};

module.exports = {
    handleChatMessage
}; 