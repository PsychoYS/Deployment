const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserService {
    generateToken(user) {
        return jwt.sign(
            { 
                id: user._id,
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );
    }

    async register(username, email, password) {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('User already exists');
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            balance: 0,
            transactionHistory: []
        });

        const token = this.generateToken(user);

        return {
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: false
            }
        };
    }

    async login(email, password) {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Check if account is closed
        if (user.isClosed) {
            throw new Error('Account is closed');
        }

        const token = this.generateToken(user);

        return {
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        };
    }

    async adminLogin(adminPassword) {
        const adminUser = await User.findOne({ isAdmin: true });
        
        if (!adminUser) {
            throw new Error('Admin account not found');
        }

        const isMatch = await adminUser.matchPassword(adminPassword);
        if (!isMatch) {
            throw new Error('Invalid admin password');
        }

        const token = this.generateToken(adminUser);

        return {
            token,
            user: {
                id: adminUser._id,
                username: adminUser.username,
                email: adminUser.email,
                isAdmin: true
            }
        };
    }

    async getUserProfile(userId) {
        const user = await User.findById(userId)
            .select('-password');  // Exclude password from the response
        
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateUserProfile(userId, updateData) {
        // Remove sensitive fields that shouldn't be updated directly
        const { password, isAdmin, ...safeUpdateData } = updateData;

        const user = await User.findByIdAndUpdate(
            userId,
            safeUpdateData,
            { new: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

module.exports = new UserService(); 