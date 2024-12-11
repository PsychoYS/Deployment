const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: [
            'Internal Transfer',
            'External Transfer',
            'International Transfer',
            'Bill Payment',
            'Scheduled Transfer',
            'ATM Locator'
        ],
        required: true
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    fromAccount: { type: String },
    toAccount: { type: String },
    transferDetails: {
        type: {
            recipientBank: { type: String },
            recipientName: { type: String },
            recipientAccount: { type: String },
            exchangeRate: { type: Number, default: 1.0 },
            transferFee: { type: Number, default: 0 },
            totalAmount: { type: Number }
        },
        default: null
    },
    scheduleDetails: {
        type: {
            interval: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: null },
            nextPaymentDate: { type: Date, default: null },
            endDate: { type: Date, default: null }
        },
        default: null
    },
    billDetails: {
        type: {
            billid: { type: Number },
            billType: { type: String },
            dueDate: { type: Date },
            lateFee: { type: Number, default: 0 },
        },
        default: null
    },
    atmDetails: {
        type: {
            atmLocation: { type: String },
            atmStatus: { type: String, enum: ['Available', 'Out of Service'], default: 'Available' },
        },
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
