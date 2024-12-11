const User = require('../models/User');
const Transaction = require('../models/Transaction');

class ATMService {
    async checkBalance(user) {
        if (!user) {
            throw new Error('User not found');
        }
        return {
            balance: user.balance || 0,
            accountNumber: user.accountNumber
        };
    }

    async withdraw(user, amount) {
        if (!user) {
            throw new Error('User not found');
        }

        if (amount <= 0) {
            throw new Error('Invalid withdrawal amount');
        }

        if (user.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Create transaction record
        const transaction = new Transaction({
            userId: user._id,
            type: 'withdrawal',
            amount: amount,
            status: 'completed',
            timestamp: new Date()
        });

        // Update user balance
        user.balance -= amount;
        user.transactionHistory.push(transaction._id);

        // Save both records
        await Promise.all([
            transaction.save(),
            user.save()
        ]);

        return {
            message: 'Withdrawal successful',
            newBalance: user.balance,
            transactionId: transaction._id
        };
    }

    async deposit(user, amount) {
        if (!user) {
            throw new Error('User not found');
        }

        if (amount <= 0) {
            throw new Error('Invalid deposit amount');
        }

        // Create transaction record
        const transaction = new Transaction({
            userId: user._id,
            type: 'deposit',
            amount: amount,
            status: 'completed',
            timestamp: new Date()
        });

        // Update user balance
        user.balance += amount;
        user.transactionHistory.push(transaction._id);

        // Save both records
        await Promise.all([
            transaction.save(),
            user.save()
        ]);

        return {
            message: 'Deposit successful',
            newBalance: user.balance,
            transactionId: transaction._id
        };
    }

    async getTransactionHistory(user) {
        if (!user) {
            throw new Error('User not found');
        }

        const transactions = await Transaction.find({
            userId: user._id
        }).sort({ timestamp: -1 }).limit(10);

        return transactions;
    }
}

module.exports = new ATMService(); 