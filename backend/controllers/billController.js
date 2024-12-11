const billService = require('../services/billService');

const fetchPendingBills = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await billService.fetchPendingBills(userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(error.message === 'User not found' ? 404 : 500)
           .json({ message: error.message || 'Error fetching bills' });
    }
};

const payBill = async (req, res) => {
    try {
        const { billId } = req.body;
        const userId = req.user.id;
        const result = await billService.payBill(userId, billId);
        res.json(result);
    } catch (error) {
        console.error('Error paying bill:', error);
        const status = 
            error.message === 'User not found' ? 404 :
            error.message === 'Bill not found or already paid' ? 404 :
            error.message === 'Insufficient balance to pay the bill' ? 400 : 500;
        res.status(status).json({ message: error.message || 'Error paying bill' });
    }
};

module.exports = { fetchPendingBills, payBill };
