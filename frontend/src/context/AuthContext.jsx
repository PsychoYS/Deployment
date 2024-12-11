import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Set axios default base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Force login page on mount
    useEffect(() => {
        // Clear all auth data
        localStorage.clear();
        sessionStorage.clear();
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
        
        // Force redirect to login
        navigate('/login');
    }, []);

    // Add axios interceptor to handle server errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.code === 'ERR_NETWORK' || error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (token, userData) => {
        try {
            // Test connection to server
            await axios.get('/api/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // If successful, set auth data
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            setAuthToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Navigate based on user role
            if (userData.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setAuthToken(null);
        setUser(null);
        setAccountDetails(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const fetchAccountOverview = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.get(`/api/account/overview`, config);
            setAccountDetails(response.data);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            } else {
                setAccountDetails(null);
                setError('Error fetching account overview');
            }
        }
    };

    return (
        <AuthContext.Provider value={{ 
            authToken, 
            user,
            accountDetails, 
            error, 
            login, 
            logout,
            fetchAccountOverview,
            isAuthenticated,
            isAdmin: user?.isAdmin || false
        }}>
            {children}
        </AuthContext.Provider>
    );
};
