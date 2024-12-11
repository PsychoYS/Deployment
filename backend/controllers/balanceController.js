const accountService = require('../services/accountService');

const getBalanceInsights = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const insights = await accountService.getBalanceInsights(token);
        res.status(200).json(insights);
    } catch (err) {
        console.error('Error fetching balance insights:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (err.message === 'No token provided') {
            return res.status(401).json({ message: err.message });
        }
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const getBalance = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const balanceInfo = await accountService.getBalance(token);
        res.status(200).json(balanceInfo);
    } catch (err) {
        console.error('Error fetching balance:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (err.message === 'No token provided') {
            return res.status(401).json({ message: err.message });
        }
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getBalance, getBalanceInsights };

