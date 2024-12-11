const User = require('../models/User');
const Dispute = require('../models/Dispute');

class DisputeService {
    async createDispute(userId, description) {
        const dispute = await Dispute.create({
            userId,
            description,
            status: 'Pending'
        });
        return dispute;
    }

    async getDisputes(userId) {
        const disputes = await Dispute.find({ userId })
            .sort({ createdAt: -1 });
        return disputes;
    }

    async getAllDisputes(user) {
        if (!user.isAdmin) {
            throw new Error('Not authorized');
        }

        const disputes = await Dispute.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        return disputes;
    }

    async updateDisputeStatus(user, disputeId, status) {
        if (!user.isAdmin) {
            throw new Error('Not authorized');
        }

        const dispute = await Dispute.findByIdAndUpdate(
            disputeId,
            { status },
            { new: true }
        );

        if (!dispute) {
            throw new Error('Dispute not found');
        }

        return dispute;
    }
}

module.exports = new DisputeService(); 