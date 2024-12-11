const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, adminLogin } = require('../controllers/userController');
const User = require('../models/User');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);

// Get current user
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

module.exports = router;
