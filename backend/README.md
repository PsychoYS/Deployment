# Bank Management System - Backend

## Setup
1. Install dependencies:    bash
   npm install   
2. Install frontend dependencies:   bash
   npm run install-client   
3. Create .env file with required environment variables
4. Run development server:   bash
   npm run dev   
5. Run both frontend and backend:   bash
   npm run start-all   
6. Build frontend for production:   bash
   npm run build-client   

## Scripts
- npm start - Start production server
- npm run dev - Start development server with nodemon
- npm run install-client - Install frontend dependencies
- npm run build-client - Build frontend for production
- npm run start-all - Start both frontend and backend in development mode

## Environment Variables
- PORT: Server port (default 5000)
- MONGO_URI: MongoDB connection string
- JWT_SECRET: Secret for JWT tokens

## API Endpoints
- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- GET /api/balance - Get user balance
- GET /api/balance/insights - Get balance insights
- POST /api/loan/apply - Apply for loan
- GET /api/transactions - Get transaction history

## Project Structure