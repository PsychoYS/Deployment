import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { commonStyles, animations } from '../styles/commonStyles';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/messages/list`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages(response.data);
            setUnreadCount(response.data.filter(msg => !msg.isRead).length);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to fetch messages');
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL} /api/messages/read/${messageId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchMessages();
        } catch (error) {
            console.error('Error marking message as read:', error);
            setError('Failed to mark message as read');
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
                    <h1 style={commonStyles.title}>Messages</h1>
                    <div style={{
                        ...commonStyles.flexCenter,
                        gap: '0.5rem'
                    }}>
                        <p style={{
                            ...commonStyles.text,
                            fontSize: '1.2rem',
                            opacity: 0.9,
                            margin: 0
                        }}>
                            View and manage your notifications
                        </p>
                        {unreadCount > 0 && (
                            <span style={{
                                backgroundColor: '#d4af37',
                                color: '#121212',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                animation: 'fadeIn 0.3s ease-out'
                            }}>
                                {unreadCount} unread
                            </span>
                        )}
                    </div>
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
                    {messages.map((message, index) => (
                        <div
                            key={message._id}
                            style={{
                                ...commonStyles.card,
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                backgroundColor: message.isRead ? '#1e1e1e' : '#2d2d2d',
                                borderColor: message.isRead ? 'rgba(255, 255, 255, 0.1)' : '#d4af37',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                animation: `slideIn 0.5s ease-out ${index * 0.1}s`,
                                transform: 'none'
                            }}
                            onClick={() => handleMarkAsRead(message._id)}
                            className="message-card"
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                lineHeight: 1
                            }}>
                                {message.type === 'transfer' && '💸'}
                                {message.type === 'bill' && '📃'}
                                {message.type === 'scheduled' && '⏰'}
                                {message.type === 'general' && '📌'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    ...commonStyles.subtitle,
                                    fontSize: '1.1rem',
                                    marginBottom: '0.5rem',
                                    color: '#d4af37'
                                }}>
                                    {message.title}
                                </h3>
                                <p style={{
                                    ...commonStyles.text,
                                    marginBottom: '0.5rem'
                                }}>
                                    {message.content}
                                </p>
                                <p style={{
                                    ...commonStyles.text,
                                    fontSize: '0.9rem',
                                    opacity: 0.5,
                                    margin: 0
                                }}>
                                    {new Date(message.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div style={{
                            ...commonStyles.flexCenter,
                            padding: '3rem',
                            opacity: 0.7
                        }}>
                            <p style={commonStyles.text}>No messages to display</p>
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
                    .message-card:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
                    }
                `}
            </style>
        </div>
    );
};

export default Messages; 