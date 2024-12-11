import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';

const ScheduledTransfers = () => {
    const { user } = useAuth();
    const [transfers, setTransfers] = useState([]);
    const [newTransfer, setNewTransfer] = useState({
        recipientAccount: '',
        amount: '',
        frequency: 'monthly',
        startDate: '',
        description: ''
    });
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/scheduled-transfer/list`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTransfers(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching transfers:', error);
            setError('Failed to fetch transfers');
        }
    };

    const handleCreateTransfer = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL} /api/scheduled-transfer/create`, {
                ...newTransfer,
                fromAccount: user.username
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage('Transfer scheduled successfully');
            setError('');
            fetchTransfers();
            setNewTransfer({
                recipientAccount: '',
                amount: '',
                frequency: 'monthly',
                startDate: '',
                description: ''
            });
        } catch (error) {
            console.error('Error creating transfer:', error);
            setError(error.response?.data?.message || 'Failed to create transfer');
            setMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTransfer = async (transferId, updates) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL} /api/scheduled-transfer/update/${transferId}`, updates, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage('Transfer updated successfully');
            setError('');
            fetchTransfers();
        } catch (error) {
            console.error('Error updating transfer:', error);
            setError(error.response?.data?.message || 'Failed to update transfer');
            setMessage('');
        }
    };

    const fetchHistory = async (transferId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/scheduled-transfer/history/${transferId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setHistory(response.data);
            setSelectedTransfer(transferId);
            setError('');
        } catch (error) {
            console.error('Error fetching history:', error);
            setError('Failed to fetch transfer history');
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
                    <h1 style={commonStyles.title}>Scheduled Transfers</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Set up and manage your recurring transfers
                    </p>
                </div>

                {error && (
                    <div style={{
                        ...commonStyles.section,
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderColor: '#ff6b6b',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        animation: 'slideIn 0.5s ease-out'
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
                        textAlign: 'center',
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <p style={{ color: '#4caf50', margin: 0 }}>{message}</p>
                    </div>
                )}

                {/* Create New Transfer Form */}
                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <h2 style={{
                        ...commonStyles.subtitle,
                        marginBottom: '1.5rem'
                    }}>
                        Create New Scheduled Transfer
                    </h2>
                    <form onSubmit={handleCreateTransfer} style={{
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
                                Recipient Account
                            </label>
                            <input
                                type="text"
                                placeholder="Enter recipient's account number"
                                value={newTransfer.recipientAccount}
                                onChange={(e) => setNewTransfer({ ...newTransfer, recipientAccount: e.target.value })}
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
                                placeholder="Enter amount"
                                value={newTransfer.amount}
                                onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })}
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
                                Frequency
                            </label>
                            <select
                                value={newTransfer.frequency}
                                onChange={(e) => setNewTransfer({ ...newTransfer, frequency: e.target.value })}
                                style={commonStyles.input}
                            >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                ...commonStyles.text,
                                display: 'block',
                                marginBottom: '0.5rem'
                            }}>
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={newTransfer.startDate}
                                onChange={(e) => setNewTransfer({ ...newTransfer, startDate: e.target.value })}
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
                                Description
                            </label>
                            <input
                                type="text"
                                placeholder="Enter transfer description"
                                value={newTransfer.description}
                                onChange={(e) => setNewTransfer({ ...newTransfer, description: e.target.value })}
                                style={commonStyles.input}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...commonStyles.button,
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Transfer...' : 'Create Transfer'}
                        </button>
                    </form>
                </div>

                {/* List of Scheduled Transfers */}
                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <h2 style={{
                        ...commonStyles.subtitle,
                        marginBottom: '1.5rem'
                    }}>
                        Your Scheduled Transfers
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {transfers.map((transfer, index) => (
                            <div
                                key={transfer.transferId}
                                style={{
                                    ...commonStyles.card,
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>To:</strong> {transfer.recipientAccount}
                                    </p>
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>Amount:</strong> ${transfer.amount}
                                    </p>
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>Frequency:</strong> {transfer.frequency}
                                    </p>
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>Next Transfer:</strong> {new Date(transfer.nextTransferDate).toLocaleDateString()}
                                    </p>
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>Status:</strong>{' '}
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.9rem',
                                            backgroundColor: transfer.status === 'active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                            color: transfer.status === 'active' ? '#4caf50' : '#ffc107',
                                            border: `1px solid ${transfer.status === 'active' ? '#4caf50' : '#ffc107'}`
                                        }}>
                                            {transfer.status}
                                        </span>
                                    </p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    justifyContent: 'flex-end'
                                }}>
                                    <button
                                        onClick={() => handleUpdateTransfer(transfer.transferId, {
                                            status: transfer.status === 'active' ? 'paused' : 'active'
                                        })}
                                        style={{
                                            ...commonStyles.button,
                                            backgroundColor: 'transparent',
                                            border: '1px solid #666'
                                        }}
                                    >
                                        {transfer.status === 'active' ? 'Pause' : 'Resume'}
                                    </button>
                                    <button
                                        onClick={() => fetchHistory(transfer.transferId)}
                                        style={commonStyles.button}
                                    >
                                        View History
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transfer History */}
                {selectedTransfer && (
                    <div style={{
                        ...commonStyles.section,
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <h2 style={{
                            ...commonStyles.subtitle,
                            marginBottom: '1.5rem'
                        }}>
                            Transfer History
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {history.map((record, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...commonStyles.card,
                                        animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                                    }}
                                >
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
                                    </p>
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <strong>Amount:</strong> ${record.amount}
                                    </p>
                                    <p style={{
                                        ...commonStyles.text
                                    }}>
                                        <strong>Status:</strong>{' '}
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.9rem',
                                            backgroundColor: record.status === 'completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                            color: record.status === 'completed' ? '#4caf50' : '#ffc107',
                                            border: `1px solid ${record.status === 'completed' ? '#4caf50' : '#ffc107'}`
                                        }}>
                                            {record.status}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Link
                    to="/transactions"
                    style={{
                        ...commonStyles.button,
                        display: 'inline-block',
                        marginTop: '2rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #666'
                    }}
                >
                    Back to Transactions
                </Link>
            </div>
            <style>
                {animations}
            </style>
        </div>
    );
};

export default ScheduledTransfers; 