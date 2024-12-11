import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AccountOverview = () => {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }

        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/account/overview`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setAccountDetails(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching account details');
            }
        };

        fetchAccountDetails();
    }, [authToken, navigate]);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Account Overview</h1>

            {error && <p style={styles.error}>{error}</p>}

            {accountDetails ? (
                <>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Personal Information</h2>
                        <div style={styles.infoContainer}>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Name:</span>
                                <span style={styles.value}>{accountDetails.name}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Email:</span>
                                <span style={styles.value}>{accountDetails.email}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Account Status:</span>
                                <span style={{
                                    ...styles.badge,
                                    backgroundColor: accountDetails.accountStatus === 'Active' ? '#1b5e20' : '#b71c1c'
                                }}>
                                    {accountDetails.accountStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Financial Overview</h2>
                        <div style={styles.infoContainer}>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Balance:</span>
                                <span style={styles.amount}>${accountDetails.balance}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Accrued Interest:</span>
                                <span style={styles.amount}>${accountDetails.interest}</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={styles.loading}>Loading account details...</div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff'
    },
    title: {
        color: '#d4af37',
        fontSize: '2rem',
        textAlign: 'center',
        marginBottom: '2rem'
    },
    section: {
        backgroundColor: '#242424',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    sectionTitle: {
        color: '#d4af37',
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.5rem'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0'
    },
    label: {
        color: '#fff',
        fontSize: '1rem'
    },
    value: {
        color: '#fff',
        fontSize: '1rem'
    },
    amount: {
        color: '#d4af37',
        fontSize: '1.2rem',
        fontWeight: 'bold'
    },
    badge: {
        padding: '0.25rem 1rem',
        borderRadius: '1rem',
        fontSize: '0.9rem',
        color: '#fff'
    },
    error: {
        backgroundColor: '#b71c1c',
        color: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center'
    },
    loading: {
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.1rem',
        padding: '2rem'
    }
};

export default AccountOverview;
