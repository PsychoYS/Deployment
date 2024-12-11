const Dispute = require('../models/Dispute');

// Get all disputes (admin only)
exports.getAllDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.find().populate('userId', 'username email');
        res.json(disputes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update dispute status (admin only)
exports.updateDisputeStatus = async (req, res) => {
    try {
        const { disputeId } = req.params;
        const { status } = req.body;

        const dispute = await Dispute.findByIdAndUpdate(
            disputeId,
            { status },
            { new: true }
        ).populate('userId', 'username email');

        if (!dispute) {
            return res.status(404).json({ message: 'Dispute not found' });
        }

        res.json(dispute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new dispute
exports.createDispute = async (req, res) => {
    try {
        const dispute = new Dispute({
            userId: req.user._id,
            description: req.body.description,
            status: 'pending'
        });

        await dispute.save();
        res.status(201).json(dispute);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user disputes
exports.getUserDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.find({ userId: req.user._id });
        res.json(disputes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 