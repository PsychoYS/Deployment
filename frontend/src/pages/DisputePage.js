import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commonStyles, animations } from '../styles/commonStyles';
import axios from 'axios';

const DisputePage = () => {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const [disputes, setDisputes] = useState([]);
    const [newDispute, setNewDispute] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }
        fetchDisputes();
    }, [authToken, navigate]);

    const fetchDisputes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setDisputes(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching disputes');
        }
    };

    const handleSubmitDispute = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/disputes`,
                { description: newDispute },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            setNewDispute('');
            setMessage('Dispute submitted successfully');
            setError(null);
            fetchDisputes();
        } catch (err) {
            setError('Error submitting dispute');
            setMessage('');
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
                    <h1 style={commonStyles.title}>Your Disputes</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        Submit and manage your disputes
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
                    <h2 style={{
                        ...commonStyles.subtitle,
                        marginBottom: '1.5rem'
                    }}>
                        Submit New Dispute
                    </h2>
                    <form onSubmit={handleSubmitDispute} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <textarea
                            value={newDispute}
                            onChange={(e) => setNewDispute(e.target.value)}
                            placeholder="Describe your dispute in detail..."
                            required
                            style={{
                                ...commonStyles.input,
                                minHeight: '150px',
                                resize: 'vertical'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                ...commonStyles.button,
                                alignSelf: 'flex-end'
                            }}
                        >
                            Submit Dispute
                        </button>
                    </form>
                </div>

                <div style={{
                    ...commonStyles.section,
                    animation: 'slideIn 0.5s ease-out'
                }}>
                    <h2 style={{
                        ...commonStyles.subtitle,
                        marginBottom: '1.5rem'
                    }}>
                        Previous Disputes
                    </h2>

                    {disputes.length === 0 ? (
                        <div style={{
                            ...commonStyles.flexCenter,
                            padding: '3rem'
                        }}>
                            <p style={{
                                ...commonStyles.text,
                                opacity: 0.7
                            }}>
                                No disputes found
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {disputes.map((dispute, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...commonStyles.card,
                                        cursor: 'default',
                                        animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                                    }}
                                >
                                    <p style={{
                                        ...commonStyles.text,
                                        marginBottom: '1rem'
                                    }}>
                                        {dispute.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <span style={{
                                            ...commonStyles.text,
                                            fontSize: '0.9rem',
                                            opacity: 0.7
                                        }}>
                                            {new Date(dispute.createdAt).toLocaleDateString()}
                                        </span>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.9rem',
                                            backgroundColor: dispute.status === 'Resolved' ? 'rgba(76, 175, 80, 0.1)' :
                                                dispute.status === 'In Progress' ? 'rgba(33, 150, 243, 0.1)' :
                                                    'rgba(255, 193, 7, 0.1)',
                                            color: dispute.status === 'Resolved' ? '#4caf50' :
                                                dispute.status === 'In Progress' ? '#2196f3' :
                                                    '#ffc107',
                                            border: `1px solid ${dispute.status === 'Resolved' ? '#4caf50' :
                                                    dispute.status === 'In Progress' ? '#2196f3' :
                                                        '#ffc107'
                                                }`
                                        }}>
                                            {dispute.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
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

export default DisputePage; 