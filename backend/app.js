require('dotenv').config({ path: './config/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/account');
const accountClosureRoutes = require('./routes/accountClosureRoutes');
const loanRoutes = require('./routes/loanRoutes');
const chatRouter = require('./routes/chatRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const feedbackRoutes = require('./routes/feedback');
const billRoutes = require('./routes/billRoutes');
const transferRoutes = require('./routes/transferRoutes');
const scheduledTransferRoutes = require('./routes/scheduledTransferRoutes');
const messageRoutes = require('./routes/messageRoutes');
const balanceRoutes = require('./routes/balanceRoutes');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/closure', accountClosureRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/disputes', disputeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/scheduled-transfer', scheduledTransferRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/balance', balanceRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Bank Management System API is running',
        status: 'active',
        endpoints: {
            auth: '/api/users',
            account: '/api/account',
            balance: '/api/balance',
            transfer: '/api/transfer',
            bills: '/api/bills',
            disputes: '/api/disputes',
            feedback: '/api/feedback'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Add this after all your routes but before the error handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

module.exports = app;
