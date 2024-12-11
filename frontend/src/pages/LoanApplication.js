import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';

const LoanApplication = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [termInMonths, setTermInMonths] = useState('');
    const [message, setMessage] = useState('');
    const [loanDetails, setLoanDetails] = useState(null);
    const [error, setError] = useState('');
    const { authToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            fetchLoanDetails();
        }
    }, [authToken]);

    const fetchLoanDetails = async () => {
        try {
            if (!authToken) {
                console.error('No auth token available');
                setError('Please log in to view loan details');
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL} /api/loan/details`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const loans = Array.isArray(response.data) ? response.data : [];
            setLoanDetails(loans);
            setError('');
        } catch (err) {
            console.error('Error fetching loan details:', err);
            const errorMessage = err.response?.data?.message || 'Failed to fetch loan details';
            setError(errorMessage);
            setLoanDetails([]);
        }
    };

    const applyForLoan = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL} /api/loan/apply-loan`,
                {
                    loanAmount: Number(loanAmount),
                    interestRate: Number(interestRate),
                    termInMonths: Number(termInMonths),
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            setMessage('Loan application successful!');
            setLoanAmount('');
            setInterestRate('');
            setTermInMonths('');
            fetchLoanDetails();
        } catch (err) {
            console.error('Frontend error details:', err);
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
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
                    <h1 style={commonStyles.title}>Loan Services</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Apply for a loan or view your existing loans
                    </p>
                </div>

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

                <div style={commonStyles.grid}>
                    {/* Loan Application Form */}
                    <div style={{
                        ...commonStyles.card,
                        animation: 'slideIn 0.5s ease-out',
                        cursor: 'default'
                    }}>
                        <h2 style={{
                            ...commonStyles.subtitle,
                            color: '#d4af37',
                            marginBottom: '1.5rem'
                        }}>
                            Apply for a Loan
                        </h2>
                        <form onSubmit={applyForLoan} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{
                                    ...commonStyles.text,
                                    display: 'block',
                                    marginBottom: '0.5rem'
                                }}>
                                    Loan Amount
                                </label>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    style={commonStyles.input}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{
                                    ...commonStyles.text,
                                    display: 'block',
                                    marginBottom: '0.5rem'
                                }}>
                                    Interest Rate (%)
                                </label>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    style={commonStyles.input}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{
                                    ...commonStyles.text,
                                    display: 'block',
                                    marginBottom: '0.5rem'
                                }}>
                                    Term (Months)
                                </label>
                                <input
                                    type="number"
                                    value={termInMonths}
                                    onChange={(e) => setTermInMonths(e.target.value)}
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
                                Apply for Loan
                            </button>
                        </form>
                    </div>

                    {/* Existing Loans */}
                    {loanDetails && loanDetails.length > 0 ? (
                        loanDetails.map((loan, index) => (
                            <div
                                key={index}
                                style={{
                                    ...commonStyles.card,
                                    animation: `floatAnimation 3s ease-in-out infinite`,
                                    animationDelay: `${index * 0.2}s`,
                                    cursor: 'default'
                                }}
                                className="loan-card"
                            >
                                <h2 style={{
                                    ...commonStyles.subtitle,
                                    color: '#d4af37',
                                    marginBottom: '1.5rem'
                                }}>
                                    Loan #{index + 1}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={commonStyles.text}>Loan Amount:</span>
                                        <span style={{ ...commonStyles.text, color: '#d4af37' }}>${loan.loanAmount}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={commonStyles.text}>Interest Rate:</span>
                                        <span style={{ ...commonStyles.text, color: '#d4af37' }}>{loan.interestRate}%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={commonStyles.text}>Term:</span>
                                        <span style={{ ...commonStyles.text, color: '#d4af37' }}>{loan.termInMonths} months</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={commonStyles.text}>Outstanding:</span>
                                        <span style={{ ...commonStyles.text, color: '#d4af37' }}>${loan.outstandingBalance}</span>
                                    </div>
                                </div>

                                {loan.repaymentSchedule && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h3 style={{
                                            ...commonStyles.subtitle,
                                            fontSize: '1rem',
                                            marginBottom: '1rem'
                                        }}>
                                            Repayment Schedule
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {loan.repaymentSchedule.map((payment, pIndex) => (
                                                <div
                                                    key={pIndex}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: '0.5rem',
                                                        backgroundColor: '#2d2d2d',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <span style={{ ...commonStyles.text, fontSize: '0.9rem' }}>
                                                        {new Date(payment.date).toLocaleDateString()}
                                                    </span>
                                                    <span style={{ ...commonStyles.text, fontSize: '0.9rem', color: '#d4af37' }}>
                                                        ${payment.amount}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{
                            ...commonStyles.card,
                            animation: 'slideIn 0.5s ease-out',
                            cursor: 'default',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '3rem'
                        }}>
                            <p style={{ ...commonStyles.text, opacity: 0.7 }}>No active loans found</p>
                        </div>
                    )}
                </div>
            </div>
            <style>
                {animations}
                {`
                    .loan-card:hover {
                        animation-play-state: paused;
                        transform: translateY(-5px);
                    }
                `}
            </style>
        </div>
    );
};

export default LoanApplication;
