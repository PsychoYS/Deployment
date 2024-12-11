const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
    generateToken(user) {
        return jwt.sign(
            { 
                id: user._id,
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '5m' }
        );
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken(user);

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        };
    }

    async register(username, email, password) {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists');
        }

        // Create new user
        user = await User.create({
            username,
            email,
            password,
            balance: 0,
            transactionHistory: []
        });

        const token = this.generateToken(user);

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: false
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
}

module.exports = new AuthService(); 