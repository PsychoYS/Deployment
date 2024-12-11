const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

class AccountService {
    // Balance-related methods
    calculateTotalTransactions(transactions) {
        if (!transactions || transactions.length === 0) {
            console.log('No transactions found');
            return 0;
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

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
        const monthlySpent = this.calculateTotalTransactions(user.transactionHistory);
        const remaining = user.balance;
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

    // Original Account-related methods
    computeInterest(balance) {
        const interestRate = 0.05;
        return balance * interestRate;
    }

    async getAccountOverview(user) {
        if (!user) {
            throw new Error('User not found.');
        }

        const balance = user.balance || 0;
        const interest = this.computeInterest(balance);

        return {
            name: user.username,
            email: user.email,
            accountStatus: user.isClosed ? 'Closed' : 'Active',
            transactions: user.transactionHistory || [],
            balance: balance.toFixed(2),
            interest: interest.toFixed(2),
        };
    }

    async requestAccountClosure(user, reason) {
        if (!reason) {
            throw new Error('Please provide a reason for closure');
        }

        user.closureRequested = true;
        user.closureReason = reason;
        await user.save();
        
        return { message: 'Closure request submitted successfully' };
    }

    async fetchClosureRequests(email) {
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('User not found.');
        }

        return { requests: user.closureDetails };
    }

    async approveAccountClosure(username, isApproved, adminEmail) {
        const user = await User.findOne({ username });
        const admin = await User.findOne({ email: adminEmail });

        if (!user) {
            throw new Error('User not found.');
        }

        if (!admin) {
            throw new Error('Admin not found.');
        }

        if (isApproved) {
            user.isClosed = true;
            user.closureRequested = false;
            await user.save();
            admin.closureDetails.pull({ user: username });
            await admin.save();
            return { message: `Account closure approved for ${username}.` };
        } else {
            user.closureRequested = false;
            await user.save();
            admin.closureDetails.pull({ user: username });
            await admin.save();
            return { message: `Account closure rejected for ${username}.` };
        }
    }

    async getAllClosureRequests() {
        return await User.find({ 
            closureRequested: true 
        }).select('username closureReason');
    }

    async processClosureRequest(username, isApproved) {
        const user = await User.findOne({ username });

        if (!user) {
            throw new Error('User not found');
        }

        if (isApproved) {
            user.isClosed = true;
            user.closureRequested = false;
            await user.save();
            return { message: 'Account closure approved' };
        } else {
            user.closureRequested = false;
            user.closureReason = '';
            await user.save();
            return { message: 'Account closure rejected' };
        }
    }
}

module.exports = new AccountService(); 