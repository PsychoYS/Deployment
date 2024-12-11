const User = require('../models/User');
const Transaction = require('../models/Transaction');

class BillService {
    async fetchPendingBills(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            pendingBills: user.bills ? user.bills.filter(bill => bill.status === 'pending') : []
        };
    }

    async payBill(userId, billId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const bill = user.bills.find(bill => bill.billid === billId && bill.status === 'pending');
        if (!bill) {
            throw new Error('Bill not found or already paid');
        }

        if (user.balance < bill.amount) {
            throw new Error('Insufficient balance to pay the bill');
        }

        // Create transaction
        const transaction = new Transaction({
            user: user._id,
            type: 'Bill Payment',
            description: `Payment for ${bill.type} bill`,
            amount: bill.amount,
            billDetails: {
                billid: bill.billid,
                billType: bill.type,
                dueDate: bill.dueDate
            },
            status: 'Completed',
            date: new Date()
        });

        // Save transaction
        await transaction.save();

        // Update user's balance and bill status
        user.balance -= bill.amount;
        bill.status = 'paid';
        bill.transaction = transaction._id;
        await user.save();

        return {
            message: 'Bill paid successfully',
            transaction,
            remainingBalance: user.balance
        };
    }
}

module.exports = new BillService(); 