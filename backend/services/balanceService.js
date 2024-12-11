const jwt = require('jsonwebtoken');
const User = require('../models/User');

class BalanceService {
    // Helper function to calculate total transactions
    calculateTotalTransactions(transactions) {
        if (!transactions || transactions.length === 0) {
            console.log('No transactions found');
            return 0;
        }

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter transactions for current month and sum their amounts
        return transactions.reduce((total, transaction) => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear) {
                return total + (transaction.amount || 0);
            }
            return total;
        }, 0);
    }

    async getUserFromToken(token) {
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)
            .populate('transactionHistory');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async getBalanceInsights(token) {
        const user = await this.getUserFromToken(token);

        // Calculate monthly spending
        const monthlySpent = this.calculateTotalTransactions(user.transactionHistory);

        // Calculate remaining budget (current balance)
        const remaining = user.balance;

        // Calculate balance change percentage
        const balanceChange = (monthlySpent / (remaining + monthlySpent)) * 100;

        return {
            spent: monthlySpent.toFixed(2),
            remaining: remaining.toFixed(2),
            balanceChange: balanceChange.toFixed(5)
        };
    }

    async getBalance(token) {
        const user = await this.getUserFromToken(token);
        return {
            balance: user.balance
        };
    }
}

module.exports = new BalanceService(); 