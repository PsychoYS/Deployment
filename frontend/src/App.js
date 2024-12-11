import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import NewNavbar from './UI/navbar/NewNavbar';
import ChatSupport from './components/Chat/ChatSupport';
// import ChatbotWidget from './components/ChatbotWidget';

// Import your pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AccountOverview from './pages/AccountOverview';
import BalanceInquiry from './pages/BalanceInquiry';
import Bill from './pages/Bill';
import Transfer from './pages/Transfer';
import DisputePage from './pages/DisputePage';
import Messages from './pages/Messages';
import FAQ from './pages/FAQ';
import AdminPage from './pages/AdminPage';
import LoanApplication from './pages/LoanApplication';
import ChatSupportPage from './pages/ChatSupportPage';
import AccountClosureRequest from './pages/AccountClosureRequest';
import ScheduledTransfers from './pages/ScheduledTransfers';
import Feedback from './pages/Feedback';
import ATMLocator from './pages/ATMLocator';
import Transaction from './pages/Transaction';

const AuthenticatedRoute = ({ children, requireAdmin }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // Check if we're trying to access a public route while authenticated
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
        return <Navigate to={user?.isAdmin ? '/admin' : '/dashboard'} />;
    }

    // Check if we're trying to access a private route while not authenticated
    if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
        return <Navigate to="/login" />;
    }

    // Check admin access
    if (requireAdmin && !user?.isAdmin) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Public Routes */}
                <Route path="/login" element={
                    <AuthenticatedRoute>
                        <Login />
                    </AuthenticatedRoute>
                } />
                <Route path="/register" element={
                    <AuthenticatedRoute>
                        <Register />
                    </AuthenticatedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AuthenticatedRoute requireAdmin={true}>
                        <AdminPage />
                    </AuthenticatedRoute>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <AuthenticatedRoute>
                        <Dashboard />
                    </AuthenticatedRoute>
                } />
                <Route path="/account/overview" element={
                    <AuthenticatedRoute>
                        <AccountOverview />
                    </AuthenticatedRoute>
                } />
                <Route path="/balance" element={
                    <AuthenticatedRoute>
                        <BalanceInquiry />
                    </AuthenticatedRoute>
                } />
                <Route path="/bills" element={
                    <AuthenticatedRoute>
                        <Bill />
                    </AuthenticatedRoute>
                } />
                <Route path="/transfer" element={
                    <AuthenticatedRoute>
                        <Transfer />
                    </AuthenticatedRoute>
                } />
                <Route path="/disputes" element={
                    <AuthenticatedRoute>
                        <DisputePage />
                    </AuthenticatedRoute>
                } />
                <Route path="/messages" element={
                    <AuthenticatedRoute>
                        <Messages />
                    </AuthenticatedRoute>
                } />
                <Route path="/faq" element={
                    <AuthenticatedRoute>
                        <FAQ />
                    </AuthenticatedRoute>
                } />
                <Route path="/apply-loan" element={
                    <AuthenticatedRoute>
                        <LoanApplication />
                    </AuthenticatedRoute>
                } />
                <Route path="/chat-support" element={<AuthenticatedRoute><ChatSupportPage /></AuthenticatedRoute>} />
                <Route path="/request-closure" element={
                    <AuthenticatedRoute>
                        <AccountClosureRequest />
                    </AuthenticatedRoute>
                } />
                <Route path="/scheduled-transfers" element={
                    <AuthenticatedRoute>
                        <ScheduledTransfers />
                    </AuthenticatedRoute>
                } />
                <Route path="/feedback" element={
                    <AuthenticatedRoute>
                        <Feedback />
                    </AuthenticatedRoute>
                } />
                <Route path="/atm-locator" element={
                    <AuthenticatedRoute>
                        <ATMLocator />
                    </AuthenticatedRoute>
                } />
                {/* Transaction Routes */}
                <Route path="/transactions" element={
                    <AuthenticatedRoute>
                        <Transaction />
                    </AuthenticatedRoute>
                } />
                <Route path="/transactions/bills" element={
                    <AuthenticatedRoute>
                        <Bill />
                    </AuthenticatedRoute>
                } />
                <Route path="/transactions/transfer" element={
                    <AuthenticatedRoute>
                        <Transfer />
                    </AuthenticatedRoute>
                } />
                <Route path="/transactions/scheduled-transfer" element={
                    <AuthenticatedRoute>
                        <ScheduledTransfers />
                    </AuthenticatedRoute>
                } />
                <Route path="/transactions/messages" element={
                    <AuthenticatedRoute>
                        <Messages />
                    </AuthenticatedRoute>
                } />
            </Routes>
            {isAuthenticated && <ChatSupport />}
            {/* {isAuthenticated && <ChatbotWidget />} */}
        </>
    );
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <div className="App">
                        <NewNavbar />
                        <AppRoutes />
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
