const userService = require('../services/userService');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await userService.register(username, email, password);
        res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        const status = error.message === 'User already exists' ? 400 : 500;
        res.status(status).json({ 
            message: error.message || 'Server Error during registration'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        console.error('Login error:', error);
        const status = 
            error.message === 'Invalid credentials' ? 401 :
            error.message === 'Account is closed' ? 403 : 500;
        res.status(status).json({ 
            message: error.message || 'Server Error during login'
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { adminPassword } = req.body;
        const result = await userService.adminLogin(adminPassword);
        res.json(result);
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(401).json({ message: error.message || 'Server error during admin login' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        const status = error.message === 'User not found' ? 404 : 500;
        res.status(status).json({ 
            message: error.message || 'Error fetching user profile'
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await userService.updateUserProfile(req.user.id, req.body);
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        const status = error.message === 'User not found' ? 404 : 500;
        res.status(status).json({ 
            message: error.message || 'Error updating user profile'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    adminLogin,
    getUserProfile,
    updateUserProfile
};
