import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NewNavbar = () => {
    const { isAuthenticated, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.brand}>
                    Bank System
                </Link>

                <div style={styles.links}>
                    {isAuthenticated ? (
                        <>
                            {isAdmin ? (
                                // Admin Links
                                <>
                                    <Link to="/admin" style={styles.link}>Dashboard</Link>
                                </>
                            ) : (
                                // User Links
                                <>
                                    <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                                    <Link to="/account/overview" style={styles.link}>Account</Link>
                                    <Link to="/balance" style={styles.link}>Balance</Link>
                                    <Link to="/transactions" style={styles.link}>Transactions</Link>
                                    <Link to="/apply-loan" style={styles.link}>Loans</Link>
                                    <Link to="/disputes" style={styles.link}>Disputes</Link>
                                    <Link to="/feedback" style={styles.link}>Feedback</Link>
                                    <Link to="/request-closure" style={styles.link}>Close Account</Link>
                                </>
                            )}
                            <button onClick={handleLogout} style={styles.logoutButton}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" style={styles.link}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#1a1a1a',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    brand: {
        color: '#d4af37',
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.95rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            color: '#d4af37',
        },
    },
    logoutButton: {
        backgroundColor: '#2d2d2d',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: '#ff6b6b',
            color: '#fff',
        },
    },
};

export default NewNavbar; 