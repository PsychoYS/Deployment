const User = require('../models/User');
const Transaction = require('../models/Transaction');

class TransferService {
    async internalTransfer(userId, { toAccount, amount, description, fromAccount }) {
        if (!toAccount || !amount || !description || !fromAccount) {
            throw new Error('Missing required fields for internal transfer.');
        }

        const sender = await User.findById(userId);
        if (!sender) {
            throw new Error('User not found');
        }

        if (sender.balance < amount) {
            throw new Error('Insufficient funds for internal transfer.');
        }

        // Fetch the recipient user by username
        const recipient = await User.findOne({ username: toAccount });
        if (!recipient) {
            throw new Error('Recipient user not found.');
        }

        // Validate bankName and country
        if (sender.bankName !== recipient.bankName || sender.country !== recipient.country) {
            throw new Error('Internal transfer requires the same bank name and country.');
        }

        // Create transaction record
        const transaction = new Transaction({
            user: sender._id,
            type: 'Internal Transfer',
            description,
            amount,
            fromAccount,
            toAccount,
            status: 'Completed',
            date: new Date(),
        });

        // Update balances and save changes
        sender.balance -= parseFloat(amount);
        recipient.balance = parseFloat(recipient.balance) + parseFloat(amount);
        sender.transactionHistory.push(transaction._id);

        await Promise.all([
            transaction.save(),
            sender.save(),
            recipient.save()
        ]);

        return {
            message: 'Internal transfer completed successfully.',
            transaction
        };
    }

    async externalTransfer(userId, { toAccount, amount, description, fromAccount }) {
        if (!toAccount || !amount || !description || !fromAccount) {
            throw new Error('Missing required fields for external transfer.');
        }

        const sender = await User.findById(userId);
        if (!sender) {
            throw new Error('User not found');
        }

        if (sender.balance < amount) {
            throw new Error('Insufficient funds for external transfer.');
        }

        const recipient = await User.findOne({ username: toAccount });
        if (!recipient) {
            throw new Error('Recipient user not found.');
        }

        // Validate country
        if (sender.country !== recipient.country) {
            throw new Error('External transfer requires the same country.');
        }

        const transaction = new Transaction({
            user: sender._id,
            type: 'External Transfer',
            description,
            amount,
            fromAccount,
            toAccount,
            status: 'Completed',
            date: new Date(),
        });

        sender.balance -= parseFloat(amount);
        recipient.balance = parseFloat(recipient.balance) + parseFloat(amount);
        sender.transactionHistory.push(transaction._id);

        await Promise.all([
            transaction.save(),
            sender.save(),
            recipient.save()
        ]);

        return {
            message: 'External transfer completed successfully.',
            transaction
        };
    }

    async internationalTransfer(userId, { toAccount, amount, description, fromAccount }) {
        if (!toAccount || !amount || !description || !fromAccount) {
            throw new Error('Missing required fields for international transfer.');
        }

        const sender = await User.findById(userId);
        if (!sender) {
            throw new Error('User not found');
        }

        if (sender.balance < amount) {
            throw new Error('Insufficient funds for international transfer.');
        }

        const recipient = await User.findOne({ username: toAccount });
        if (!recipient) {
            throw new Error('Recipient user not found.');
        }

        const transaction = new Transaction({
            user: sender._id,
            type: 'International Transfer',
            description,
            amount,
            fromAccount,
            toAccount,
            status: 'Completed',
            date: new Date(),
        });

        sender.balance -= parseFloat(amount);
        recipient.balance = parseFloat(recipient.balance) + parseFloat(amount);
        sender.transactionHistory.push(transaction._id);

        await Promise.all([
            transaction.save(),
            sender.save(),
            recipient.save()
        ]);

        return {
            message: 'International transfer completed successfully.',
            transaction
        };
    }
}

module.exports = new TransferService(); 