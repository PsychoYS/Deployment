const User = require('../models/User'); // Ensure user schema is imported
const jwt = require('jsonwebtoken');

const applyForLoan = async (req, res) => {
    try {
        console.log('Incoming request body:', req.body);
        const { loanAmount, interestRate, termInMonths } = req.body;

        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check for missing fields
        if (!loanAmount || !interestRate || !termInMonths) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found for ID:', userId);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Initialize loanDetails array if it doesn't exist
        if (!user.loanDetails) {
            user.loanDetails = [];
        }

        // Create new loan object
        const newLoan = {
            loanAmount,
            interestRate,
            termInMonths,
            startDate: new Date(),
            outstandingBalance: loanAmount,
            repaymentSchedule: Array.from({ length: termInMonths }, (_, i) => ({
                date: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
                amount: (loanAmount * (1 + interestRate / 100)) / termInMonths,
            })),
        };

        // Add new loan to the array
        user.loanDetails.push(newLoan);
        console.log('Updated user loan details:', user.loanDetails);
        await user.save();

        res.status(200).json({
            message: 'Loan applied successfully.',
            loanDetails: user.loanDetails
        });
    } catch (error) {
        console.error('Error in applyForLoan route:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get loan details
const getLoanDetails = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Received token:', token ? 'Token exists' : 'No token');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded user ID:', decoded.id);

        const user = await User.findById(decoded.id);
        console.log('Found user:', user ? 'User exists' : 'User not found');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure loanDetails is always an array
        const loans = user.loanDetails || [];
        console.log('Number of loans found:', loans.length);

        return res.status(200).json(loans);
    } catch (error) {
        console.error('Error in getLoanDetails:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token',
                details: error.message 
            });
        }
        return res.status(500).json({ 
            message: 'Failed to retrieve loan details',
            details: error.message 
        });
    }
};

// Get all loans (admin only)
const getAllLoans = async (req, res) => {
    try {
        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if user is admin
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized. Admin access required.' });
        }

        // Get all users with loan details
        const usersWithLoans = await User.find({
            'loanDetails': { $exists: true, $ne: null }
        }).select('username email loanDetails');

        res.status(200).json(usersWithLoans);
    } catch (error) {
        console.error('Error getting all loans:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        res.status(500).json({ message: 'Failed to retrieve loans.' });
    }
};

module.exports = {
    applyForLoan,
    getLoanDetails,
    getAllLoans
};
