const messageService = require('../services/messageService');

const getUserMessages = async (req, res) => {
    try {
        const messages = await messageService.getUserMessages(req.user._id);
        res.json(messages);
    } catch (error) {
        console.error('Error in getUserMessages:', error);
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await messageService.markMessageAsRead(req.user._id, messageId);
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserMessages,
    markAsRead
}; 