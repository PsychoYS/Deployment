const transferService = require('../services/transferService');

const internalTransfer = async (req, res) => {
    try {
        const { toAccount, amount, description, fromAccount } = req.body;
        const result = await transferService.internalTransfer(req.user.id, {
            toAccount,
            amount,
            description,
            fromAccount
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error during internal transfer:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const externalTransfer = async (req, res) => {
    try {
        const { toAccount, amount, description, fromAccount } = req.body;
        const result = await transferService.externalTransfer(req.user.id, {
            toAccount,
            amount,
            description,
            fromAccount
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error during external transfer:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const internationalTransfer = async (req, res) => {
    try {
        const { toAccount, amount, description, fromAccount } = req.body;
        const result = await transferService.internationalTransfer(req.user.id, {
            toAccount,
            amount,
            description,
            fromAccount
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error during international transfer:', error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    internalTransfer,
    externalTransfer,
    internationalTransfer
};
