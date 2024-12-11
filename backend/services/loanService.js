const User = require('../models/User');

class LoanService {
    async applyForLoan(userId, { loanAmount, interestRate, termInMonths }) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Validate loan parameters
            if (!loanAmount || !interestRate || !termInMonths) {
                throw new Error('Please provide all required fields');
            }

            // Create loan details
            const loanDetails = {
                loanAmount,
                interestRate,
                termInMonths,
                startDate: new Date(),
                outstandingBalance: loanAmount,
                repaymentSchedule: this.generateRepaymentSchedule(loanAmount, interestRate, termInMonths)
            };

            // Add loan to user's loans array
            user.loanDetails.push(loanDetails);
            await user.save();

            return {
                message: 'Loan applied successfully.',
                loanDetails
            };
        } catch (error) {
            throw new Error(error.message || 'Error applying for loan');
        }
    }

    generateRepaymentSchedule(loanAmount, interestRate, termInMonths) {
        const monthlyInterestRate = (interestRate / 100) / 12;
        const monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths)) / 
                             (Math.pow(1 + monthlyInterestRate, termInMonths) - 1);

        const schedule = [];
        let remainingBalance = loanAmount;

        for (let i = 0; i < termInMonths; i++) {
            const interestPayment = remainingBalance * monthlyInterestRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;

            schedule.push({
                date: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
                amount: monthlyPayment
            });
        }

        return schedule;
    }

    async getLoanDetails(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Return all loans
        return user.loanDetails || [];
    }

    async getAllLoans(adminId) {
        // Verify admin status
        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            throw new Error('Not authorized. Admin access required.');
        }

        // Get all users with loan details
        const usersWithLoans = await User.find({
            'loanDetails': { $exists: true, $ne: null }
        }).select('username email loanDetails');

        return usersWithLoans;
    }
}

module.exports = new LoanService(); 