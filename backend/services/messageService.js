const Message = require('../models/Message');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

class MessageService {
    async getUserMessages(userId) {
        try {
            // First, check for existing transactions without messages
            const transactions = await Transaction.find({ user: userId });

            // Create messages for transactions that don't have them
            for (const transaction of transactions) {
                const existingMessage = await Message.findOne({
                    transactionId: transaction._id,
                    user: userId
                });

                if (!existingMessage) {
                    await this.createTransactionMessage(userId, transaction);
                }
            }

            // Fetch all messages
            const messages = await Message.find({ user: userId })
                .populate('transactionId')
                .sort({ createdAt: -1 });

            return messages;
        } catch (error) {
            throw new Error('Error fetching messages: ' + error.message);
        }
    }

    async markMessageAsRead(userId, messageId) {
        const message = await Message.findOneAndUpdate(
            { _id: messageId, user: userId },
            { isRead: true },
            { new: true }
        );

        if (!message) {
            throw new Error('Message not found');
        }

        return message;
    }

    async createTransactionMessage(userId, transaction) {
        try {
            let title, content, type;

            switch (transaction.type) {
                case 'Transfer':
                case 'Internal Transfer':
                    title = 'Internal Transfer';
                    content = `Transfer of $${transaction.amount} to account ${transaction.toAccount || 'account'} completed.`;
                    type = 'Internal Transfer';
                    break;
                case 'External Transfer':
                    title = 'External Transfer';
                    content = `External transfer of $${transaction.amount} to ${transaction.transferDetails?.recipientName || 'recipient'} completed.`;
                    type = 'External Transfer';
                    break;
                case 'International Transfer':
                    title = 'International Transfer';
                    content = `International transfer of $${transaction.amount} (${transaction.currency}) to ${transaction.transferDetails?.recipientName || 'recipient'} completed.`;
                    type = 'International Transfer';
                    break;
                case 'Bill Payment':
                    title = 'Bill Payment';
                    content = `Bill payment of $${transaction.amount} for ${transaction.billDetails?.billType || 'bill'} processed.`;
                    type = 'Bill Payment';
                    break;
                case 'Scheduled Transfer':
                    title = 'Scheduled Transfer';
                    content = `Scheduled transfer of $${transaction.amount} set for ${new Date(transaction.scheduleDetails?.nextPaymentDate).toLocaleDateString()}.`;
                    type = 'Scheduled Transfer';
                    break;
                case 'ATM Locator':
                    title = 'ATM Location';
                    content = `ATM at ${transaction.atmDetails?.atmLocation || 'location'} is ${transaction.atmDetails?.atmStatus}.`;
                    type = 'ATM Locator';
                    break;
                default:
                    title = 'Transaction Update';
                    content = `Transaction of $${transaction.amount} processed.`;
                    type = 'general';
            }

            const message = new Message({
                user: userId,
                title,
                content,
                transactionId: transaction._id,
                type: type,
                createdAt: transaction.date || transaction.createdAt
            });

            await message.save();
            return message;
        } catch (error) {
            throw new Error('Error creating transaction message: ' + error.message);
        }
    }
}

module.exports = new MessageService(); 