const AccountClosure = require('../models/AccountClosure');
const User = require('../models/User');

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await AccountClosure.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.processRequest = async (req, res) => {
    try {
        const { username, isApproved } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const closure = await AccountClosure.findOneAndUpdate(
            { userId: user._id, status: 'pending' },
            { 
                status: isApproved ? 'approved' : 'rejected',
                processedAt: new Date()
            },
            { 
                new: true,
                runValidators: true
            }
        ).populate('userId', 'username email');

        if (!closure) {
            return res.status(404).json({ message: 'No pending closure request found for this user' });
        }

        if (isApproved) {
            await User.findByIdAndUpdate(user._id, { 
                isActive: false,
                deactivatedAt: new Date()
            });
        }

        res.json(closure);
    } catch (error) {
        console.error('Error processing closure request:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.requestClosure = async (req, res) => {
    try {
        const closure = new AccountClosure({
            userId: req.user._id,
            reason: req.body.reason
        });
        await closure.save();
        res.status(201).json(closure);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getClosureStatus = async (req, res) => {
    try {
        const closure = await AccountClosure.findOne({ userId: req.user._id });
        res.json(closure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 