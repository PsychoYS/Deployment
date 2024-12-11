// // controllers/authController.js
// const authService = require('../services/authService');

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const result = await authService.login(email, password);
//         res.json(result);
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(401).json({ message: error.message || 'Server error during login' });
//     }
// };

// const register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const result = await authService.register(username, email, password);
//         res.status(201).json(result);
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(400).json({ message: error.message || 'Server error during registration' });
//     }
// };

// const adminLogin = async (req, res) => {
//     try {
//         const { adminPassword } = req.body;
//         const result = await authService.adminLogin(adminPassword);
//         res.json(result);
//     } catch (error) {
//         console.error('Admin login error:', error);
//         res.status(401).json({ message: error.message || 'Server error during admin login' });
//     }
// };

// module.exports = {
//     login,
//     register,
//     adminLogin
// };
