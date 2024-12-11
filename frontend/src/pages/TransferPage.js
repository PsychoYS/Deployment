import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';

const TransferPage = () => {
    const { user } = useAuth();
    const [transferType, setTransferType] = useState('internal');
    const [formData, setFormData] = useState({
        toAccount: '',
        amount: '',
        description: '',
        recipientBank: '',
        recipientName: '',
        recipientAccount: '',
        exchangeRate: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        let endpoint = '';
        switch (transferType) {
            case 'internal':
                endpoint = `/api/transfer/internal`;
                break;
            case 'external':
                endpoint = `/api/transfer/external`;
                break;
            case 'international':
                endpoint = `/api/transfer/international`;
                break;
            default:
                return;
        }

        try {
            const transferData = {
                ...formData,
                fromAccount: user.username
            };

            const response = await axios.post(endpoint, transferData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage(response.data.message);
            setFormData({
                toAccount: '',
                amount: '',
                description: '',
                recipientBank: '',
                recipientName: '',
                recipientAccount: '',
                exchangeRate: '',
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Transfer failed');
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
                    <h1 style={commonStyles.title}>Transfer Funds</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Send money securely to any account
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

                <div style={{
                    ...commonStyles.section,
                    maxWidth: '800px',
                    margin: '0 auto',
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                Transfer Type:
                            </label>
                            <select
                                name="transferType"
                                value={transferType}
                                onChange={(e) => setTransferType(e.target.value)}
                                style={commonStyles.input}
                            >
                                <option value="internal">Internal</option>
                                <option value="external">External</option>
                                <option value="international">International</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                To Account:
                            </label>
                            <input
                                type="text"
                                name="toAccount"
                                value={formData.toAccount}
                                onChange={handleChange}
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
                                Amount:
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
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
                                Description:
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={commonStyles.input}
                                required
                            />
                        </div>

                        {(transferType === 'external' || transferType === 'international') && (
                            <>
                                <div>
                                    <label style={{
                                        ...commonStyles.text,
                                        display: 'block',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Recipient Bank:
                                    </label>
                                    <input
                                        type="text"
                                        name="recipientBank"
                                        value={formData.recipientBank}
                                        onChange={handleChange}
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
                                        Recipient Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleChange}
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
                                        Recipient Account:
                                    </label>
                                    <input
                                        type="text"
                                        name="recipientAccount"
                                        value={formData.recipientAccount}
                                        onChange={handleChange}
                                        style={commonStyles.input}
                                        required
                                    />
                                </div>

                                {transferType === 'international' && (
                                    <div>
                                        <label style={{
                                            ...commonStyles.text,
                                            display: 'block',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Exchange Rate:
                                        </label>
                                        <input
                                            type="number"
                                            name="exchangeRate"
                                            value={formData.exchangeRate}
                                            onChange={handleChange}
                                            style={commonStyles.input}
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            <button 
                                type="submit" 
                                style={commonStyles.button}
                            >
                                Submit Transfer
                            </button>
                            <Link 
                                to="/transactions" 
                                style={{
                                    ...commonStyles.button,
                                    backgroundColor: '#2d2d2d',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                Back to Transactions
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <style>
                {animations}
            </style>
        </div>
    );
};

export default TransferPage;