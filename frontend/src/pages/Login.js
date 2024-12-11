import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';
import axiosInstance from '../utils/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isAdmin ? `${process.env.REACT_APP_API_URL} /api/users/admin-login` : '/api/users/login';
            const payload = isAdmin ? { adminPassword: password } : { email, password };

            console.log('Attempting login to:', endpoint);

            const response = await axiosInstance.post(endpoint, payload);

            if (response.data.token) {
                const { token, user } = response.data;
                login(token, user);
            }
        } catch (err) {
            console.error('Login error:', err.response || err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#121212',
            padding: '2rem'
        }}>
            <div style={{
                width: '400px',
                padding: '2rem',
                backgroundColor: '#1e1e1e',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        ...commonStyles.title,
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>Welcome!</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        color: '#e0e0e0',
                        opacity: 0.9
                    }}>
                        To your trusted banking partner
                    </p>
                </div>

                <div style={commonStyles.flexCenter}>
                    <label style={{
                        ...commonStyles.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => {
                                setIsAdmin(e.target.checked);
                                setError('');
                                setEmail('');
                                setPassword('');
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                        Admin Login
                    </label>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid #ff6b6b'
                    }}>
                        <p style={{ color: '#ff6b6b', margin: 0, textAlign: 'center' }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {!isAdmin && (
                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={commonStyles.input}
                                required={!isAdmin}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{
                            ...commonStyles.text,
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            {isAdmin ? 'Admin Password' : 'Password'}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={commonStyles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...commonStyles.button,
                            width: '100%',
                            marginTop: '1rem'
                        }}
                    >
                        {isAdmin ? 'Admin Login' : 'Login'}
                    </button>
                </form>
            </div>
            <style>
                {animations}
            </style>
        </div>
    );
};

export default Login;
