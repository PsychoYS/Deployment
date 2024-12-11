import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { commonStyles, animations } from '../styles/commonStyles';

const BillPaymentPage = () => {
    const [pendingBills, setPendingBills] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bills/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.pendingBills) {
                setPendingBills(response.data.pendingBills);
            } else {
                setError('No bills found');
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
            if (error.response) {
                setError(error.response.data.message || 'Error fetching bills');
            } else if (error.request) {
                setError('Network error - please try again later');
            } else {
                setError('Error fetching bills');
            }
        }
    };

    const handlePayBill = async (billId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await axios.post(`${import.meta.env.t}/api/bills/pay`,
                { billId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage(response.data.message);
            setPendingBills(pendingBills.filter(bill => bill.billid !== billId));
        } catch (error) {
            console.error('Error paying bill:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to pay bill');
            } else if (error.request) {
                setError('Network error - please try again later');
            } else {
                setError('Error processing payment');
            }
        }
    };

    return (
        <div style={commonStyles.pageContainer}>
            <div style={commonStyles.contentWrapper}>
                <div style={{
                    ...commonStyles.section,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <h1 style={commonStyles.title}>Bill Payments</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Manage and pay your bills
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

                {message && (
                    <div style={{
                        ...commonStyles.section,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderColor: '#4caf50',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#4caf50', margin: 0 }}>{message}</p>
                    </div>
                )}

                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    {pendingBills.length === 0 ? (
                        <div style={{
                            ...commonStyles.flexCenter,
                            padding: '3rem',
                            opacity: 0.7
                        }}>
                            <p style={commonStyles.text}>No pending bills</p>
                        </div>
                    ) : (
                        <div style={commonStyles.grid}>
                            {pendingBills.map((bill, index) => (
                                <div
                                    key={bill.billid}
                                    style={{
                                        ...commonStyles.card,
                                        animation: `floatAnimation 3s ease-in-out infinite`,
                                        animationDelay: `${index * 0.2}s`,
                                        cursor: 'default'
                                    }}
                                    className="bill-card"
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        height: '100%'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                ...commonStyles.subtitle,
                                                color: '#d4af37',
                                                marginBottom: '1rem'
                                            }}>
                                                {bill.type}
                                            </h3>
                                            <p style={{
                                                ...commonStyles.text,
                                                fontSize: '1.5rem',
                                                color: '#d4af37',
                                                marginBottom: '0.5rem'
                                            }}>
                                                ${bill.amount}
                                            </p>
                                            <p style={{
                                                ...commonStyles.text,
                                                opacity: 0.7
                                            }}>
                                                Due: {new Date(bill.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handlePayBill(bill.billid)}
                                            style={{
                                                ...commonStyles.button,
                                                marginTop: 'auto',
                                                width: '100%'
                                            }}
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{
                    ...commonStyles.flexCenter,
                    marginTop: '2rem'
                }}>
                    <Link
                        to="/transactions"
                        style={{
                            ...commonStyles.button,
                            backgroundColor: '#2d2d2d',
                            textDecoration: 'none'
                        }}
                    >
                        Back to Transactions
                    </Link>
                </div>
            </div>
            <style>
                {animations}
                {`
                    .bill-card:hover {
                        animation-play-state: paused;
                        transform: translateY(-5px);
                    }
                `}
            </style>
        </div>
    );
};

export default BillPaymentPage;