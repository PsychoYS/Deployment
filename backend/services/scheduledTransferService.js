const User = require('../models/User');
const Transaction = require('../models/Transaction');

class ScheduledTransferService {
    async createScheduledTransfer(userId, { recipientAccount, amount, frequency, startDate, description }) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Generate a unique transferId
        const transferId = Date.now();

        const newTransfer = {
            transferId,
            recipientAccount,
            amount,
            frequency,
            nextTransferDate: new Date(startDate),
            description,
            status: 'active',
            history: []
        };

        user.scheduledTransfers.push(newTransfer);
        await user.save();

        return {
            message: 'Scheduled transfer created',
            scheduledTransfer: newTransfer
        };
    }

    async getScheduledTransfers(userId) {
        const user = await User.findById(userId)
            .populate('scheduledTransfers.history.transaction');

        if (!user) {
            throw new Error('User not found');
        }

        return user.scheduledTransfers;
    }

    async updateScheduledTransfer(userId, transferId, updates) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const transfer = user.scheduledTransfers.find(t => 
            t.transferId.toString() === transferId.toString()
        );

        if (!transfer) {
            throw new Error('Scheduled transfer not found');
        }

        // Update allowed fields
        if (updates.amount) transfer.amount = updates.amount;
        if (updates.frequency) transfer.frequency = updates.frequency;
        if (updates.status) transfer.status = updates.status;

        await user.save();
        return { message: 'Scheduled transfer updated', transfer };
    }

    async getTransferHistory(userId, transferId) {
        const user = await User.findById(userId)
            .populate('scheduledTransfers.history.transaction');

        if (!user) {
            throw new Error('User not found');
        }

        const transfer = user.scheduledTransfers.find(t => 
            Number(t.transferId) === Number(transferId)
        );

        if (!transfer) {
            throw new Error('Scheduled transfer not found');
        }

        return transfer.history;
    }

    async processScheduledTransfers() {
        const users = await User.find({
            'scheduledTransfers': { 
                $elemMatch: { 
                    status: 'active',
                    nextTransferDate: { $lte: new Date() }
                }
            }
        });

        for (const user of users) {
            for (const transfer of user.scheduledTransfers) {
                if (transfer.status === 'active' && new Date(transfer.nextTransferDate) <= new Date()) {
                    await this.executeScheduledTransfer(user, transfer);
                }
            }
        }
    }

    async executeScheduledTransfer(user, transfer) {
        try {
            const recipient = await User.findOne({ username: transfer.recipientAccount });
            if (!recipient) {
                throw new Error('Recipient not found');
            }

            if (user.balance < transfer.amount) {
                throw new Error('Insufficient funds');
            }

            // Create transaction record
            const transaction = new Transaction({
                user: user._id,
                type: 'Scheduled Transfer',
                amount: transfer.amount,
                description: transfer.description,
                status: 'Completed',
                date: new Date()
            });

            // Update balances
            user.balance -= transfer.amount;
            recipient.balance += transfer.amount;

            // Update transfer history
            transfer.history.push({
                date: new Date(),
                status: 'completed',
                amount: transfer.amount,
                transaction: transaction._id
            });

            // Update next transfer date based on frequency
            transfer.nextTransferDate = this.calculateNextTransferDate(
                transfer.nextTransferDate,
                transfer.frequency
            );

            await Promise.all([
                transaction.save(),
                user.save(),
                recipient.save()
            ]);

            return transaction;
        } catch (error) {
            console.error('Error executing scheduled transfer:', error);
            throw error;
        }
    }

    calculateNextTransferDate(currentDate, frequency) {
        const date = new Date(currentDate);
        switch (frequency) {
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'yearly':
                date.setFullYear(date.getFullYear() + 1);
                break;
        }
        return date;
    }
}

module.exports = new ScheduledTransferService(); 