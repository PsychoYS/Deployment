const accountService = require('../services/accountService');

const getAccountOverview = async (req, res) => {
    try {
        const accountDetails = await accountService.getAccountOverview(req.user);
        console.log('Sending account details:', accountDetails);
        res.status(200).json(accountDetails);
    } catch (err) {
        console.error('Error in getAccountOverview:', err);
        res.status(500).json({ message: err.message || 'Error fetching account overview.' });
    }
};

const requestAccountClosure = async (req, res) => {
    try {
        const result = await accountService.requestAccountClosure(req.user, req.body.reason);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in requestAccountClosure:', error);
        res.status(500).json({ message: error.message || 'Error submitting closure request' });
    }
};

const fetchClosureRequests = async (req, res) => {
    try {
        const result = await accountService.fetchClosureRequests(req.query.email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching closure requests:', error);
        res.status(500).json({ message: error.message || 'Error fetching closure requests.' });
    }
};

const approveAccountClosure = async (req, res) => {
    try {
        const { username, isApproved, email } = req.body;
        const result = await accountService.approveAccountClosure(username, isApproved, email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error handling approval:', error);
        res.status(500).json({ message: error.message || 'Error handling approval.' });
    }
};

const getAllClosureRequests = async (req, res) => {
    try {
        const closureRequests = await accountService.getAllClosureRequests();
        res.status(200).json(closureRequests);
    } catch (error) {
        console.error('Error fetching closure requests:', error);
        res.status(500).json({ message: error.message || 'Error fetching closure requests' });
    }
};

const processClosureRequest = async (req, res) => {
    try {
        const { username, isApproved } = req.body;
        const result = await accountService.processClosureRequest(username, isApproved);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error processing closure request:', error);
        res.status(500).json({ message: error.message || 'Error processing closure request' });
    }
};

module.exports = {
    requestAccountClosure,
    fetchClosureRequests,
    approveAccountClosure,
    getAllClosureRequests,
    processClosureRequest,
    getAccountOverview
};
