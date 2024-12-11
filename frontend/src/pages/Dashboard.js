import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { animations } from '../styles/commonStyles';

const Dashboard = () => {
    const { user } = useAuth();
    const [hoveredCard, setHoveredCard] = useState(null);
    
    return (
        <div style={styles.container}>
            <div style={styles.welcomeSection}>
                <h1 style={styles.title}>Welcome to Your Dashboard</h1>
                <p style={styles.welcomeText}>
                    Hello, {user?.username || 'Valued Customer'}! 
                    <br />
                    <span style={styles.subText}>
                        Access all your banking needs in one secure place
                    </span>
                </p>
            </div>
            
            <div style={styles.grid}>
                {[
                    { path: "/account/overview", title: "Account Overview", desc: "View your account details and balance" },
                    { path: "/balance", title: "Balance Inquiry", desc: "Check your current balance" },
                    { path: "/transactions", title: "Transactions", desc: "Make transfers, pay bills, and manage payments" },
                    { path: "/apply-loan", title: "Loan Services", desc: "Apply for a new loan" },
                    { path: "/disputes", title: "Disputes", desc: "Manage your disputes" },
                    { path: "/feedback", title: "Feedback", desc: "Share your feedback with us" },
                    { path: "/faq", title: "FAQ & Help", desc: "Get answers to common questions" }
                ].map((item, index) => (
                    <Link 
                        key={index}
                        to={item.path} 
                        className="floating-card"
                        style={{
                            ...styles.card,
                            animation: 'floatAnimation 3s ease-in-out infinite',
                            animationDelay: `${index * 0.2}s`,
                            ...(hoveredCard === index ? styles.cardHovered : {})
                        }}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div style={styles.cardContent}>
                            <h2 style={{
                                ...styles.cardTitle,
                                ...(hoveredCard === index ? styles.cardTitleHovered : {})
                            }}>
                                {item.title}
                            </h2>
                            <p style={{
                                ...styles.cardText,
                                ...(hoveredCard === index ? styles.cardTextHovered : {})
                            }}>
                                {item.desc}
                            </p>
                        </div>
                        <div style={{
                            ...styles.cardOverlay,
                            ...(hoveredCard === index ? styles.cardOverlayHovered : {})
                        }} />
                    </Link>
                ))}
            </div>
            <style>
                {animations}
                {`
                    @keyframes floatAnimation {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                    .floating-card:hover {
                        animation-play-state: paused;
                        transform: translateY(-15px) scale(1.03);
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    welcomeSection: {
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem',
        backgroundColor: '#1e1e1e',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        width: '100%',
        maxWidth: '1200px'
    },
    title: {
        color: '#d4af37',
        marginBottom: '1rem',
        fontSize: '2.5rem',
        textAlign: 'center',
        transition: 'color 0.3s ease',
    },
    welcomeText: {
        color: '#fff',
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
        transition: 'color 0.3s ease',
    },
    subText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.1rem',
        transition: 'color 0.3s ease',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        padding: '1rem',
        width: '100%',
        maxWidth: '1200px'
    },
    card: {
        backgroundColor: '#1e1e1e',
        padding: '1.5rem',
        borderRadius: '15px',
        textDecoration: 'none',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    },
    cardContent: {
        position: 'relative',
        zIndex: 2,
    },
    cardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0), rgba(212, 175, 55, 0))',
        transition: 'all 0.3s ease',
        zIndex: 1,
    },
    cardOverlayHovered: {
        background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0))',
    },
    cardHovered: {
        transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.3)',
        borderColor: '#d4af37',
        backgroundColor: '#2d2d2d',
    },
    cardTitle: {
        color: '#d4af37',
        marginBottom: '0.5rem',
        fontSize: '1.25rem',
        transition: 'all 0.3s ease',
        transform: 'translateZ(0)',
    },
    cardTitleHovered: {
        transform: 'translateZ(20px)',
        color: '#e5c158',
    },
    cardText: {
        color: '#fff',
        fontSize: '0.95rem',
        opacity: 0.8,
        transition: 'all 0.3s ease',
        transform: 'translateZ(0)',
    },
    cardTextHovered: {
        opacity: 1,
        color: '#fff',
        transform: 'translateZ(10px)',
    }
};

export default Dashboard;
