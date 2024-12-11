const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const repaymentScheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true }
});

const loanDetailsSchema = new mongoose.Schema({
    loanAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    termInMonths: { type: Number, required: true },
    startDate: { type: Date, required: true },
    outstandingBalance: { type: Number, required: true },
    repaymentSchedule: [repaymentScheduleSchema]
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    isAdmin: { type: Boolean, default: false },
    closureRequested: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    closureDetails: {
        type: [
            {
                user: { type: String, default: '' },
                reason: { type: String, default: '' },
            }
        ],
        default: []
    },
    loanDetails: [loanDetailsSchema],
    // New fields added
    bankName: { type: String, default: '' }, // Field for the user's bank name
    country: { type: String, default: '' },  // Field for the user's country

    // New Bills field to track bill payments
    bills: [
        {
            billid: String,
            type: String,
            amount: Number,
            dueDate: Date,
            status: {
                type: String,
                enum: ['pending', 'paid'],
                default: 'pending'
            },
            transaction: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transaction'
            }
        }
    ],

    // Scheduled Transfers field
    scheduledTransfers: [
        {
            transferId: { type: Number, required: true },
            recipientAccount: { type: String, required: true },
            amount: { type: Number, required: true },
            frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
            nextTransferDate: { type: Date, required: true },
            description: String,
            status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
            history: [{
                date: { type: Date, required: true },
                status: { type: String, required: true },
                amount: { type: Number, required: true },
                transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }
            }],
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

// Add password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
