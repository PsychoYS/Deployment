import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { commonStyles, animations } from '../styles/commonStyles';

const BalanceInquiry = () => {
    const [balance, setBalance] = useState(null);
    const [balanceStats, setBalanceStats] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to refresh the token
    const refreshToken = async () => {
        try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) throw new Error('No refresh token available');

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, { refreshToken: storedRefreshToken });
            const { accessToken } = response.data;

            localStorage.setItem('token', accessToken);
            return accessToken;
        } catch (err) {
            console.error('Error refreshing token:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return null;
        }
    };

    // Function to fetch balance
    const getBalance = async () => {
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/balance/balance`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBalance(response.data.balance);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error fetching balance';
            console.error('Error fetching balance:', errorMessage);

            if (errorMessage.includes('Token') || errorMessage.includes('unauthorized')) {
                const newToken = await refreshToken();
                if (newToken) {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/balance/balance`, {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        });
                        setBalance(response.data.balance);
                    } catch (retryErr) {
                        console.error('Error fetching balance after token refresh:', retryErr.message);
                        setError('Failed to fetch balance after refreshing the token');
                    }
                }
            } else {
                setError(errorMessage);
            }

            if (errorMessage.includes('Token')) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        }
    };

    // Function to fetch balance insights
    const getBalanceInsights = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/balance/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBalanceStats({
                spent: parseFloat(response.data.spent || 0).toFixed(2),
                remaining: parseFloat(response.data.remaining || 0).toFixed(2),
                balanceChange: parseFloat(response.data.balanceChange || 0).toFixed(2)
            });
        } catch (err) {
            console.error('Error fetching balance insights:', err.message);
            setError('Failed to fetch balance insights');
        }
    };

    useEffect(() => {
        getBalance();
        getBalanceInsights();
    }, [navigate]);

    return (
        <div style={commonStyles.pageContainer}>
            <div style={commonStyles.contentWrapper}>
                <div style={{
                    ...commonStyles.section,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <h1 style={commonStyles.title}>Balance Inquiry</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        View your account balance and insights
                    </p>
                </div>

                {error && (
                    <div style={{
                        ...commonStyles.section,
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderColor: '#ff6b6b',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#ff6b6b', margin: 0 }}>{error}</p>
                    </div>
                )}

                <div style={{
                    ...commonStyles.section,
                    marginBottom: '2rem',
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <h2 style={commonStyles.subtitle}>Account Balance</h2>
                    {balance === null ? (
                        <div style={{
                            ...commonStyles.flexCenter,
                            padding: '2rem'
                        }}>
                            <p style={commonStyles.text}>Loading...</p>
                        </div>
                    ) : (
                        <div style={{
                            ...commonStyles.flexCenter,
                            flexDirection: 'column',
                            padding: '2rem'
                        }}>
                            <p style={{
                                ...commonStyles.text,
                                fontSize: '1.2rem',
                                marginBottom: '1rem'
                            }}>
                                Your current balance is:
                            </p>
                            <p style={{
                                color: '#d4af37',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                margin: 0
                            }}>
                                ${balance.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <h2 style={commonStyles.subtitle}>Balance Insights</h2>
                    {balanceStats ? (
                        <div style={commonStyles.grid}>
                            <div style={{
                                ...commonStyles.card,
                                cursor: 'default',
                                animation: 'floatAnimation 3s ease-in-out infinite'
                            }}>
                                <h3 style={{
                                    ...commonStyles.subtitle,
                                    fontSize: '1.1rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Spent this month
                                </h3>
                                <p style={{
                                    color: '#d4af37',
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}>
                                    ${balanceStats.spent}
                                </p>
                            </div>
                            <div style={{
                                ...commonStyles.card,
                                cursor: 'default',
                                animation: 'floatAnimation 3s ease-in-out infinite',
                                animationDelay: '0.2s'
                            }}>
                                <h3 style={{
                                    ...commonStyles.subtitle,
                                    fontSize: '1.1rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Remaining budget
                                </h3>
                                <p style={{
                                    color: '#d4af37',
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}>
                                    ${balanceStats.remaining}
                                </p>
                            </div>
                            <div style={{
                                ...commonStyles.card,
                                cursor: 'default',
                                animation: 'floatAnimation 3s ease-in-out infinite',
                                animationDelay: '0.4s'
                            }}>
                                <h3 style={{
                                    ...commonStyles.subtitle,
                                    fontSize: '1.1rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Balance change
                                </h3>
                                <p style={{
                                    color: balanceStats.balanceChange >= 0 ? '#4caf50' : '#ff6b6b',
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}>
                                    {balanceStats.balanceChange}%
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            ...commonStyles.flexCenter,
                            padding: '2rem'
                        }}>
                            <p style={commonStyles.text}>Loading balance insights...</p>
                        </div>
                    )}
                </div>
            </div>
            <style>
                {animations}
            </style>
        </div>
    );
};

export default BalanceInquiry;
