const feedbackService = require('../services/feedbackService');

const feedbackController = {
    createFeedback: async (req, res) => {
        try {
            const { subject, message, rating } = req.body;
            const feedback = await feedbackService.createFeedback(
                req.user._id,
                subject,
                message,
                rating
            );
            res.status(201).json({ success: true, feedback });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAllFeedback: async (req, res) => {
        try {
            const feedback = await feedbackService.getAllFeedback();
            res.json(feedback);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUserFeedback: async (req, res) => {
        try {
            const feedback = await feedbackService.getUserFeedback(req.user._id);
            res.json(feedback);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateFeedbackStatus: async (req, res) => {
        try {
            const feedback = await feedbackService.updateFeedbackStatus(
                req.params.id,
                req.body.status
            );
            res.json({ success: true, feedback });
        } catch (error) {
            const status = error.message === 'Feedback not found' ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
};

module.exports = feedbackController; 