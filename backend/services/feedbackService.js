const Feedback = require('../models/Feedback');

class FeedbackService {
    async createFeedback(userId, subject, message, rating) {
        const feedback = new Feedback({
            userId,
            subject,
            message,
            rating
        });
        await feedback.save();
        return feedback;
    }

    async getAllFeedback() {
        const feedback = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        return feedback;
    }

    async getUserFeedback(userId) {
        const feedback = await Feedback.find({ userId })
            .sort({ createdAt: -1 });
        return feedback;
    }

    async updateFeedbackStatus(feedbackId, status) {
        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { status },
            { new: true }
        );
        
        if (!feedback) {
            throw new Error('Feedback not found');
        }

        return feedback;
    }
}

module.exports = new FeedbackService(); 