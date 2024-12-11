import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';
import axiosInstance from '../utils/axios';

const AccountClosureRequest = () => {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/closure/request`,
                { reason },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setSuccess(true);
            setError('');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error('Error submitting closure request:', err);
            setError(err.response?.data?.message || 'Failed to submit request');
            setSuccess(false);
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
                    <h1 style={commonStyles.title}>Account Closure Request</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        We're sorry to see you go. Please let us know why you're closing your account.
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
                                Reason for Closure
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide a detailed reason for closing your account..."
                                style={{
                                    ...commonStyles.input,
                                    minHeight: '200px',
                                    resize: 'vertical'
                                }}
                                required
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    ...commonStyles.button,
                                    backgroundColor: 'transparent',
                                    border: '1px solid #666'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={success}
                                style={{
                                    ...commonStyles.button,
                                    opacity: success ? 0.7 : 1,
                                    cursor: success ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {success ? 'Submitting...' : 'Submit Request'}
                            </button>
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

export default AccountClosureRequest;
