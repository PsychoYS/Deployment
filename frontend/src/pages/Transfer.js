import React, { useState } from 'react';
import axios from 'axios';
import { commonStyles, animations } from '../styles/commonStyles';

const TransferPage = () => {
    const [transferType, setTransferType] = useState('internal');
    const [formData, setFormData] = useState({
        toAccount: '',
        amount: '',
        description: '',
        fromAccount: '',
        recipientBank: '',
        recipientName: '',
        recipientAccount: '',
        exchangeRate: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        let endpoint = '';
        switch (transferType) {
            case 'internal':
                endpoint = `${process.env.REACT_APP_API_URL}/api/transfer/internal`;
                break;
            case 'external':
                endpoint = `${process.env.REACT_APP_API_URL}/api/transfer/external`;
                break;
            case 'international':
                endpoint = `${process.env.REACT_APP_API_URL}/api/transfer/international`;
                break;
            default:
                return;
        }

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage({ type: 'success', text: response.data.message });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred during the transfer'
            });
        } finally {
            setIsSubmitting(false);
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

                {message.text && (
                    <div style={{
                        ...commonStyles.section,
                        backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                        borderColor: message.type === 'success' ? '#4caf50' : '#ff6b6b',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <p style={{
                            color: message.type === 'success' ? '#4caf50' : '#ff6b6b',
                            margin: 0
                        }}>
                            {message.text}
                        </p>
                    </div>
                )}

                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                Transfer Type
                            </label>
                            <select
                                name="transferType"
                                value={transferType}
                                onChange={(e) => setTransferType(e.target.value)}
                                style={commonStyles.input}
                            >
                                <option value="internal">Internal Transfer</option>
                                <option value="external">External Transfer</option>
                                <option value="international">International Transfer</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                From Account
                            </label>
                            <input
                                type="text"
                                name="fromAccount"
                                value={formData.fromAccount}
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
                                To Account
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
                                Amount
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                style={commonStyles.input}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                Description
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
                                        Recipient Bank
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
                                        Recipient Name
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
                                        Recipient Account
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
                                            Exchange Rate
                                        </label>
                                        <input
                                            type="number"
                                            name="exchangeRate"
                                            value={formData.exchangeRate}
                                            onChange={handleChange}
                                            style={commonStyles.input}
                                            required
                                            min="0"
                                            step="0.0001"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            style={{
                                ...commonStyles.button,
                                marginTop: '1rem',
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing Transfer...' : 'Submit Transfer'}
                        </button>
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
