const scheduledTransferService = require('../services/scheduledTransferService');

const createScheduledTransfer = async (req, res) => {
    try {
        const { recipientAccount, amount, frequency, startDate, description } = req.body;
        const result = await scheduledTransferService.createScheduledTransfer(
            req.user.id,
            { recipientAccount, amount, frequency, startDate, description }
        );
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating scheduled transfer:', error);
        res.status(400).json({ message: error.message });
    }
};

const getScheduledTransfers = async (req, res) => {
    try {
        const transfers = await scheduledTransferService.getScheduledTransfers(req.user.id);
        res.status(200).json(transfers);
    } catch (error) {
        console.error('Error fetching scheduled transfers:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateScheduledTransfer = async (req, res) => {
    try {
        const { transferId } = req.params;
        const result = await scheduledTransferService.updateScheduledTransfer(
            req.user.id,
            transferId,
            req.body
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating scheduled transfer:', error);
        res.status(400).json({ message: error.message });
    }
};

const getTransferHistory = async (req, res) => {
    try {
        const { transferId } = req.params;
        const history = await scheduledTransferService.getTransferHistory(
            req.user.id,
            transferId
        );
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createScheduledTransfer,
    getScheduledTransfers,
    updateScheduledTransfer,
    getTransferHistory
}; 