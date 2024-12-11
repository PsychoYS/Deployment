import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')));

    useEffect(() => {
        // Initialize auth state from localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            setAuthToken(token);
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            authToken, 
            user, 
            login, 
            logout,
            isAdmin: user?.isAdmin || false,
            isAuthenticated: !!authToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 